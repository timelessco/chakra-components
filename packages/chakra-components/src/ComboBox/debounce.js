// TODO: Replace this with custom hook. Right now just a way to solve the problem
let debouncer = null;
function useDebounce(inputValue, passThroughFn, completeCb, time = 0) {
  if (!debouncer) {
    debouncer = setTimeout(() => {
      passThroughFn(inputValue, data => {
        completeCb(data);
      });
    }, time);
  } else {
    clearTimeout(debouncer);
    debouncer = setTimeout(() => {
      passThroughFn(inputValue, data => {
        completeCb(data);
      });
    }, time);
  }
}
export default useDebounce;
