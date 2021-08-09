import React from 'react';
import {useReducer, useContext} from 'react';

export function useAppContext<AppState, AppAction, QueryFn>(): {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  query: QueryFn;
} {
  const context = useContext(getAppContext<AppState, AppAction, QueryFn>());

  if (!context) {
    throw new Error('Context has not been instantiated');
  }

  return context;
}

export function useAppState<AppState, AppAction, QueryFn>(
  dispatchFn: (state: AppState, action: AppAction) => AppState,
  query: QueryFn,
  initialState: AppState,
  localStorageKey?: string,
): {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  query: QueryFn;
  AppContext: React.Context<{
    state: AppState;
    dispatch: React.Dispatch<AppAction>;
    query: QueryFn;
  }>;
} {
  const [state, dispatch] = useReducer((state: AppState, action: AppAction) => {
    const newState = dispatchFn(state, action);

    if (localStorageKey) {
      _persistState<AppState>(newState, localStorageKey);
    }

    return newState;
  }, (localStorageKey && _loadState<AppState>(localStorageKey)) || initialState);

  globalizeState<AppState, AppAction, QueryFn>(window, state, dispatch, query);

  return {
    state,
    dispatch,
    query,
    AppContext: getAppContext<AppState, AppAction, QueryFn>(),
  };
}

let AppContext: unknown = null;

function getAppContext<AppState, AppAction, QueryFn>(): React.Context<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  query: QueryFn;
}> {
  if (!AppContext) {
    AppContext = React.createContext<{
      state: AppState;
      dispatch: React.Dispatch<AppAction>;
      query: QueryFn;
    } | null>(null);
  }

  return AppContext as React.Context<{
    state: AppState;
    dispatch: React.Dispatch<AppAction>;
    query: QueryFn;
  }>;
}

function _persistState<AppState>(state: AppState, localStorageKey: string) {
  window.localStorage.setItem(localStorageKey, JSON.stringify(state));
}

function _loadState<AppState>(localStorageKey: string): AppState | null {
  const dataString = window.localStorage.getItem(localStorageKey);

  if (!dataString) {
    return null;
  }

  return JSON.parse(dataString);
}

function globalizeState<AppState, AppAction, QueryFn>(
  window: Window,
  state: AppState,
  dispatch: React.Dispatch<AppAction>,
  query: QueryFn,
) {
  // eslint-disable-next-line
  (window as any).substatiate = {
    state,
    dispatch,
    query,
  };
}
