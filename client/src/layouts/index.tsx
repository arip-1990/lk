import React from "react";
import { Outlet } from "react-router-dom";
import { Row, Col } from "antd";

import { Header, Footer } from "../templates";
import { Calendar, Clock, Breadcrumb } from "../components";

const Layout: React.FC = () => {
  return (
    <section className="layout">
      <Header />
      <aside className="layout-left-sider">
        <Row>
          <Col span={24}>
            <Clock />
          </Col>
          <Col span={24}>
            <Calendar />
          </Col>
          <Col span={24}></Col>
        </Row>
      </aside>
      <main className="layout-content">
        <Breadcrumb />
        <Outlet />
      </main>
      <aside className="layout-right-sider" />
      <Footer />
    </section>
  );
};

export default Layout;
