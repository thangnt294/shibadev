import Link from "next/link";
import { useState, useEffect } from "react";

const AdminNav = () => {
  const [current, setCurrent] = useState("");

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  return (
    <div className="nav flex-column nav-pills">
      <Link href="/admin">
        <a className={`nav-link ${current === "/admin" && "active"}`}>
          Dashboard
        </a>
      </Link>
      {/* <Link href="/adm/course/create">
        <a
          className={`nav-link ${
            current === "/instructor/course/create" && "active"
          }`}
        >
          Create Course
        </a>
      </Link> */}
    </div>
  );
};

export default AdminNav;
