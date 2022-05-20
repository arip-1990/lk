import React from "react";
import moment from "moment";

import { EventType } from "./Calendar";

interface DayPropType {
  current: moment.Moment;
  selected: moment.Moment;
  today: moment.Moment;
  day: moment.Moment;
  events: EventType[];
  onSelected: (date: moment.Moment) => void
}

// const openDay = (event: any) => {
//   const $this = event.target;
//   let details, arrow;
//   let dayNumber =
//     +$this.querySelectorAll(".day-number")[0].innerText ||
//     +$this.querySelectorAll(".day-number")[0].textContent;
//   let day = new Date(current.setDate(dayNumber));
//   let currentOpened = document.querySelector(".details");

//   // Check to see if there is an open detais box on the current row
//   if (currentOpened && currentOpened.parentNode === $this.parentNode) {
//     details = currentOpened;
//     arrow = document.querySelector(".arrow");
//   } else {
//     //Close the open events on differnt week row
//     //currentOpened && currentOpened.parentNode.removeChild(currentOpened);
//     if (currentOpened) {
//       currentOpened.addEventListener("animationend", function () {
//         currentOpened?.parentNode?.removeChild(currentOpened);
//       });
//       currentOpened.className = "details out";
//     }

//     //Create the Details Container
//     details = window.createElement("div", "details in");
//     arrow = createElement("div", "arrow");

//     //Create the event wrapper

//     details.appendChild(arrow);
//     $this.parentNode.appendChild(details);
//   }

//   var todaysEvents = events.reduce((memo: any, ev) => {
//     if (ev.date.getDate() === day.getDate()) memo.push(ev);

//     return memo;
//   }, []);

//   this.renderEvents(todaysEvents, details);

//   arrow.style.left =
//     $this.offsetLeft - $this.parentNode.offsetLeft + 27 + "px";
// };

export const Day: React.FC<DayPropType> = ({ current, selected, today, day, events, onSelected }) => {
  const [todayEvents, setTodayEvents] = React.useState<EventType[]>([]);

  React.useEffect(() => {
    if (current.month() === day.month()) {
      setTodayEvents(
        events.reduce((memo: any, ev) => {
          if (ev.date.date() === day.date()) memo.push(ev);

          return memo;
        }, [])
      );
    }
  }, []);

  const getDayClass = () => {
    let classes = ["day"];
    if (day.month() !== current.month()) classes.push("other");
    else {
      if (day.isSame(today, 'date'))
        classes.push("today");
      if (day.isSame(selected, 'date'))
        classes.push("selected");
      if ([6, 0].includes(day.day())) classes.push("red");
    }

    return classes.join(" ");
  };

  return (
    <div className={getDayClass()} onClick={() => onSelected(day)}>
      <div className="day-number">{day.date()}</div>
      <div className="day-events">
        {todayEvents.map((event) => (
          <span className={event.color} />
        ))}
      </div>
    </div>
  );
};
