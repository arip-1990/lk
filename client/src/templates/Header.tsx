import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Dropdown, Row, Col } from "antd";
import {
  DownOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { MenuClickEventHandler } from "rc-menu/lib/interface";
import logo from "../images/logo.svg";
import { useAuth } from "../hooks/useAuth";

const Header: React.FC = () => {
  const [current, setCurrent] = React.useState<string>();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleDropMenu = async (event: any) => {
    switch (event.key) {
      case "profile":
        navigate("/profile", { state: { key: "1", page: "Профиль" } });
        break;
      case "score":
        navigate("/profile", { state: { key: "2", page: "Профиль" } });
        break;
      case "claim":
        navigate("/profile", { state: { key: "3", page: "Профиль" } });
        break;
      case "logout":
        await logout();
        window.location.reload();
    }
  };

  const handleMenuClick: MenuClickEventHandler = (e) => {
    setCurrent(e.key);
    switch (e.key) {
      case "store":
        navigate("/store", { state: { page: "Аптеки" } });
        break;
      case "contact":
        navigate("/contact", { state: { page: "Контакты" } });
        break;
      default:
        setCurrent(undefined);
        navigate("/");
    }
  };

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
            onClick={handleMenuClick}
            selectedKeys={current ? [current] : undefined}
            mode="horizontal"
            items={[
              { key: "about", label: "О компании" },
              { key: "contact", label: "Контакты" },
              { key: "store", label: "Аптеки" },
            ]}
          />
        </Col>
        <Col span={4} style={{ textAlign: "end" }}>
          <Dropdown
            overlay={
              <Menu
                onClick={handleDropMenu}
                items={[
                  {
                    key: "profile",
                    label: "Профиль",
                    icon: <SettingOutlined />,
                  },
                  { key: "score", label: "Баллы", icon: <SettingOutlined /> },
                  {
                    key: "claim",
                    label: "Претензии к поставщикам",
                    icon: <SettingOutlined />,
                  },
                  { type: "divider" },
                  { key: "logout", label: "Выход", icon: <LogoutOutlined /> },
                ]}
              />
            }
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
