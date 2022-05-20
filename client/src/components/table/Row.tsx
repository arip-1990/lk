import React from "react";
import { Select, Input, Form, notification } from "antd";
import { ITimeCard } from "../../models/ITimeCard";
import moment from "moment";
import { useDate } from "../../hooks/useDate";

interface PropsType {
  data: ITimeCard;
  daysInMonth: number;
  index: number;
  editable: boolean;
}

const CustomSelect: React.FC<{
  value?: string;
  onChange?: any;
}> = ({ value, onChange }) => {
  return (
    <Select
      size="small"
      showArrow={false}
      bordered={false}
      allowClear
      style={{ color: "#da291c" }}
      dropdownStyle={{ minWidth: 48 }}
      value={value}
      onChange={onChange}
    >
      <Select.Option value="Я">Я</Select.Option>
      <Select.Option value="В">В</Select.Option>
      <Select.Option value="Р">Р</Select.Option>
      <Select.Option value="Б">Б</Select.Option>
      <Select.Option value="Г">Г</Select.Option>
      <Select.Option value="С">С</Select.Option>
      <Select.Option value="УВ">УВ</Select.Option>
      <Select.Option value="ОТ">ОТ</Select.Option>
      <Select.Option value="ДО">ДО</Select.Option>
      <Select.Option value="ПР">ПР</Select.Option>
      <Select.Option value="НН">НН</Select.Option>
    </Select>
  );
};

const InputNumber: React.FC<{
  value?: string;
  onChange?: any;
  onChanged?: (oldValue: number, newValue: number) => void;
}> = ({ value, onChange, onChanged }) => {
  const [oldValue, setOldValue] = React.useState<number>(0);

  React.useEffect(() => {
    if (value) setOldValue(parseInt(value));
  }, []);

  const changeHourValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.currentTarget.value.replace(/\D+/, ""));
  };

  const handleBlur = () => {
    if (value && onChanged) {
      const tmp = parseInt(value || "0");
      onChanged(oldValue, tmp);
      setOldValue(tmp);
    }
  };

  return (
    <Input
      size="small"
      bordered={false}
      maxLength={2}
      style={{ textAlign: "center", color: "#da291c", padding: 0 }}
      onChange={changeHourValue}
      onBlur={handleBlur}
      value={value}
    />
  );
};

const Row: React.FC<PropsType> = ({ data, daysInMonth, index, editable }) => {
  const [totalHalfDays, setTotalHalfDays] = React.useState<number>(0);
  const [totalHalfHours, setTotalHalfHours] = React.useState<number>(0);
  const [totalDays, setTotalDays] = React.useState<number>(0);
  const [totalHours, setTotalHours] = React.useState<number>(0);
  const [currentHours, setCurrentHours] = React.useState<number>(0);
  const { selectedDate } = useDate();

  React.useEffect(() => {
    let halfDays = 0;
    let halfHours = 0;
    let days = 0;
    let hours = 0;
    for (let i = 0; i < data.attendances.length; i++) {
      if (i < 15) {
        halfDays += data.attendances[i]?.status === "Я" ? 1 : 0;
        halfHours += Number(data.attendances[i]?.hours) || 0;
      }
      days += data.attendances[i]?.status === "Я" ? 1 : 0;
      hours += Number(data.attendances[i]?.hours) || 0;
    }
    setTotalHalfDays(halfDays);
    setTotalHalfHours(halfHours);
    setTotalDays(days);
    setTotalHours(hours);
    setCurrentHours(hours);
  }, [data]);

  const onChangeHours = (oldValue: number, newValue: number) => {
    const tmp = newValue - oldValue;
    setCurrentHours(currentHours + tmp);
  };

  React.useEffect(() => {
    if (currentHours > data.normativeHours) {
      notification.error({
        message: "Превышено норма часов!",
        description: `Превышено норма часов для сотрудника ${data.user}. Обратитесь в отдел кадров`,
      });
    }
  }, [currentHours]);

  return (
    <>
      <tr>
        <td
          rowSpan={4}
          className="table-body_cell"
          style={{ borderBottomWidth: 2 }}
        >
          {index}
        </td>
        <td
          rowSpan={4}
          className="table-body_cell"
          style={{ borderBottomWidth: 2 }}
        >
          {data.user}
          <br />
          <span>{data.post}</span>
        </td>
        <td
          rowSpan={4}
          className="table-body_cell"
          style={{ borderBottomWidth: 2 }}
        >
          {data.timeCardNum}
        </td>
        {Array.from(
          { length: daysInMonth > 30 ? 16 : 15 },
          (_, i) => i + 1
        ).map((item) => (
          <td key={`${data.id}-days-${item}-1`} className="table-body_cell">
            {item < 16 ? (
              editable ? (
                <Form.Item
                  name={[`timeCard-${data.id}`, item - 1, "status"]}
                  style={{ margin: 0 }}
                  initialValue={data.attendances[item - 1]?.status || undefined}
                >
                  <CustomSelect />
                </Form.Item>
              ) : (
                <span>{data.attendances[item - 1]?.status}</span>
              )
            ) : null}
          </td>
        ))}
        <td className="table-body_cell">
          {totalHalfDays ? totalHalfDays + "д" : null}
        </td>
        <td rowSpan={2} className="table-body_cell">
          {totalDays ? totalDays + "д" : null}
        </td>
        <td rowSpan={2} className="table-body_cell">
          {data.normativeDays ? data.normativeDays + "д" : null}
        </td>
        <td className="table-body_cell">В</td>
        <td className="table-body_cell">
          {data.attendances.filter((item) => item.status === "В").length ||
            null}
        </td>
        <td className="table-body_cell">ПР</td>
        <td className="table-body_cell">
          {data.attendances.filter((item) => item.status === "ПР").length ||
            null}
        </td>
      </tr>
      <tr>
        {Array.from(
          { length: daysInMonth > 30 ? 16 : 15 },
          (_, i) => i + 1
        ).map((item) => (
          <td key={`${data.id}-days-${item}-2`} className="table-body_cell">
            {item < 16 ? (
              editable ? (
                <Form.Item
                  name={[`timeCard-${data.id}`, item - 1, "hours"]}
                  style={{ margin: 0 }}
                  initialValue={data.attendances[item - 1]?.hours || undefined}
                >
                  <InputNumber onChanged={onChangeHours} />
                </Form.Item>
              ) : (
                <span>{data.attendances[item - 1]?.hours || null}</span>
              )
            ) : null}
          </td>
        ))}
        <td className="table-body_cell">
          {totalHalfHours ? totalHalfHours + "ч" : null}
        </td>
        <td className="table-body_cell">Б</td>
        <td className="table-body_cell">
          {data.attendances.filter((item) => item.status === "Б").length ||
            null}
        </td>
        <td className="table-body_cell">ДО</td>
        <td className="table-body_cell">
          {data.attendances.filter((item) => item.status === "ДО").length ||
            null}
        </td>
      </tr>
      <tr>
        {Array.from(
          { length: daysInMonth > 30 ? 16 : 15 },
          (_, i) => i + 16
        ).map((item) => (
          <td key={`${data.id}-days-${item}-1`} className="table-body_cell">
            {item <= daysInMonth ? (
              editable &&
              (selectedDate.isBefore(moment(), "month") ||
                selectedDate.date() > 15) ? (
                <Form.Item
                  name={[`timeCard-${data.id}`, item - 1, "status"]}
                  style={{ margin: 0 }}
                  initialValue={data.attendances[item - 1]?.status || undefined}
                >
                  <CustomSelect />
                </Form.Item>
              ) : (
                <span>{data.attendances[item - 1]?.status || null}</span>
              )
            ) : null}
          </td>
        ))}
        <td className="table-body_cell">
          {totalDays - totalHalfDays ? totalDays - totalHalfDays + "д" : null}
        </td>
        <td
          rowSpan={2}
          className="table-body_cell"
          style={{ borderBottomWidth: 2 }}
        >
          {totalHours ? totalHours + "ч" : null}
        </td>
        <td
          rowSpan={2}
          className="table-body_cell"
          style={{ borderBottomWidth: 2 }}
        >
          {data.normativeHours ? data.normativeHours + "ч" : null}
        </td>
        <td className="table-body_cell">ОТ</td>
        <td className="table-body_cell">
          {data.attendances.filter((item) => item.status === "ОТ").length ||
            null}
        </td>
        <td className="table-body_cell">Г</td>
        <td className="table-body_cell">
          {data.attendances.filter((item) => item.status === "Г").length ||
            null}
        </td>
      </tr>
      <tr>
        {Array.from(
          { length: daysInMonth > 30 ? 16 : 15 },
          (_, i) => i + 16
        ).map((item) => (
          <td
            key={`${data.id}-days-${item}-2`}
            className="table-body_cell"
            style={{ borderBottomWidth: 2 }}
          >
            {item <= daysInMonth ? (
              editable &&
              (selectedDate.isBefore(moment(), "month") ||
                selectedDate.date() > 15) ? (
                <Form.Item
                  name={[`timeCard-${data.id}`, item - 1, "hours"]}
                  style={{ margin: 0 }}
                  initialValue={data.attendances[item - 1]?.hours || undefined}
                >
                  <InputNumber onChanged={onChangeHours} />
                </Form.Item>
              ) : (
                <span>{data.attendances[item - 1]?.hours || null}</span>
              )
            ) : null}
          </td>
        ))}
        <td className="table-body_cell" style={{ borderBottomWidth: 2 }}>
          {totalHours - totalHalfHours
            ? totalHours - totalHalfHours + "ч"
            : null}
        </td>
        <td className="table-body_cell" style={{ borderBottomWidth: 2 }}>
          Р
        </td>
        <td className="table-body_cell" style={{ borderBottomWidth: 2 }}>
          {data.attendances.filter((item) => item.status === "Р").length ||
            null}
        </td>
        <td className="table-body_cell" style={{ borderBottomWidth: 2 }}>
          НН
        </td>
        <td className="table-body_cell" style={{ borderBottomWidth: 2 }}>
          {data.attendances.filter((item) => item.status === "НН").length ||
            null}
        </td>
      </tr>
    </>
  );
};

export default Row;
