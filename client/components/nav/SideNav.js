import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu } from "antd";
import { DesktopOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";

const { Item } = Menu;

const SideNav = ({ type }) => {
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  const handleClick = (e) => {
    setCurrent(e.key);
  };

  const generateItem = (data) => {
    return data.map((e) => (
      <Item key={e.key} icon={e.icon}>
        <Link href={e.key}>
          <a>{e.title}</a>
        </Link>
      </Item>
    ));
  };

  return (
    <Menu
      theme="dark"
      onClick={handleClick}
      selectedKeys={[current]}
      style={{ minHeight: "100vh" }}
    >
      {type === "admin"
        ? generateItem([
            { title: "Dashboard", key: "/admin", icon: <DesktopOutlined /> },
          ])
        : type === "instructor"
        ? generateItem([
            {
              title: "Dashboard",
              key: "/instructor",
              icon: <DesktopOutlined />,
            },
            {
              title: "Create Course",
              key: "/instructor/course/create",
              icon: <PlusOutlined />,
            },
          ])
        : generateItem([
            { title: "Dashboard", key: "/user", icon: <DesktopOutlined /> },
            { title: "Profile", key: "/user/profile", icon: <UserOutlined /> },
          ])}
    </Menu>
  );
};

export default SideNav;
