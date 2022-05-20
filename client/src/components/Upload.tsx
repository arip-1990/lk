import React from "react";
import { Upload as BaseUpload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { UploadFile } from "antd/lib/upload/interface";

interface PropsType {
  accept?: string;
  changeFile: (file: File) => void;
}

const Upload: React.FC<PropsType> = ({ accept, changeFile }) => {
  const handleChange = (info: any) => changeFile(info.file);

  const beforeUpload = (file: UploadFile) => false;

  return (
    <BaseUpload
      accept={accept}
      maxCount={1}
      onChange={handleChange}
      beforeUpload={beforeUpload}
    >
      <Button icon={<UploadOutlined />}>Выберите файл</Button>
    </BaseUpload>
  );
};

export default Upload;
