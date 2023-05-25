import React from "react";
import { Outlet } from "react-router-dom";
import { Row, Col } from "antd";

import { Header, Footer } from "../templates";
import { Calendar, Clock, Breadcrumb } from "../components";

import logoSocial from "../images/logo-social.svg";

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
        <Row style={{marginTop: '1.5rem'}}>
          <Col><img className="logo" src={logoSocial} alt="" /></Col>
        </Row>
      </aside>
      <main className="layout-content">
        <Breadcrumb />
        <Outlet />
      </main>
      <aside className="layout-right-sider"></aside>
      <Footer />
    </section>
  );
};

export default Layout;
