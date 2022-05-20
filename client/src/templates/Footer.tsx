import React from "react";
import { Row } from "antd";
import moment from "moment";

const Footer: React.FC = () => {
  return (
    <footer className="layout-footer">
      <Row>ООО «Социальная аптека» ©{moment().format("YYYY")}</Row>
    </footer>
  );
};

export default Footer;
