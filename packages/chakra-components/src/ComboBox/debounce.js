// TODO: Replace this with custom hook. Right now just a way to solve the problem
let debouncer = null;
function useDebounce(
  inputValue,
  passThroughFn,
  fetchStartCb,
  fetchCompleteCb,
  time = 0,
) {
  if (!debouncer) {
    debouncer = setTimeout(() => {
      fetchStartCb();
      passThroughFn(inputValue, data => {
        fetchCompleteCb(data);
      });
    }, time);
  } else {
    clearTimeout(debouncer);
    debouncer = setTimeout(() => {
      fetchStartCb();
      passThroughFn(inputValue, data => {
        fetchCompleteCb(data);
      });
    }, time);
  }
}
export default useDebounce;
