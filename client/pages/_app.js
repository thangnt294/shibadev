import TopNav from "../components/TopNav";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.css";
import "../public/css/styles.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "../context";
import Head from "next/head";

const MyApp = ({ Component, pageProps }) => {
  return (
    <Provider>
      <Head>
        <link rel="shortcut icon" href="/logo.png" />
        <title>ShibaDev Education</title>
      </Head>
      <ToastContainer />
      <TopNav />
      <Component {...pageProps} />
    </Provider>
  );
};

export default MyApp;
