import React from "react";
import { Row, Col } from "antd";
import { useFetchStoresQuery } from "../services/StoreService";
import { Store as BaseStore } from "../components";

const Store: React.FC = () => {
  const { data: stores, isLoading } = useFetchStoresQuery();

  return (
    <Row style={{ width: 782, margin: "0 auto" }}>
      <Col>
        <BaseStore stores={stores || []} loading={isLoading} />
      </Col>
    </Row>
  );
};

export default Store;
