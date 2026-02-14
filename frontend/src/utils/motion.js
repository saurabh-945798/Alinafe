import React from "react";

const passthrough = (Tag) =>
  React.forwardRef(({ children, ...props }, ref) =>
    React.createElement(Tag, { ...props, ref }, children)
  );

export const motion = {
  div: passthrough("div"),
  aside: passthrough("aside"),
  img: passthrough("img"),
  span: passthrough("span"),
  button: passthrough("button"),
};

export const AnimatePresence = ({ children }) =>
  React.createElement(React.Fragment, null, children);
