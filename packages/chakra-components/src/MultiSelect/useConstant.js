import { useRef } from "react";

export const useConstant = fn => {
  const ref = useRef();

  if (!ref.current) {
    ref.current = { v: fn() };
  }

  return ref.current.v;
};
