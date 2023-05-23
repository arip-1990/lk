import { FC, MouseEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Dropdown } from "antd";
import {
  DownOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

import { useAuth } from "../hooks/useAuth";

const Header: FC = () => {
  const { state } = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async (e: MouseEvent) => {
    e.preventDefault();
    await logout();
    window.location.reload();
  };

  const MenuItems: MenuProps["items"] = [
    {
      key: "about",
      label: (
        <Link to="/" state={{ key: undefined, page: "" }}>
          О компании
        </Link>
      ),
    },
    {
      key: "contact",
      label: (
        <Link to="/contact" state={{ key: "contact", page: "Контакты" }}>
          Контакты
        </Link>
      ),
    },
    {
      key: "store",
      label: (
        <Link to="/store" state={{ key: "store", page: "Аптеки" }}>
          Аптеки
        </Link>
      ),
    },
  ];

  const DropdownItems: MenuProps["items"] = [
    {
      key: "profile",
      label: (
        <Link to="/profile" state={{ key: "1", page: "Профиль" }}>
          Профиль
        </Link>
      ),
      icon: <SettingOutlined />,
    },
    {
      key: "score",
      label: (
        <Link to="/profile" state={{ key: "2", page: "Профиль" }}>
          Баллы
        </Link>
      ),
      icon: <SettingOutlined />,
    },
    {
      key: "claim",
      label: (
        <Link to="/profile" state={{ key: "3", page: "Профиль" }}>
          Претензии к поставщикам
        </Link>
      ),
      icon: <SettingOutlined />,
    },
    { type: "divider" },
    {
      key: "logout",
      label: (
        <a href="#" onClick={handleLogout}>
          Выход
        </a>
      ),
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <header className="layout-header">
      <div>
        <h3 style={{ color: "#1961ac", margin: 0 }}>
          Личный кабинет сотрудника:
        </h3>
        <Dropdown menu={{ items: DropdownItems }} placement="bottomRight">
          <a href="/" onClick={(e) => e.preventDefault()}>
            {user && `${user.firstName} ${user.lastName.charAt(0)}.`}{" "}
            <DownOutlined />
          </a>
        </Dropdown>
      </div>
      <Menu
        selectedKeys={state?.key ? [state.key] : undefined}
        mode="horizontal"
        items={MenuItems}
      />
    </header>
  );
};

export default Header;
