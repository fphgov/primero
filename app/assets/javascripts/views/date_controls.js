_primero.Views.DateControl = _primero.Views.Base.extend({
	el: 'body',

	allowed_formats: [
    "DD-MM-YYYY",
    "DD/MM/YYYY",
    "DD MM YYYY",
    "DD-MMM-YYYY",
    "DD/MMM/YYYY"
	],

	events: {
		'change .form_date_field': 'format_date_input'
	},

	initialize: function() {
		this.create_locales();
		this.setup_date_parser();

		_primero.dates.options = {
			language: I18n.currentLocale(),
			todayButton: new Date(),
			dateFormat: "dd-M-yyyy",
			clearButton: true,
			onSelect: function(formattedDate, date, inst) {
        $(inst.el).trigger('change');
    	}
		};

		$('.form_date_field').datepicker(_primero.dates.options);
	},

	create_locales: function() {
		var dateI18n = I18n.lookup('date');

		$.fn.datepicker.language[I18n.currentLocale()] = {
			days: dateI18n.day_names,
			daysShort: dateI18n.abbr_month_names,
			daysMin: dateI18n.abbr_day_names_short,
			months: _.compact(dateI18n.month_names),
			monthsShort: _.compact(dateI18n.abbr_month_names),
			today: dateI18n.today,
			clear: dateI18n.clear,
			firstDay: dateI18n.first_day
		};

		moment.locale(I18n.currentLocale(), {
			monthsShort: _.compact(I18n.lookup('date').abbr_month_names),
			monthsParseExact : true
		});
	},

	setup_date_parser: function() {
		_primero.dates = {};
	  _primero.dates.defaultDateFormat = 'DD-MMM-YYYY';
		_primero.dates.inputFormats = this.allowed_formats;

		_primero.dates.parseDate = function(value) {
			var date = moment(value, _primero.dates.inputFormats, I18n.currentLocale(), true).toDate();
			return date === 'Invalid date' ? undefined : date;
		}

		_primero.dates.formatDate = function(value) {
			var date = moment(value).format(_primero.dates.defaultDateFormat)
			return date === 'Invalid date' ? undefined : date;
		}
	},

	format_date_input: function(event) {
		var $control = $(event.target);
		var date = _primero.dates.parseDate($control.val());

		if (date != undefined && date != null) {
			$control.val(_primero.dates.formatDate(date));
		}
	}
});