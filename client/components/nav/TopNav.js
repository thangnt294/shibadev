import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import {
  LoginOutlined,
  UserAddOutlined,
  TeamOutlined,
  CrownOutlined,
  DesktopOutlined,
  UserOutlined,
  LogoutOutlined,
  HeartOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { Context } from "../../global/Context";
import { useRouter } from "next/router";
import { Avatar, Menu } from "antd";

const { Item, SubMenu, ItemGroup } = Menu;

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
    window.localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      selectedKeys={[current]}
      className="sticky-top"
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

      {user && user.role && user.role.includes("Admin") && (
        <Item
          key="/admin"
          onClick={(e) => setCurrent(e.key)}
          icon={<CrownOutlined />}
        >
          <Link href="/admin">
            <a>Admin</a>
          </Link>
        </Item>
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
          icon={<Avatar src="/avatar.png" size="small" />}
          title={user && user.name}
          className={user && user.role ? "" : "ms-auto"}
          key="sub-menu"
        >
          <ItemGroup>
            <Item key="/user" icon={<DesktopOutlined />}>
              <Link href="/user">
                <a>Dashboard</a>
              </Link>
            </Item>
            <Item key="/user/wish-list" icon={<HeartOutlined />}>
              <Link href="/user/wish-list">
                <a>Wish List</a>
              </Link>
            </Item>
            <Item key="/user/messages" icon={<MessageOutlined />}>
              <Link href="/user/messages">
                <a>Messages</a>
              </Link>
            </Item>
            <Item key="/user/profile" icon={<UserOutlined />}>
              <Link href="/user/profile">
                <a>Profile</a>
              </Link>
            </Item>
            <Item key="/logout" icon={<LogoutOutlined />} onClick={logout}>
              Logout
            </Item>
          </ItemGroup>
        </SubMenu>
      )}
    </Menu>
  );
};

export default TopNav;
