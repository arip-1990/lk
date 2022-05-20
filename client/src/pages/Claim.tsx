import React from "react";
import {
  Row,
  Col,
  Table,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Space,
  DatePicker,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import api from "../services/api";
import { useFetchProvidersQuery } from "../services/ProviderService";
import { IProvider } from "../models/IProvider";
import { IStore } from "../models/IStore";
import { IClaim } from "../models/IClaim";
import {
  useFetchClaimsQuery,
  useAddClaimMutation,
} from "../services/ClaimService";
import { useDate } from "../hooks/useDate";

interface OptionType {
  label: React.ReactNode;
  value: string;
}

const Claim: React.FC = () => {
  const [form] = Form.useForm();
  const { selectedDate } = useDate();
  const { data: providers } = useFetchProvidersQuery();
  const { data: claims } = useFetchClaimsQuery(selectedDate);
  const [addClaim, { isLoading: addClaimLoading }] = useAddClaimMutation();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [stores, setStores] = React.useState<OptionType[]>([]);
  const [newClaims, setNewClaims] = React.useState<IClaim[]>([]);

  const tableColumns = [
    {
      title: "Дата",
      width: 100,
      align: "center" as "center",
      dataIndex: "createdAt",
      render: (date: moment.Moment | undefined) => (
        <p>{date?.format("DD MMM YYYY")}</p>
      ),
    },
    {
      title: "Поставщик",
      width: 180,
      align: "center" as "center",
      dataIndex: "provider",
      render: (
        provider: IProvider | undefined,
        record: IClaim,
        index: number
      ) =>
        record.editable ? (
          <Form.Item
            name={["claims", index, "provider"]}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Пожалуйста, выберите поставщика!`,
              },
            ]}
          >
            <Select
              bordered={false}
              options={
                providers &&
                providers.map((item: IProvider) => ({
                  label: item.name,
                  value: item.id,
                }))
              }
              value={provider?.id}
              onSelect={(value: any) => onInputChange("provider", index, value)}
            />
          </Form.Item>
        ) : (
          <p>{provider?.name}</p>
        ),
    },
    {
      title: "Накладная, номер и дата",
      align: "center" as "center",
      dataIndex: "invoice",
      render: (text: string | undefined, record: IClaim, index: number) =>
        record.editable ? (
          <Form.Item
            name={["claims", index, "invoice"]}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Пожалуйста, заполните поле!`,
              },
            ]}
          >
            <Input
              bordered={false}
              value={text}
              onChange={(e) => onInputChange("invoice", index, e.target.value)}
            />
          </Form.Item>
        ) : (
          <p>{text}</p>
        ),
    },
    {
      title: "Недовоз, указать сколько мест ",
      width: 100,
      align: "center" as "center",
      dataIndex: "notDelivery",
      render: (total: number | undefined, record: IClaim, index: number) =>
        record.editable ? (
          <Form.Item
            name={["claims", index, "notDelivery"]}
            style={{ margin: 0 }}
          >
            <InputNumber
              bordered={false}
              value={total}
              onChange={(value) => onInputChange("notDelivery", index, value)}
            />
          </Form.Item>
        ) : (
          <p>{total}</p>
        ),
    },
    {
      title: "Недовложение, указать  наименование и количество",
      align: "center" as "center",
      dataIndex: "notAttachment",
      render: (text: string | undefined, record: IClaim, index: number) =>
        record.editable ? (
          <Form.Item
            name={["claims", index, "notAttachment"]}
            style={{ margin: 0 }}
          >
            <Input
              bordered={false}
              value={text}
              onChange={(e) =>
                onInputChange("notAttachment", index, e.target.value)
              }
            />
          </Form.Item>
        ) : (
          <p>{text}</p>
        ),
    },
    {
      title: "Пересорт",
      align: "center" as "center",
      dataIndex: "regrading",
      render: (text: string | undefined, record: IClaim, index: number) =>
        record.editable ? (
          <Form.Item
            name={["claims", index, "regrading"]}
            style={{ margin: 0 }}
          >
            <Input
              bordered={false}
              value={text}
              onChange={(e) =>
                onInputChange("regrading", index, e.target.value)
              }
            />
          </Form.Item>
        ) : (
          <p>{text}</p>
        ),
    },
    {
      title: "Короткий срок годности",
      align: "center" as "center",
      dataIndex: "shortShelfLife",
      render: (
        date: moment.Moment | undefined,
        record: IClaim,
        index: number
      ) =>
        record.editable ? (
          <Form.Item
            name={["claims", index, "shortShelfLife"]}
            style={{ margin: 0 }}
            initialValue={date}
          >
            <DatePicker
              bordered={false}
              onChange={(value) =>
                onInputChange("shortShelfLife", index, value)
              }
            />
          </Form.Item>
        ) : (
          <p>{date?.format("DD MMM YYYY")}</p>
        ),
    },
    {
      title: "Дата довоза по этой накладной",
      align: "center" as "center",
      dataIndex: "deliveryAt",
      render: (date: moment.Moment | undefined) => (
        <p>{date?.format("DD MMM YYYY")}</p>
      ),
    },
    {
      title: "Аптека",
      width: 180,
      align: "center" as "center",
      dataIndex: "store",
      render: (
        store: { id: string; name: string } | undefined,
        record: IClaim,
        index: number
      ) =>
        record.editable ? (
          <Form.Item
            name={["claims", index, "store"]}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Пожалуйста, выберите аптеку!`,
              },
            ]}
          >
            <Select
              bordered={false}
              options={stores}
              value={store?.name}
              onSelect={(value: any) => onInputChange("store", index, value)}
            />
          </Form.Item>
        ) : (
          <p>{store?.name}</p>
        ),
    },
    {
      title: "",
      width: 40,
      align: "center" as "center",
      dataIndex: "operation",
      render: (_: any, record: IClaim, index: number) =>
        record.editable ? (
          <p>
            {
              <DeleteOutlined
                style={{ color: "#dc4234" }}
                onClick={deleteRow(index)}
              />
            }
          </p>
        ) : null,
    },
  ];

  React.useEffect(() => {
    setLoading(true);
    try {
      fetcStores();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const onInputChange = (key: string, index: number, value: any) => {
    if (claims) {
      const newData = [...newClaims];
      newData[index - claims.length][key] = value;
      setNewClaims(newData);
    }
  };

  const addRow = () => {
    setNewClaims([
      ...newClaims,
      {
        id: `newRow-${newClaims.length}`,
        provider: undefined,
        invoice: undefined,
        notDelivery: undefined,
        notAttachment: undefined,
        regrading: undefined,
        shortShelfLife: undefined,
        deliveryAt: undefined,
        createdAt: undefined,
        store: undefined,
        editable: true,
      },
    ]);
  };

  const deleteRow = (index: number) => () => {
    form.resetFields();
    claims &&
      setNewClaims(newClaims.filter((item, i) => i !== index - claims.length));
  };

  const fetcStores = async () => {
    const stores = await api.get<IStore[]>("/provider/store");
    setStores(
      stores.data.map((item) => ({
        label: item.name,
        value: item.id,
      }))
    );
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    addClaim(values.claims.filter((item: any) => item != null));
    setNewClaims([]);
  };

  return (
    <Row>
      <Col style={{ marginBottom: "1.5rem" }}>
        <Row>
          <Col>
            <Form form={form} component={false}>
              <Table
                bordered
                loading={loading || addClaimLoading}
                rowClassName={(record) =>
                  record.deliveryAt !== undefined ? "claim disable" : "claim"
                }
                pagination={false}
                columns={tableColumns}
                dataSource={
                  claims
                    ? [
                        ...claims.map((claim) => ({
                          ...claim,
                          key: claim.id,
                        })),
                        ...newClaims.map((claim) => ({
                          ...claim,
                          key: claim.id,
                        })),
                      ]
                    : [
                        ...newClaims.map((claim) => ({
                          ...claim,
                          key: claim.id,
                        })),
                      ]
                }
                footer={() => (
                  <div style={{ textAlign: "end" }}>
                    <Space>
                      <Button onClick={addRow} disabled={loading}>
                        Добавить поле
                      </Button>
                      <Button
                        type="primary"
                        onClick={handleSave}
                        disabled={loading}
                      >
                        Сохранить
                      </Button>
                    </Space>
                  </div>
                )}
              />
            </Form>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Claim;
