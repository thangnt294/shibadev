import {
  GithubFilled,
  FacebookFilled,
  LinkedinFilled,
} from "@ant-design/icons";
import Link from "next/link";
import { Space, Image } from "antd";

const Footer = () => (
  <div className="footer pb-1">
    <div className="container-fluid ms-0 me-0 pt-2">
      <div className="row">
        <div className="col-md-3 text-center">
          <Image src="/logo.png" preview={false} height={100} width={100} />
        </div>
        <div className="col-md-6">
          <h4 className="text-white">About us</h4>
          <p className="text-muted">
            ShibaDev is probably the best platform for you to learn and develop
            your programming skills. Here at ShibaDev we always put your
            learning experience as our top priority, and we strive to make sure
            that you'll have a great time assimilating new knowledge on our
            platform.
          </p>
        </div>
        <div className="col-md-3 text-center">
          <div className="vertical-center">
            <Space size="large">
              <Link href="https://github.com/thangnt294">
                <a target="_blank">
                  <GithubFilled className="h3 text-white" />
                </a>
              </Link>
              <Link href="https://www.facebook.com/thang294">
                <a target="_blank">
                  <FacebookFilled className="h3 text-white" />
                </a>
              </Link>
              <Link href="https://www.linkedin.com/in/thang-nguyen-7885bb1a7/">
                <a target="_blank">
                  <LinkedinFilled className="h3 text-white" />
                </a>
              </Link>
            </Space>
            <p className="copyright mt-2">ShibaDev © 2022</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Footer;
