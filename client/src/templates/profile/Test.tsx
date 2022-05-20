import React from "react";
import {
  Row,
  Table,
  Radio,
  RadioChangeEvent,
  TablePaginationConfig,
} from "antd";
import moment from "moment";
import { CurrentUserType } from "./WorkerTest";
import { useFetchTestsByUserQuery } from "../../services/TestService";

interface PropsType {
  user: CurrentUserType;
  onChangeTestType: (value: string) => void;
}

const Test: React.FC<PropsType> = ({ user, onChangeTestType }) => {
  const [columns, setColumns] = React.useState<any>([]);
  const [type, setType] = React.useState<string>("Базовые");
  const [pagination, setPagination] = React.useState({
    current: 1,
    pageSize: 10,
  });
  const { data: tests, isLoading } = useFetchTestsByUserQuery({
    user: user.id,
    type,
    pagination,
  });

  React.useEffect(() => {
    createBaseColumn();
  }, [tests, type]);

  const createBaseColumn = () => {
    const baseColumns = [
      {
        title: "Дата прохождения теста",
        children: [
          {
            title: "Дата",
            dataIndex: "start",
            key: "start",
            width: 86,
            align: "center",
          },
          {
            title: "Потрачено времени",
            dataIndex: "finish",
            key: "finish",
            width: 64,
            align: "center",
          },
        ],
      },
      {
        title: "Результат",
        children: [
          {
            title: "Количество правильных ответов (баллов)",
            dataIndex: "totalScore",
            key: "totalScore",
            align: "center",
            width: 56,
          },
          {
            title: "Процент правильных ответов (%)",
            dataIndex: "percent",
            key: "percent",
            align: "center",
            width: 56,
            render: (text: string) => (
              <span className={text === "100" ? "red" : ""}>{text}</span>
            ),
          },
        ],
      },
    ];

    if (tests) {
      let children: any = [];
      let tmp: Result[] = tests.data.reduce(
        (prev: Result[], current) => [
          ...prev,
          ...current.results.filter(
            (res) => !prev.some((el) => el.key === res.key)
          ),
        ],
        []
      );

      children = tmp.map((res) => ({
        title: res.category,
        children: [
          {
            title: "Балл",
            dataIndex: `${res.key}-score`,
            key: `${res.key}-score`,
            align: "center",
            width: 28,
          },
          {
            title: "%",
            dataIndex: `${res.key}-percent`,
            key: `${res.key}-percent`,
            align: "center",
            width: 28,
            render: (text: string) => (
              <span className={text === "100" ? "red" : ""}>{text}</span>
            ),
          },
        ],
      }));

      if (children.length) baseColumns.push({ title: "Из них", children });
    }
    setColumns(baseColumns);
  };

  const handleCheckType = (e: RadioChangeEvent) => {
    setType(e.target.value);
    onChangeTestType(e.target.value);
  };

  const handleChange = (pag: TablePaginationConfig) => {
    setPagination({
      current: pag.current || pagination.current,
      pageSize: pag.pageSize || pagination.pageSize,
    });
  };

  return (
    <div>
      <Row style={{ justifyContent: "space-between" }}>
        <h3 style={{ color: "#2b74b7" }}>Тест пользователя: {user.name}</h3>
        <Radio.Group
          defaultValue={type}
          size="small"
          onChange={handleCheckType}
        >
          <Radio.Button value="ПРОМО">ПРОМО</Radio.Button>
          <Radio.Button value="Базовые">Базовые</Radio.Button>
          <Radio.Button value="Новые">Новые</Radio.Button>
        </Radio.Group>
      </Row>
      <Table
        rowClassName="border-success"
        columns={columns}
        loading={isLoading}
        dataSource={
          tests &&
          tests.data.map((item: any) => {
            let tmp = item.results.map((res: any, i: number) => ({
              [`${res.key}-score`]: res.corrects,
              [`${res.key}-percent`]: Math.round(
                (res.corrects / res.totalCorrects) * 100
              ),
            }));

            return {
              key: item.id,
              start: item.start.format("DD MMMM YYYY, HH:mm"),
              finish: moment(item.finish.diff(item.start)).format(
                "m [мин.] s [сек.]"
              ),
              totalScore: `${item.score}/${item.totalScore}`,
              percent: Math.round((item.score / item.totalScore) * 100),
              ...Object.assign({}, ...tmp),
            };
          })
        }
        bordered
        style={{ borderColor: "#da291c" }}
        pagination={{
          current: tests?.meta.current_page || pagination.current,
          total: tests?.meta.total || 0,
          pageSize: tests?.meta.per_page || pagination.pageSize,
        }}
        onChange={handleChange}
      />
    </div>
  );
};

export default Test;
