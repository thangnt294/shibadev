import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import {
  LoginOutlined,
  UserAddOutlined,
  TeamOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Context } from "../../global/Context";
import axios from "axios";
import { useRouter } from "next/router";
import { Avatar, Input, Menu } from "antd";

const { Item, SubMenu, ItemGroup } = Menu;

const TopNav = () => {
  const [current, setCurrent] = useState("");

  const { state, dispatch } = useContext(Context);

  const { user, page, limit } = state;

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

  const handleSearchCourses = async (e) => {
    const searchTerm = e.target.value;
    const { data } = await axios.get(
      `api/courses?page=${page}&limit=${limit}&term=${searchTerm}`
    );
    dispatch({
      type: "UPDATE_COURSE_LIST",
      payload: {
        courses: data.courses,
        total: data.total,
        term: searchTerm,
        page,
        limit,
      },
    });
  };

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      selectedKeys={[current]}
      className={`sticky-top ${current !== "/" && "mb-2"}`}
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
      {current === "/" && (
        <Item className="search-bar-item" key="search-bar-item">
          <Input
            placeholder="Search..."
            className="search-bar"
            suffix={<SearchOutlined />}
            onPressEnter={handleSearchCourses}
          />
        </Item>
      )}

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
          icon={<Avatar src="/avatar.png" size="small" />}
          title={user && user.name}
          className={user && user.role ? "" : "ms-auto"}
          key="sub-menu"
        >
          <ItemGroup>
            <Item key="/user">
              <Link href="/user">
                <a>Dashboard</a>
              </Link>
            </Item>
            <Item key="/user/profile">
              <Link href="/user/profile">
                <a>Profile</a>
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
