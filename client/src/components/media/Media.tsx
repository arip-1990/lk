import React from "react";
import { Image as BaseImage, Row, Col, Popconfirm, Typography } from "antd";
import { CloseCircleOutlined, FilePdfOutlined } from "@ant-design/icons";
import { Document } from "react-pdf/dist/esm/entry.webpack";
import { IMedia } from "../../models/IMedia";
import { useDeleteMediaMutation } from "../../services/MediaService";

type ImageProps = {
  media: IMedia;
  onDelete: () => void;
};

const Image: React.FC<ImageProps> = ({ media, onDelete }) => (
  <div className="media" style={{ maxWidth: "33%", padding: "0 8px" }}>
    <Popconfirm
      title="Вы уверены, что хотите удалить?"
      onConfirm={onDelete}
      okText="Да"
      cancelText="Нет"
    >
      <CloseCircleOutlined />
    </Popconfirm>
    {media.type === "image" ? (
      <>
        <BaseImage src={media.url} />
        <Typography.Text
          type="secondary"
          style={{
            display: "inline-block",
            width: "100%",
            textAlign: "center",
            lineHeight: 1,
            padding: "0.25rem",
          }}
        >
          {media.title}
          <br />
          <span style={{ fontSize: "0.75rem" }}>
            ({media.createdAt.format("DD-MM-YYYY[г.]")})
          </span>
        </Typography.Text>
      </>
    ) : (
      <a href={media.url}>
        <FilePdfOutlined style={{ width: "100%", fontSize: 128 }} />
        <Typography.Text
          type="secondary"
          style={{
            display: "inline-block",
            width: "100%",
            textAlign: "center",
          }}
        >
          ({media.title})
        </Typography.Text>
      </a>
    )}
  </div>
);

type Props = { data: IMedia[] };

const Media: React.FC<Props> = ({ data }) => {
  const [deleteMedia] = useDeleteMediaMutation();

  return (
    <Row
      gutter={[16, 16]}
      style={{ flexDirection: "column", maxHeight: 1280, overflow: "auto" }}
    >
      <BaseImage.PreviewGroup>
        {data.map((media) => (
          <Image
            key={media.id}
            media={media}
            onDelete={() => deleteMedia(media.id)}
          />
        ))}
      </BaseImage.PreviewGroup>
    </Row>
  );
};

export { Media };
