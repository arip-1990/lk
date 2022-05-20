import React from "react";
import { Card } from "antd";
import moment from 'moment';

import Header from "../templates/timecard/Header";
import Body from "../templates/timecard/Body";

const Timecard: React.FC = () => {
  const [preparationDate, setPreparationDate] = React.useState<moment.Moment>(moment());

  return (
    <Card>
      <Header changePreparationDate={setPreparationDate} />
      <Body preparationDate={preparationDate} />
    </Card>
  );
};

export default Timecard;
