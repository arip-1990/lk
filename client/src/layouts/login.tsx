import React from "react";
import { Layout } from "antd";
import { Footer } from "../templates";

type Props = {
  children?: React.ReactNode;
};

const LoginLayout: React.FC<Props> = ({ children }) => {
  return (
    <Layout className="login">
      <Layout.Content style={{ display: "flex" }}>{children}</Layout.Content>
      <Footer />
    </Layout>
  );
};

export default LoginLayout;
