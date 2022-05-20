import React from "react";
import {
  Row,
  Col,
  List,
  Table,
  Form,
  Select,
  Input,
  InputNumber,
  DatePicker,
  Space,
  TablePaginationConfig,
} from "antd";
import {
  EditOutlined,
  SaveOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { useFetchProvidersQuery } from "../../services/ProviderService";
import { IStore } from "../../models/IStore";
import { IProvider } from "../../models/IProvider";
import { IClaim } from "../../models/IClaim";
import {
  useFetchClaimsByStoreQuery,
  useUpdateClaimMutation,
} from "../../services/ClaimService";

const Claim: React.FC = () => {
  const [form] = Form.useForm();
  const [stores, setStores] = React.useState<IStore[]>([]);
  const [currentStore, setCurrentStore] = React.useState<string>("");
  const [pagination, setPagination] = React.useState({
    current: 1,
    pageSize: 10,
  });
  const { user } = useAuth();
  const { data: claims } = useFetchClaimsByStoreQuery(
    { storeId: currentStore || stores[0]?.id, pagination },
    { skip: !currentStore || !stores.length }
  );
  const [update, { isLoading: updateClaimLoading }] = useUpdateClaimMutation();
  const { data: providers } = useFetchProvidersQuery();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [editClaim, setEditClaim] = React.useState<IClaim | null>(null);
  const [editable, setEditable] = React.useState<number | null>(null);

  const tableColumns = [
    {
      title: "Дата",
      width: 120,
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
            initialValue={provider?.id}
          >
            <Select
              bordered={false}
              options={
                providers &&
                providers.map((item: any) => ({
                  label: item.name,
                  value: item.id,
                }))
              }
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
            initialValue={text}
          >
            <Input bordered={false} />
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
            initialValue={total}
          >
            <InputNumber bordered={false} />
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
            initialValue={text}
          >
            <Input bordered={false} />
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
            initialValue={text}
          >
            <Input bordered={false} />
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
            <DatePicker bordered={false} />
          </Form.Item>
        ) : (
          <p>{date?.format("DD MMM YYYY")}</p>
        ),
    },
    {
      title: "Дата довоза по этой накладной",
      align: "center" as "center",
      dataIndex: "deliveryAt",
      render: (
        date: moment.Moment | undefined,
        record: IClaim,
        index: number
      ) =>
        record.editable ? (
          <Form.Item
            name={["claims", index, "deliveryAt"]}
            style={{ margin: 0 }}
            initialValue={date}
          >
            <DatePicker bordered={false} />
          </Form.Item>
        ) : (
          <p>{date?.format("DD MMM YYYY")}</p>
        ),
    },
    {
      title: "",
      align: "center" as "center",
      dataIndex: "operation",
      render: (_: any, record: IClaim, index: number) => (
        <Space>
          {user?.role.name !== "worker" ? (
            record.editable ? (
              <>
                <SaveOutlined style={{ color: "#2b74b7" }} onClick={saveRow} />
                <CloseCircleOutlined
                  style={{ color: "#dc4234" }}
                  onClick={cancelEditRow}
                />
              </>
            ) : (
              <EditOutlined
                style={{ color: "#2b74b7" }}
                onClick={handleEditRow(index, record)}
              />
            )
          ) : null}
        </Space>
      ),
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

  React.useEffect(() => form.resetFields(), [editClaim]);

  const saveRow = async () => {
    if (editable !== null && editClaim) {
      let data = await form.validateFields();
      data = data.claims.filter((item: any) => item != null);
      update({ id: editClaim.id, data: data[0] });
      setEditable(null);
      setEditClaim(null);
    }
  };

  const fetcStores = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<IStore[]>("/provider/store");
      setStores(data);
      setCurrentStore(data[0].id);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const cancelEditRow = () => {
    handleEditRow(null);
    setEditable(null);
  };

  const handleEditRow = (
    index: number | null,
    claim: IClaim | null = null
  ) => () => {
    setEditable(index);
    setEditClaim(claim);
  };

  const handleClick = (id: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    setCurrentStore(id);
    setPagination({ current: 1, pageSize: 10 });
    setEditable(null);
  };

  const handleChange = (pag: TablePaginationConfig) => {
    setPagination({
      current: pag.current || pagination.current,
      pageSize: pag.pageSize || pagination.pageSize,
    });
  };

  return (
    <Row>
      <Col span={24} className="scroll-list">
        <List
          loading={loading || updateClaimLoading}
          itemLayout="horizontal"
          dataSource={stores}
          renderItem={(store) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <a
                    className={currentStore === store.id ? "active" : ""}
                    href="/"
                    onClick={handleClick(store.id)}
                  >
                    {store.name}
                  </a>
                }
              />
              <span>{store.totalClaims}</span>
            </List.Item>
          )}
        />
      </Col>
      <Col span={24} style={{ marginTop: "3rem" }}>
        <div>
          <h3 style={{ color: "#2b74b7" }}>
            Аптека: {stores.find((item) => item.id === currentStore)?.name}
          </h3>
          <Form form={form} component={false}>
            <Table
              bordered
              loading={loading}
              rowClassName={(record) =>
                record.deliveryAt !== undefined ? "claim disable" : "claim"
              }
              columns={tableColumns}
              dataSource={
                claims?.data &&
                claims.data.map((claim, index) => ({
                  ...claim,
                  key: claim.id,
                  editable: editable === index,
                }))
              }
              pagination={{
                current: claims?.meta.current_page || pagination.current,
                total: claims?.meta.total || 0,
                pageSize: claims?.meta.per_page || pagination.pageSize,
              }}
              onChange={handleChange}
            />
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default Claim;
