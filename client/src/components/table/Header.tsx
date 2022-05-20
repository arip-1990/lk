import React from "react";

interface PropsType {
  daysInMonth: number;
}

const Header: React.FC<PropsType> = ({ daysInMonth }) => {
  return (
    <div className="table-header">
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
        <thead>
          <tr>
            <th rowSpan={5} className="table-header_cell">№<br />п/п</th>
            <th rowSpan={5} className="table-header_cell">
              Фамилия инициалы, профессия, должность
            </th>
            <th rowSpan={5} className="table-header_cell">
              Таб. №
            </th>
            <th colSpan={daysInMonth > 30 ? 16 : 15} className="table-header_cell">
              Отметки о явках и неявках на работу по числам месяца
            </th>
            <th colSpan={2} className="table-header_cell">
              Отработано за
            </th>
            <th rowSpan={3} className="table-header_cell">
              Норма дней в мес. у сотрудника
            </th>
            <th rowSpan={2} colSpan={4} className="table-header_cell">
              Неявки по причинам
            </th>
          </tr>
          <tr>
            {Array.from(
              { length: daysInMonth > 30 ? 16 : 15 },
              (_, i) => i + 1
            ).map((item) => (
              <th key={`days-${item}-1`} className="table-header_cell">
                {item > 15 ? "" : item}
              </th>
            ))}
            <th rowSpan={2} className="table-header_cell">
              пол месяца
            </th>
            <th rowSpan={2} className="table-header_cell">месяц</th>
          </tr>
          <tr>
            {Array.from(
              { length: daysInMonth > 30 ? 16 : 15 },
              (_, i) => i + 1
            ).map((item: number) => (
              <th key={`days-${item}-2`} className="table-header_cell" />
            ))}
            <th rowSpan={3} className="table-header_cell">код</th>
            <th rowSpan={3} className="table-header_cell">
              дни (часы)
            </th>
            <th rowSpan={3} className="table-header_cell">код</th>
            <th rowSpan={3} className="table-header_cell">
              дни (часы)
            </th>
          </tr>
          <tr>
            {Array.from(
              { length: daysInMonth > 30 ? 16 : 15 },
              (_, i) => i + 16
            ).map((item) => (
              <th key={`days-${item}`} className="table-header_cell">
                {item > daysInMonth ? "" : item}
              </th>
            ))}
            <th colSpan={3} className="table-header_cell">
              дни
            </th>
          </tr>
          <tr>
            {Array.from(
              { length: daysInMonth > 30 ? 16 : 15 },
              (_, i) => i + 16
            ).map((item) => (
              <th key={`days-${item}-1`} className="table-header_cell" />
            ))}
            <th colSpan={3} className="table-header_cell">
              часы
            </th>
          </tr>
          <tr>
            <th className="table-header_cell table-header_cell__small">1</th>
            <th className="table-header_cell table-header_cell__small">2</th>
            <th className="table-header_cell table-header_cell__small">3</th>
            <th
              colSpan={daysInMonth > 30 ? 16 : 15}
              className="table-header_cell table-header_cell__small"
            >
              4
            </th>
            <th className="table-header_cell table-header_cell__small">5</th>
            <th className="table-header_cell table-header_cell__small">6</th>
            <th className="table-header_cell table-header_cell__small">7</th>
            <th className="table-header_cell table-header_cell__small">8</th>
            <th className="table-header_cell table-header_cell__small">9</th>
            <th className="table-header_cell table-header_cell__small">10</th>
            <th className="table-header_cell table-header_cell__small">11</th>
          </tr>
        </thead>
      </table>
    </div>
  );
};

export default Header;
