import {
  GithubFilled,
  FacebookFilled,
  LinkedinFilled,
} from "@ant-design/icons";
import Link from "next/link";
import { Space } from "antd";

const Footer = () => (
  <div className="footer">
    <div className="container">
      <div className="row">
        <div className="col-md-8">
          <h2 className="text-white">
            <b>About us</b>
          </h2>
          <p className="lead">
            ShibaDev is probably the best platform for you to learn and develop
            your programming skills. Here at ShibaDev we always put your
            learning experience as our top priority, and we strive to make sure
            that you'll have a great time assimilating new knowledge on our
            platform.
          </p>
        </div>
        <div className="col-md-4 text-center">
          <div className="vertical-center">
            <Space size="large">
              <Link href="https://github.com/thangnt294">
                <a target="_blank">
                  <GithubFilled className="h1 text-white" />
                </a>
              </Link>
              <Link href="https://www.facebook.com/thang294">
                <a target="_blank">
                  <FacebookFilled className="h1 text-white" />
                </a>
              </Link>
              <Link href="https://www.linkedin.com/in/thang-nguyen-7885bb1a7/">
                <a target="_blank">
                  <LinkedinFilled className="h1 text-white" />
                </a>
              </Link>
            </Space>
            <p class="copyright mt-2">ShibaDev © 2022</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Footer;
