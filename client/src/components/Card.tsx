import React from "react";
import classnames from "classnames";

import Book from "../images/book-1-1.png";

interface PropsType {
  title: string;
  description: string | null;
  size?: "small" | "middle";
  full?: boolean;
}

const Card: React.FC<PropsType> = ({
  title,
  description,
  size = "middle",
  full,
}) => {
  const descriptions = description ? description.split("|") : [];

  return (
    <div
      className={classnames("card-menu", {
        "card-menu__small": size === "small",
      })}
    >
      <div
        className="card-menu_title"
        style={{ flex: "0.8", fontSize: "0.95rem" }}
      >
        <img className="icon" src={Book} alt="" />
        {title.includes("Скорая помощь") ? (
          <p className="text text__red">{title}</p>
        ) : (
          <p className="text">{title}</p>
        )}
      </div>
      {full ? null : (
        <div className="card-menu_description">
          {descriptions.map((item, i) => (
            <span key={i}>{item.trim()}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Card;
