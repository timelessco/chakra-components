import { useReducer, useCallback } from "react";

const initialState = {
  initiated: false,
  success: false,
  failed: false,
  errorMessage: "",
  data: [],
  completedOnce: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "EMPTY_INPUT":
      return { ...state, data: action.payload.data };

    case "SET_CACHED_OPTIONS":
      return { ...state, data: action.payload.data };

    case "PROMISE_STARTED":
      return {
        ...state,
        initiated: true,
        success: false,
        failed: false,
        errorMessage: "",
      };

    case "PROMISE_RESOLVE_SUCCESS":
      return {
        ...state,
        initiated: false,
        success: true,
        failed: false,
        errorMessage: "",
        data: action.payload.data,
        completedOnce: true,
      };

    case "END_INITIATION":
      return {
        ...state,
        initiated: false,
      };

    case "PROMISE_RESOLVE_FAILURE":
      return {
        ...state,
        initiated: false,
        success: false,
        failed: true,
        errorMessage: action.payload.errorMessage,
        data: [],
        completedOnce: true,
      };

    default:
      return state;
  }
}
export const useAsyncFetching = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return {
    state,
    onEmptyInputValue: useCallback(
      data => dispatch({ type: "EMPTY_INPUT", payload: { data } }),
      [],
    ),
    setCachedOptions: useCallback(
      data => dispatch({ type: "SET_CACHED_OPTIONS", payload: { data } }),
      [],
    ),
    onAsyncStart: useCallback(() => dispatch({ type: "PROMISE_STARTED" }), []),
    onAsyncSuccess: useCallback(
      data => dispatch({ type: "PROMISE_RESOLVE_SUCCESS", payload: { data } }),
      [],
    ),
    onAsyncEnd: useCallback(() => dispatch({ type: "END_INITIATION" }), []),
    onAsyncFailure: useCallback(
      errorMessage =>
        dispatch({
          type: "PROMISE_RESOLVE_FAILURE",
          payload: { errorMessage },
        }),
      [],
    ),
  };
};
