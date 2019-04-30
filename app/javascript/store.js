import {
  connectRouter,
  routerMiddleware
} from "connected-react-router/immutable";
import { createBrowserHistory } from "history";
import { Map } from "immutable";
import { applyMiddleware, compose, createStore } from "redux";
import { combineReducers } from "redux-immutable";
import { createLogger } from "redux-logger";
import thunkMiddleware from "redux-thunk";
import * as CasesPage from "./components/pages/cases";

// TODO: Temporarily setting basename
export const history = createBrowserHistory({
  basename: "v2"
});

export default () => {
  const preloadedState = Map();

  const middleware = [routerMiddleware(history), thunkMiddleware];

  if (process.env.NODE_ENV === "development") {
    middleware.push(createLogger({ stateTransformer: state => state.toJS() }));
  }

  const composeEnhancers =
    process.env.NODE_ENV !== "development" ||
    typeof window !== "object" ||
    !window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? compose
      : window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

  const store = createStore(
    combineReducers({
      router: connectRouter(history),
      ...CasesPage.reducers
    }),
    preloadedState,
    composeEnhancers(applyMiddleware(...middleware))
  );

  return store;
};
