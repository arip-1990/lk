import React from "react";
import { Steps } from "antd";

interface PropsType {
  totalSteps: number;
  current: number;
}

const Step: React.FC<PropsType> = ({ totalSteps, current }) => {
  const [steps, setSteps] = React.useState<number[]>([]);

  React.useEffect(() => {
    setSteps(
      Array(totalSteps)
        .fill(0)
        .map((_, i) => i + 1)
    );
  }, [totalSteps]);

  return (
    <Steps current={current} style={{ marginBottom: "1rem" }}>
      {steps.map((item) => (
        <Steps.Step key={"step-" + item} />
      ))}
    </Steps>
  );
};

export default Step;
