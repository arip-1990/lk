import React from "react";
import {
  Row,
  Col,
  Card,
  Checkbox as BaseCheckbox,
  Avatar,
  Spin,
  Table,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  LoadingOutlined,
  HeartFilled,
} from "@ant-design/icons";
import { useLocalStorage } from "react-use-storage";
import moment from "moment";
import api from "../services/api";

interface AnswerType {
  checked: boolean;
  correct: boolean;
  title: string;
}

interface PropsDataType {
  total: number;
  question: string;
  answers: AnswerType[];
}

interface ResultType {
  total: number;
  percent: number;
  data: PropsDataType[];
  start: moment.Moment;
  finish: moment.Moment;
}

const Checkbox = ({ answer }: { answer: AnswerType }) => {
  let style = { backgroundColor: "transparent" };
  if (answer.checked) {
    style.backgroundColor = answer.correct
      ? "rgba(34, 172, 166, 0.6)"
      : "rgba(220, 66, 52, 0.6)";
  } else if (answer.correct) {
    style.backgroundColor = "rgba(34, 172, 166, 0.6)";
  }

  return (
    <BaseCheckbox disabled checked={answer.checked} style={style}>
      {answer.title}{" "}
      {answer.checked ? (
        answer.correct ? (
          <CheckOutlined style={{ color: "#22aca6" }} />
        ) : (
          <CloseOutlined style={{ color: "#dc4234" }} />
        )
      ) : null}
    </BaseCheckbox>
  );
};

const tableColumns = [
  {
    dataIndex: "name",
    render: (text: any) => <p>{text}</p>,
  },
  {
    dataIndex: "value",
    align: "right" as "right",
    render: (data: string | moment.Moment | undefined) => {
      if (data) {
        if (moment.isMoment(data)) {
          return (
            <>
              <p style={{ margin: 0 }}>Дата: {data.format("Do MMMM YYYY")}</p>
              <p style={{ margin: 0 }}>Время: {data.format("hh:mm")}</p>
            </>
          );
        } else return <p style={{ margin: 0 }}>{data}</p>;
      }
      return <p style={{ margin: 0 }}>-</p>;
    },
  },
];

const Result: React.FC = () => {
  const [test] = useLocalStorage<string | null>("test", null);
  const [result, setResult] = React.useState<ResultType | null>(null);

  console.log(result);

  React.useEffect(() => {
    fetchResult();
  }, []);

  const fetchResult = async () => {
    try {
      const response = await api.get("/test/result/" + test);
      const data = response.data;
      data.start = moment(data.start);
      data.finish = moment(data.finish);
      setResult(data);
    } catch (e) {
      console.log(e);
    }
  };

  const getDifference = (
    start: moment.Moment,
    finish: moment.Moment | undefined
  ) => {
    let res = "-";
    if (finish) {
      let minutes = finish.diff(start, "minutes");
      res = minutes ? minutes.toString() + " мин." : "";
      res += finish.diff(start, "seconds").toString() + " сек.";
    }
    return res;
  };

  return (
    <Row>
      <Col style={{ marginBottom: "1.5rem" }}>
        <Row className="test-info">
          <Col style={{ fontSize: "1.5rem", textAlign: "center" }} span={12}>
            <p style={{ margin: 0 }}>Общий результат</p>
            <HeartFilled
              className="percent"
              data-percent={result?.percent || 0}
            />
          </Col>
          <Col span={12} style={{ padding: "0.25rem" }}>
            <Table
              size="small"
              showHeader={false}
              pagination={false}
              columns={tableColumns}
              dataSource={[
                {
                  key: "cell-1",
                  name: "Тест начат",
                  value: result ? result.start : undefined,
                },
                {
                  key: "cell-2",
                  name: "Тест завершен",
                  value: result ? result.finish : undefined,
                },
                {
                  key: "cell-3",
                  name: "Время прохождения теста",
                  value: result
                    ? getDifference(result.start, result.finish)
                    : "-",
                },
                {
                  key: "cell-4",
                  name: "Результат теста (оценка)",
                  value: result
                    ? result.total.toFixed(1) +
                      " из " +
                      result.data.length +
                      " (" +
                      result.percent +
                      "%)"
                    : "-",
                },
              ]}
              bordered
            />
          </Col>
        </Row>
      </Col>

      <Col>
        <Card className="result" style={result ? {} : { textAlign: "center" }}>
          {result ? (
            result.data.map((item, i) => (
              <Row key={i}>
                <Col
                  span={6}
                  style={{
                    fontSize: "1.2rem",
                    textAlign: "center",
                    alignSelf: "center",
                  }}
                >
                  <p>Вопрос {i + 1}</p>
                  <Avatar size={32} style={{ background: "#22aca6" }}>
                    {item.total}
                  </Avatar>
                </Col>
                <Col
                  span={18}
                  style={{
                    borderLeft: "1px solid #22aca6",
                    paddingLeft: "1.5rem",
                  }}
                >
                  <p style={{ fontSize: "1.1rem", marginTop: "1rem" }}>
                    {item.question}
                  </p>
                  {item.answers.map((answer, j) => (
                    <div key={i + "" + j} style={{ margin: "1rem 0" }}>
                      <Checkbox answer={answer} />
                    </div>
                  ))}
                </Col>
              </Row>
            ))
          ) : (
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 64 }} spin />}
            />
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default Result;
