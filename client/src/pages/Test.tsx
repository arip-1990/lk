import React from "react";
import { Row, Col } from "antd";
import { BaseTest } from "../templates";

const Test: React.FC = () => {
  return (
    <Row className="content">
      <Col className="gutter-row">
        <BaseTest />
      </Col>
    </Row>
  );
};

export default Test;
