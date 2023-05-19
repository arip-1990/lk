import { FC, MouseEvent, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Dropdown, Row, Col } from "antd";
import {
  DownOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { MenuProps } from 'antd';

import logo from "../images/logo.svg";
import { useAuth } from "../hooks/useAuth";

const Header: FC = () => {
  const {state} = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = (e: MouseEvent) => {
    e.preventDefault();
    logout();
    window.location.reload();
  }

  const MenuItems: MenuProps['items'] = [
    {
      key: "about",
      label: <Link to='/' state={{ key: undefined, page: "" }}>О компании</Link>,
    },
    { 
      key: "contact",
      label: <Link to='/contact' state={{ key: "contact", page: "Контакты" }}>Контакты</Link>,
    },
    {
      key: "store",
      label: <Link to='/store' state={{ key: "store", page: "Аптеки" }}>Аптеки</Link>,
    },
  ];

  const DropdownItems: MenuProps['items'] = [
    {
      key: "profile",
      label: <Link to='/profile' state={{ key: "1", page: "Профиль" }}>Профиль</Link>,
      icon: <SettingOutlined />,
    },
    { 
      key: "score",
      label: <Link to='/profile' state={{ key: "2", page: "Профиль" }}>Баллы</Link>,
      icon: <SettingOutlined />
    },
    {
      key: "claim",
      label: <Link to='/profile' state={{ key: "3", page: "Профиль" }}>Претензии к поставщикам</Link>,
      icon: <SettingOutlined />,
    },
    { type: "divider" },
    { 
      key: "logout",
      label: <a href="#" onClick={handleLogout}>Выход</a>,
      icon: <LogoutOutlined />
    },
  ];

  return (
    <header className="layout-header">
      <Row
        gutter={[32, 0]}
        align="middle"
        style={{ maxWidth: 1280, margin: "auto" }}
      >
        <Col span={5}>
          <Link to="/">
            <img className="logo" src={logo} alt="" />
          </Link>
        </Col>
        <Col span={15}>
          <Menu
            selectedKeys={state?.key ? [state.key] : undefined}
            mode="horizontal"
            items={MenuItems}
          />
        </Col>
        <Col span={4} style={{ textAlign: "end" }}>
          <Dropdown
            menu={{items: DropdownItems}}
            placement="bottomRight"
          >
            <a href="/" onClick={(e) => e.preventDefault()}>
              {user && `${user.firstName} ${user.lastName.charAt(0)}.`}{" "}
              <DownOutlined />
            </a>
          </Dropdown>
        </Col>
      </Row>
    </header>
  );
};

export default Header;
