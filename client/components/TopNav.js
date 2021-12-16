import { useState, useEffect, useContext } from "react";
import { Menu } from "antd";
import Link from "next/link";
import {
  LoginOutlined,
  UserAddOutlined,
  CoffeeOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Context } from "../context/index";
import axios from "axios";
import { useRouter } from "next/router";
import { Avatar } from "antd";

const { Item, SubMenu, ItemGroup } = Menu; // instead of Menu.Item

const TopNav = () => {
  const [current, setCurrent] = useState("");

  const { state, dispatch } = useContext(Context);

  const { user } = state;

  const router = useRouter();

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  const logout = async () => {
    dispatch({ type: "LOGOUT" });
    window.localStorage.removeItem("user");
    await axios.post("/api/logout");
    router.push("/login");
  };

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      selectedKeys={[current]}
      className="mb-2"
    >
      <Item
        key="/"
        onClick={(e) => setCurrent(e.key)}
        icon={<Avatar src="/logo.png" size="large" />}
      >
        <Link href="/">
          <a></a>
        </Link>
      </Item>

      {user && user.role && !user.role.includes("Instructor") && (
        <Item
          key="/user/become-instructor"
          onClick={(e) => setCurrent(e.key)}
          icon={<TeamOutlined />}
          className="ms-auto"
        >
          <Link href="/user/become-instructor">
            <a>Become Instructor</a>
          </Link>
        </Item>
      )}

      {!user && (
        <>
          <Item
            key="/login"
            onClick={(e) => setCurrent(e.key)}
            icon={<LoginOutlined />}
            className="ms-auto"
          >
            <Link href="/login">
              <a>Login</a>
            </Link>
          </Item>

          <Item
            key="/register"
            onClick={(e) => setCurrent(e.key)}
            icon={<UserAddOutlined />}
          >
            <Link href="/register">
              <a>Register</a>
            </Link>
          </Item>
        </>
      )}

      {user && user.role && user.role.includes("Instructor") && (
        <Item
          key="/instructor"
          onClick={(e) => setCurrent(e.key)}
          icon={<TeamOutlined />}
          className="ms-auto"
        >
          <Link href="/instructor">
            <a>Instructor</a>
          </Link>
        </Item>
      )}

      {user && (
        <SubMenu
          icon={<CoffeeOutlined />}
          title={user && user.name}
          className={user && user.role ? "" : "ms-auto"}
        >
          <ItemGroup>
            <Item key="/user">
              <Link href="/user">
                <a>Dashboard</a>
              </Link>
            </Item>
            <Item key="/logout" onClick={logout}>
              Logout
            </Item>
          </ItemGroup>
        </SubMenu>
      )}
    </Menu>
  );
};

export default TopNav;
