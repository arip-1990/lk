import { FC, ReactNode } from "react";
import { Layout } from "antd";

import { Footer } from "../templates";

interface IProps {
  children?: ReactNode;
}

const LoginLayout: FC<IProps> = ({ children }) => {
  return (
    <Layout className="login">
      <Layout.Content style={{ display: "flex" }}>{children}</Layout.Content>
      <Footer />
    </Layout>
  );
};

export default LoginLayout;
