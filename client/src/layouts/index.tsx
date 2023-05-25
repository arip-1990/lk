import React from "react";
import { Outlet } from "react-router-dom";
import { Row, Col } from "antd";

import { Header, Footer } from "../templates";
import { Calendar, Clock, Breadcrumb } from "../components";

import logoSocial from "../images/logo-social.svg";
import logoDagfarm from "../images/logo-dagfarm.svg";

const Layout: React.FC = () => {
  return (
    <section className="layout">
      <Header />
      <aside className="layout-left-sider">
        <Row gutter={[0, 32]}>
          <Col span={18}>
            <img className="logo" src={logoSocial} alt="" />
          </Col>
          <Col span={18}>
            <img className="logo" src={logoDagfarm} alt="" />
          </Col>
        </Row>
      </aside>
      <main className="layout-content">
        <Breadcrumb />
        <Outlet />
      </main>
      <aside className="layout-right-sider">
        <Row gutter={[0, 16]}>
          <Col span={18}>
            <Clock />
          </Col>
          <Col span={18}>
            <Calendar />
          </Col>
          <Col span={18} />
        </Row>
      </aside>
      <Footer />
    </section>
  );
};

export default Layout;
