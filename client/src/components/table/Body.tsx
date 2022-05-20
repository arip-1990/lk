import React from "react";
import { Spin, Empty } from "antd";
import Row from "./Row";
import { ITimeCard } from '../../models/ITimeCard';

interface PropsType {
  data: ITimeCard[];
  daysInMonth: number;
  editable: boolean;
  loading?: boolean;
}

const Body: React.FC<PropsType> = ({ data, daysInMonth, editable, loading }) => {
  return (
    <div className="table-body">
      <table>
        <colgroup>
          <col style={{width: 32}} />
          <col style={{width: 212}} />
          <col style={{width: 86}} />
          {Array.from(
            { length: daysInMonth > 30 ? 16 : 15 },
            (_, i) => i + 1
          ).map(item => <col key={item} style={{width: 32}} />)}
          <col style={{width: 48}} />
          <col style={{width: 48}} />
          <col style={{width: 72}} />
          <col style={{width: 36}} />
          <col style={{width: 46}} />
          <col style={{width: 36}} />
          <col style={{width: 46}} />
        </colgroup>
        <tbody>
          {loading ? (
            <tr>
              <td
                className="table-body_cell"
                colSpan={daysInMonth > 30 ? 26 : 25}
              >
                <Spin />
              </td>
            </tr>
          ) : !data.length ? (
            <tr>
              <td
                className="table-body_cell"
                colSpan={daysInMonth > 30 ? 26 : 25}
              >
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <Row key={item.id} index={index + 1} data={item} daysInMonth={daysInMonth} editable={editable} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Body;
