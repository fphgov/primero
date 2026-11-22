# Frissítés és deploy (FPH fork)

Ez a leírás a Budapest-fork (`fph` branch) frissítéséről szól az upstream Primero-ból, és a frissítés élesítéséről.

## 1. Frissítés az upstreamről

### Egyszeri beállítás

```bash
git remote add upstream https://github.com/primeroIMS/primero.git
```

### A `main` frissítése

A `main` az upstream tükre, saját commit nem kerül rá.

```bash
git fetch upstream main:main
git push origin main
```

A `fetch upstream main:main` parancs bármelyik branchről működik, kivéve a `main`-t. Ha éppen a `main`-en állsz, ezt használd helyette:

```bash
git pull --ff-only upstream main
```

### Beolvasztás az `fph`-ba

```bash
git checkout fph
git merge --no-ff --no-commit main
```

A `--no-commit` miatt a merge eredménye stagelve marad, így commit előtt át tudod nézni. Az ütközések leginkább azokban a fájlokban várhatók, ahol eltérünk az upstreamtől. Ezeket a fájlokat így listázhatod:

```bash
git diff --name-only main...fph
```

### Mit hozott a frissítés?

```bash
git diff --cached -- config/version.rb
git diff --cached --name-status -- db/migrate db/data_migration
git diff --cached --name-status -- docker .ruby-version Gemfile package.json
git diff --cached -- docker/local.env.sample.production docker/application/root/entrypoint.sh
```

- **`db/migrate`:** van sémamigráció, lásd a 2.4. lépést.
- **`db/data_migration`:** van adatmigrációs script, lásd a 2.6. lépést és az ottani README-t.
- **`docker`, `.ruby-version`, `Gemfile`:** újra kell buildelni az érintett image-eket.
- **env minta, `entrypoint.sh`:** lehet új, kötelező env változó. Ezt vedd fel a `defaults.env`-be.

Ha rendben van, commitold, és a verziófüggő teendőket írd be ennek a fájlnak az alján lévő részbe:

```bash
git commit
git push origin fph
```

## 2. Deploy

Két mappával dolgozunk:

- **`primero/docker`**: itt buildeljük az image-eket.
- **Deploy mappa** (lokálisan `ddev/docker`, prodon ennek a megfelelője): itt van a `docker-compose.yaml`, a `defaults.env` és a mentő script. Minden `docker compose` parancsot innen futtass.

A prod szerveren a Dockert csak `sudo`-val lehet használni, ezért minden Dockert hívó parancs (a scriptek is) `sudo`-val szerepel.

### 2.1. Adatbázis mentése (deploy mappa)

```bash
sudo ./postgres_backup.sh
```

A script név alapján keresi a postgres konténert. Ha azt írja, hogy a konténer nem fut, vesd össze a scriptben megadott nevet a `sudo docker ps` kimenetével.

### 2.2. Image-ek buildelése (`primero/docker`)

```bash
sudo ./build.sh application
sudo ./build.sh nginx
```

Az nginx-et csak akkor kell újrabuildelni, ha a `docker/nginx` mappa változott.

### 2.3. Alkalmazás leállítása (deploy mappa)

```bash
sudo docker compose --profile app stop application worker nginx
```

Így a régi kód nem fut a már migrált adatbázissal. Az oldal ezalatt nem érhető el.

- **Az nginx-et is le kell állítani.** Az nginx csak induláskor oldja fel az `application` címét. Ha az application konténer az új image miatt újra létrejön, új IP-címet kaphat, és a tovább futó nginx a régire küldené a kéréseket (502). A 2.5. lépés az application után indítja.
- **`down` helyett `stop` kell.** A `down` a postgres-t is leállítja, a következő lépésben futó `run --rm application` pedig nem indítja el, mert az application-nek nincs `depends_on` beállítása. Így a migráció nem érné el az adatbázist.

### 2.4. Migráció

```bash
sudo docker compose --profile app run --rm application primero-migrate
```

Csak a még le nem futott sémamigrációkat futtatja, seedet nem.

Ne a `configure` service-t használd! Az `primero-bootstrap`-et futtat, ami a `defaults.env` beállításaitól függően seedelhet, vagy konfigurációt tölthet be a prod adatbázisba.

### 2.5. Indítás

```bash
sudo docker compose --profile app up -d
```

### 2.6. Adatmigrációs scriptek

Ha egy verzió ilyet is hoz, a `db/data_migration/v<verzió>/README.md` írja le. Mindegyiket így futtasd:

1. Először `true` nélkül. Ilyenkor csak kiírja, hány rekordot érintene.
2. Utána `true`-val, ekkor ír ténylegesen.
3. Még azelőtt, hogy a felhasználók belépnek. Egyes scriptek tömegesen írják felül a rekordokat, így egy közben mentett módosítás elveszhet.

```bash
sudo docker compose exec application bin/rails r ./db/data_migration/v<verzió>/<script>.rb
sudo docker compose exec application bin/rails r ./db/data_migration/v<verzió>/<script>.rb true
```

## 3. Verziófüggő teendők

### 2.15.0.2 → 2.16.1

- 8 sémamigráció (2.4. lépés). Az egyik törli az `incidents.srch_cp_sexual_violence_type` oszlopot, és helyette létrehozza a `srch_cp_incident_violence_type` oszlopot.
- Adatmigráció, ebben a sorrendben:
  1. `v2.16/calculate_searchable_cp_incident_violence_types.rb` (a README-ben hibásan, `s` nélkül szerepel a neve)
  2. `v2.16/calculate_case_incident_types.rb`
- A `v2.16.1/recalculate_case_incident_types.rb` nem kell. Csak annak kell, aki a v2.16-os scriptet még a 2.16.0-s kóddal futtatta.
- Új env változó nincs.
- Változott a Ruby, az Alpine és az nginx verziója, ezért az application és az nginx image-et is újra kell buildelni.
