import React from "react";

import { EventType } from "./Calendar";

export const Events = ({
  events,
  newEvent,
}: {
  events: EventType[];
  newEvent: boolean;
}) => {
  return (
    <div className={"events in" + (newEvent ? " new" : "")}>
      {events.length ? (
        events.map((event, i) => (
          <div key={i} className="event">
            <div className={"event-category " + event.color}></div>
            <span>{event.name}</span>
          </div>
        ))
      ) : (
        <div className="event empty">
          <span>No Events</span>
        </div>
      )}
    </div>
  );
};
