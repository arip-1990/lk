import { FC, useState } from "react";
import {
  Form,
  Button,
  Checkbox,
  Col,
  Drawer,
  Radio,
  Row,
  Space,
  TreeSelect,
} from "antd";
import { DatePicker } from "antd";
import { CheckboxValueType } from "antd/es/checkbox/Group";

import { useAuth } from "../../hooks/useAuth";
import { useFetchStoresQuery } from "../../services/StoreService";

export type FormData = {
  status: "all" | "active" | "inactive";
  performer?: string;
  address?: string;
  date?: string;
};

interface IProps {
  show?: boolean;
  onHide?: () => void;
  onSorting?: (values: FormData) => void;
}

const Sorting: FC<IProps> = ({ show, onHide, onSorting }) => {
  const { user } = useAuth();
  const [form] = Form.useForm<FormData>();
  const [filters, setFilters] = useState<Array<CheckboxValueType>>([]);
  const { data: stores } = useFetchStoresQuery();

  const onFinish = async () => {
    try {
      const data = await form.validateFields();
      form.resetFields();

      onSorting && onSorting(data);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const performers = [
    {
      label: "Арип",
      value: "Арип",
    },
    {
      label: "Магомед",
      value: "Магомед",
    },
    {
      label: "Арслан",
      value: "Арслан",
    },
    {
      label: "Наби",
      value: "Наби",
    },
    {
      label: "Гаджи",
      value: "Гаджи",
    },
    {
      label: "Гаджимурад",
      value: "Гаджимурад",
    },
  ];

  const addresses = stores && [
    ...stores
      .filter((store) =>
        user?.stores.length
          ? user.stores.some((item) => item.id === store.id)
          : true
      )
      .map((item) => ({
        label: item.name,
        value: item.name,
      })),
    { label: "Офис", value: "" },
  ];

  const { RangePicker } = DatePicker;

  return (
    <Drawer
      title="Сортировка заявок"
      placement="right"
      width={500}
      onClose={onHide}
      open={show}
      extra={
        <Space>
          <Button type="primary" onClick={onFinish}>
            Применить
          </Button>
        </Space>
      }
    >
      <Form
        name="sorting"
        form={form}
        autoComplete="off"
        initialValues={{ status: "all" }}
      >
        <Form.Item name="status" noStyle>
          <Radio.Group buttonStyle="solid">
            <Radio.Button value="all">Все</Radio.Button>
            <Radio.Button value="active">Активные</Radio.Button>
            <Radio.Button value="inactive">Завершенные</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Checkbox.Group
          style={{ width: "100%", marginTop: 25 }}
          onChange={setFilters}
        >
          <Row>
            <Col span={8}>
              <Checkbox value="date" disabled>
                Дата
              </Checkbox>
            </Col>
            <Col span={8}>
              <Checkbox value="address">Адрес аптеки</Checkbox>
            </Col>
            <Col span={8}>
              <Checkbox value="performer">Исполнитель</Checkbox>
            </Col>
          </Row>
        </Checkbox.Group>

        {filters.map((item) => {
          if (item == "date") {
            return (
              <Form.Item key={item} name={item} rules={[{ required: true }]}>
                <Space direction="vertical" size={12} style={{ marginTop: 20 }}>
                  <RangePicker />
                </Space>
              </Form.Item>
            );
          }

          if (typeof item === "string" && item in ["performer", "address"]) {
            return (
              <Form.Item
                key={item}
                name={item}
                rules={[
                  {
                    required: true,
                    message: "Пожалуйста, выберите значение",
                  },
                ]}
              >
                <TreeSelect
                  style={{ width: "100%", marginTop: 20 }}
                  dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                  placeholder={
                    item == "performer" ? "Выбор исполнителя" : "Выбор аптеки"
                  }
                  treeData={item == "performer" ? performers : addresses}
                  treeDefaultExpandAll
                />
              </Form.Item>
            );
          }
          return null;
        })}
      </Form>
    </Drawer>
  );
};

export default Sorting;
