// TODO: Should move to helpers
import { useEffect, useReducer } from "react";

const initialState = {
  initiated: false,
  success: false,
  failed: false,
  errorMessage: false,
  data: [],
  completedOnce: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "PROMISE_STARTED":
      return {
        ...state,
        initiated: true,
        success: false,
        failed: false,
        errorMessage: null,
        data: [],
      };
    case "PROMISE_RESOLVE_SUCCESS":
      return {
        ...state,
        initiated: false,
        success: true,
        failed: false,
        errorMessage: null,
        data: action.payload.data,
        completedOnce: true,
      };
    case "PROMISE_RESOLVE_FAILURE":
      return {
        ...state,
        initiated: false,
        success: false,
        failed: true,
        errorMessage: action.payload.message,
      };
    default:
      return state;
  }
}
const useAsyncFetching = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return {
    state,
    onAsyncStart: () => dispatch({ type: "PROMISE_STARTED" }),
    onAsyncSuccess: data =>
      dispatch({ type: "PROMISE_RESOLVE_SUCCESS", payload: { data } }),
    onAsyncFailure: errorMessage =>
      dispatch({ type: "PROMISE_RESOLVE_FAILURE", payload: { errorMessage } }),
  };
};

export default useAsyncFetching;
