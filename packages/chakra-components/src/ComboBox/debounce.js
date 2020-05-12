// TODO: Replace this with custom hook. Right now just a way to solve the problem
let debouncer = null;
function useDebounce(
  inputValue,
  passThroughFn,
  setDebounceState,
  fetchStartCb,
  fetchCompleteCb,
  fetchErrorCb,
  time = 0,
) {
  if (!debouncer) {
    setDebounceState(true);
    debouncer = setTimeout(() => {
      setDebounceState(false);
      fetchStartCb();
      passThroughFn(
        inputValue,
        data => {
          debouncer = null;
          fetchCompleteCb(data);
        },
        errorMessage => {
          debouncer = null;
          fetchErrorCb(errorMessage);
        },
      );
    }, time);
  } else {
    clearTimeout(debouncer);
    debouncer = setTimeout(() => {
      setDebounceState(false);
      fetchStartCb();
      passThroughFn(
        inputValue,
        data => {
          debouncer = null;
          fetchCompleteCb(data);
        },
        errorMessage => {
          debouncer = null;
          fetchErrorCb(errorMessage);
        },
      );
    }, time);
  }
}
export default useDebounce;
