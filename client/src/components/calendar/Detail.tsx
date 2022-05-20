import React from "react";

type Props = {
  children?: React.ReactNode;
};

export const Detail: React.FC<Props> = ({ children }) => {
  return (
    <section className="details out">
      <div className="arrow"></div>
      <div className="events in">{children}</div>
    </section>
  );
};
