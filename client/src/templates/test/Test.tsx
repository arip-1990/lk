import React from "react";
import { Card, Checkbox, Button, notification } from "antd";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useLocalStorage } from "react-use-storage";
import api from "../../services/api";

import { Step } from "../../components";
import { StartTest } from "./StartTest";

interface AnswerType {
  id: string;
  title: string;
  comment: string;
}

interface QuestionType {
  id: string;
  title: string;
  description: string;
  answers: AnswerType[];
}

interface ResultType {
  question: string;
  answers: string[];
}

interface TestType {
  test: string;
  questions: QuestionType[];
}

const Test: React.FC = () => {
  const [test, setTest] = useLocalStorage<string | null>("test", null);
  const [results, setResults, removeResults] = useLocalStorage<ResultType[]>(
    "result",
    []
  );
  const [testId, setTestId] = React.useState<string | null>(null);
  const [questions, setQuestions] = React.useState<QuestionType[]>([]);
  const [currentStep, setCurrentStep] = React.useState<number>(0);
  const [current, setCurrent] = React.useState<QuestionType | null>(null);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [startTest, setStartTest] = React.useState<boolean>(false);
  const [time, setTime] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(false);
  const interval = React.useRef<NodeJS.Timeout | null>(null);
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  const getTime = () => {
    const minute = Math.floor(time / 60);
    const second = time - minute * 60;
    return (
      (minute < 10 ? "0" + minute : minute) +
      ":" +
      (second < 10 ? "0" + second : second)
    );
  };

  React.useEffect(() => {
    if (interval.current && time <= 0) {
      clearInterval(interval.current);
      notification.warning({
        message: "Ваша время истекло!",
        description: "Тест завершен.",
        duration: 30,
      });
      onTestFinish();
    }
  }, [time]);

  React.useEffect(() => {
    if (startTest)
      interval.current = setInterval(() => setTime((time) => time - 1), 1000);
    else interval.current && clearInterval(interval.current);

    return () => {
      interval.current && clearInterval(interval.current);
    };
  }, [startTest]);

  React.useEffect(() => {
    fetchTest();
    return () => removeResults();
  }, []);

  const fetchTest = async () => {
    setLoading(true);
    try {
      const response = await api.get<TestType>("/test/" + id);
      setTestId(response.data.test);
      setQuestions(response.data.questions);
      setCurrent(response.data.questions[currentStep]);
      setTime(5 * 60);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const getResult = () => {
    return current
      ? [
          ...results.filter((result) => result.question !== current.id),
          { question: current.id, answers: selected },
        ]
      : results;
  };

  const handleStart = () => {
    setResults([]);
    setStartTest(true);
    setTest(testId);
  };

  const onTestFinish = async () => {
    setLoading(true);
    let tmp = getResult();
    for (let i = tmp.length; i < questions.length; i++)
      tmp.push({ question: questions[i].id, answers: [] });

    try {
      await api.post("/test/result", {
        results: tmp,
        test,
      });
      setLoading(false);
      navigate(`/test/${id}/result`, {
        state: { ...state, page: "Результат" },
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleAnswer = (values: any) => {
    setSelected(values);
  };

  const isDisabled = (id: string) => {
    if (current)
      return (
        selected.length > current.answers.length - 2 &&
        selected.indexOf(id) === -1
      );
    return false;
  };

  const next = () => {
    setResults(getResult());
    setSelected(results[currentStep + 1]?.answers || []);
    setCurrentStep(currentStep + 1);
    setCurrent(questions[currentStep + 1]);
  };

  const prev = () => {
    setSelected(results[currentStep - 1].answers);
    setCurrentStep(currentStep - 1);
    setCurrent(questions[currentStep - 1]);
  };

  return (
    <Card
      title="Контрольное тестирование"
      className="test"
      extra={
        startTest ? (
          <p style={{ color: "#fff", margin: 0 }}>
            Оставшееся время:{" "}
            <span className={time <= 60 ? "red" : ""}>{getTime()}</span>
          </p>
        ) : null
      }
      loading={loading}
    >
      {startTest ? (
        <>
          <Step totalSteps={questions.length} current={currentStep} />
          {current && (
            <Card title={current.title}>
              <Checkbox.Group style={{ width: "100%" }} onChange={handleAnswer}>
                {current.answers.map((answer) => (
                  <div key={answer.id} style={{ margin: "1rem 0" }}>
                    <Checkbox
                      value={answer.id}
                      disabled={isDisabled(answer.id)}
                    >
                      {answer.title}
                    </Checkbox>
                  </div>
                ))}
              </Checkbox.Group>
            </Card>
          )}
          <div className="steps-action">
            {currentStep > 0 && (
              <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
                Предыдущий
              </Button>
            )}
            {currentStep < questions.length - 1 && (
              <Button
                disabled={!selected.length}
                type="primary"
                onClick={() => next()}
              >
                Следующий
              </Button>
            )}
            {currentStep === questions.length - 1 && (
              <Button
                type="primary"
                loading={loading}
                disabled={!selected.length}
                onClick={onTestFinish}
              >
                Отправить тест
              </Button>
            )}
          </div>
        </>
      ) : testId ? (
        <StartTest timer={(time / 60).toString()} handleStart={handleStart} />
      ) : (
        <p style={{ fontSize: "1.2rem", textAlign: "center" }}>
          В этой категории нет тестов
        </p>
      )}
    </Card>
  );
};

export default Test;
