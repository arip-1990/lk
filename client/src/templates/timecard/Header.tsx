import React from "react";
import { Row, Col, Table, DatePicker } from "antd";
import moment from "moment";
import { useDate } from "../../hooks/useDate";

type Props = {
  changePreparationDate: (date: moment.Moment) => void;
};

const Header: React.FC<Props> = ({ changePreparationDate }) => {
  const { selectedDate } = useDate();

  const handleChangePreparationDate = (value: moment.Moment | null) => {
    if (value) changePreparationDate(value);
  };

  return (
    <Row gutter={[0, 32]}>
      <Col>
        <Row justify="end">
          <Col span={6} style={{ textAlign: "right", color: "#2b74b7" }}>
            Унифицированная форма № Т-13 Утверждена Постановлением Госкомстата
            России от 08.04.2001 № 26
          </Col>
        </Row>
      </Col>
      <Col>
        <Row justify="end">
          <Col span={18}>
            <Row style={{ height: "100%" }}>
              <Col style={{ textAlign: "center" }}>
                <h2 style={{ fontSize: "1.5rem", color: "#da291c", margin: 0 }}>
                  ООО "Дагфарм+"
                </h2>
                <span style={{ color: "#2b74b7" }}>
                  (наименование организации)
                </span>
              </Col>
              <Col
                style={{
                  alignSelf: "end",
                  textAlign: "center",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "#2b74b7",
                }}
              >
                Табель учета использования рабочего времени
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <Row>
              <Col span={12} style={{ alignSelf: "center" }}>
                <p>Форма по ОКУД</p>
                <p>по ОКПО</p>
              </Col>
              <Col span={12}>
                <Table
                  size="small"
                  showHeader={false}
                  pagination={false}
                  columns={[
                    {
                      dataIndex: "name",
                      align: "center",
                      render: (text: string) => <p>{text}</p>,
                    },
                  ]}
                  bordered={true}
                  dataSource={[
                    {
                      key: "cell-1",
                      name: "Код",
                    },
                    {
                      key: "cell-2",
                      name: "30008",
                    },
                    {
                      key: "cell-3",
                      name: "",
                    },
                    {
                      key: "cell-4",
                      name: "",
                    },
                  ]}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col>
        <Row justify="end" gutter={[32, 0]}>
          <Col span={6}>
            <Table
              size="small"
              pagination={false}
              bordered={true}
              columns={[
                {
                  title: "Номер документа",
                  dataIndex: "number",
                  align: "center",
                },
                {
                  title: "Дата составления",
                  dataIndex: "date",
                  align: "center",
                  render: (date: moment.Moment) => (
                    <DatePicker
                      defaultValue={date}
                      bordered={false}
                      onChange={handleChangePreparationDate}
                    />
                  ),
                },
              ]}
              dataSource={[
                {
                  key: "cell-1",
                  number: "",
                  date: moment(),
                },
              ]}
            />
          </Col>
          <Col span={6}>
            <Table
              size="small"
              pagination={false}
              bordered={true}
              columns={[
                {
                  title: "Отчетный период",
                  children: [
                    {
                      key: "from",
                      title: "с",
                      dataIndex: "from",
                      align: "center",
                      render: (date: moment.Moment) => (
                        <p>{date.format("DD MMM YYYY")}</p>
                      ),
                    },
                    {
                      key: "to",
                      title: "по",
                      dataIndex: "to",
                      align: "center",
                      render: (date: moment.Moment) => (
                        <p>{date.format("DD MMM YYYY")}</p>
                      ),
                    },
                  ],
                },
              ]}
              dataSource={[
                {
                  key: "cell-1",
                  from: selectedDate.isAfter(moment(), "date")
                    ? moment().startOf("month")
                    : selectedDate.clone().startOf("month"),
                  to:
                    selectedDate.isBefore(moment(), "date") ||
                    (selectedDate.isSame(moment(), "month") &&
                      moment().date() > 15)
                      ? selectedDate.clone().endOf("month")
                      : moment().date(15),
                },
              ]}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Header;
