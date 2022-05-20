import React from "react";
import Header from "./Header";
import Body from "./Body";
import { ITimeCard } from '../../models/ITimeCard';
import { useDate } from "../../hooks/useDate";

interface PropsType {
  dataSource: ITimeCard[];
  editable: boolean;
  loading?: boolean;
}

const Table: React.FC<PropsType> = ({ dataSource, editable, loading }) => {
  const { selectedDate } = useDate();

  return (
    <section className="table-container">
      <Header daysInMonth={selectedDate.daysInMonth()} />
      <Body data={dataSource} daysInMonth={selectedDate.daysInMonth()} editable={editable} loading={loading} />
    </section>
  );
};

export default Table;
