import React from "react";
import "./styles.css";

export const FlexRow = (props: { children: React.ReactNode }) => {
  return <div className="FlexRow">{props.children}</div>;
};

export const FlexColumn = (props: { children: React.ReactNode }) => {
  return <div className="FlexColumn">{props.children}</div>;
};
