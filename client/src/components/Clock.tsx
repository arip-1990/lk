import React from "react";
import moment from "moment";

const Clock: React.FC = () => {
  const [time, setTime] = React.useState<moment.Moment>(moment());
  const interval = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    interval.current = setInterval(() => setTime(moment()), 1000);

    return () => {
      interval.current && clearInterval(interval.current);
    };
  }, []);

  return (
    <section className="clock">
      <span>{time.hours() >= 10 ? time.hours() : "0" + time.hours()}</span>

      <span className="dottes" />

      <span>
        {time.minutes() >= 10 ? time.minutes() : "0" + time.minutes()}
      </span>
    </section>
  );
};

export default Clock;
