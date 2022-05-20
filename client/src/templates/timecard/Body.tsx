import React from "react";
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Select,
  Space,
  notification,
} from "antd";
import { FullscreenOutlined, FullscreenExitOutlined } from "@ant-design/icons";
import { API_URL } from "../../services/api";
import { Table } from "../../components";
import { useFetchStoresQuery } from "../../services/StoreService";
import { IStore } from "../../models/IStore";
import { useAuth } from "../../hooks/useAuth";
import moment from "moment";
import { useDate } from "../../hooks/useDate";
import {
  useFetchTimeCardsQuery,
  useStoreTimeCardsMutation,
} from "../../services/TimeCardService";

type Props = {
  preparationDate: moment.Moment;
};

const Body: React.FC<Props> = ({ preparationDate }) => {
  const [form] = Form.useForm();
  const { data: stores } = useFetchStoresQuery();
  const [store, setStore] = React.useState<IStore>();
  const { selectedDate } = useDate();
  const [changedForm, setChangedForm] = React.useState<boolean>(false);
  const [fullscreen, setFullscreen] = React.useState<boolean>(false);
  const { data: timeCards, isLoading: loadingData } = useFetchTimeCardsQuery(
    { storeId: store?.id, period: selectedDate },
    { skip: !store?.id }
  );
  const [
    storeTimeCards,
    { isLoading: storeLoading },
  ] = useStoreTimeCardsMutation();
  const [totalWorkingHours, setTotalWorkingHours] = React.useState<number>(0);
  const { user } = useAuth();

  React.useEffect(() => {
    if (stores) {
      if (user?.stores.length) {
        const tmp = stores.filter(
          (store: IStore) => store.id === user.stores[0].id
        );
        setStore(tmp[0]);
      } else setStore(stores[0]);
    }
  }, [stores]);

  React.useEffect(() => {
    let workingHours = 0;
    timeCards?.forEach((item) => (workingHours += item.normativeHours));
    setTotalWorkingHours(workingHours);
    form.resetFields();
  }, [timeCards]);

  React.useEffect(() => {
    if (fullscreen) document.body.style.overflow = "hidden";
    else document.body.removeAttribute("style");
  }, [fullscreen]);

  const saveData = async () => {
    if (changedForm) {
      let workingHours = 0;
      const data = await form.validateFields();
      let newData: any = [];
      for (const iterator in data) {
        data[iterator].forEach((item: any) => {
          if (item.status === "Я" && item.hours) {
            workingHours += Number(item.hours);
          }
        });

        newData.push({
          timeCard: Number(iterator.split("-")[1]),
          attendance: data[iterator].map((item: any) => ({
            status: item.status ? item.status : null,
            hours: item.hours ? Number(item.hours) : null,
          })),
        });
      }

      if (totalWorkingHours < workingHours) {
        notification.error({
          message: "Превышено норма часов!",
          description:
            "Превышено норма часов для сотрудника. Обратитесь в отдел кадров",
        });
        return;
      }

      await storeTimeCards(newData).unwrap();
    }
  };

  const handleChangeForm = () => setChangedForm(true);

  return (
    <Row style={{ marginTop: "1rem" }}>
      <Col>
        <Card
          title={
            <Select
              style={{ width: 720, color: "#da291c" }}
              value={store?.id}
              bordered={false}
              onChange={(value: string) => {
                if (stores)
                  setStore(
                    stores.filter((store: IStore) => store.id === value)[0]
                  );
              }}
            >
              {user?.stores.length
                ? user.stores.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))
                : stores &&
                  stores.map((item: IStore) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
            </Select>
          }
          className={"table" + (fullscreen ? " fullscreen" : "")}
          bordered={false}
          extra={
            <Space>
              {user?.role.name !== "worker" ? (
                <Button type="primary" disabled={!store}>
                  <a
                    href={`${API_URL}/export/time-card/${
                      store?.id
                    }?date=${preparationDate.format(
                      "YYYY-MM-DD"
                    )}&period=${selectedDate.format("YYYY-MM")}`}
                  >
                    Выгрузка в Excel
                  </a>
                </Button>
              ) : null}
              {fullscreen ? (
                <FullscreenExitOutlined onClick={() => setFullscreen(false)} />
              ) : (
                <FullscreenOutlined onClick={() => setFullscreen(true)} />
              )}
            </Space>
          }
          actions={[
            <div style={{ textAlign: "end" }}>
              <Button
                type="primary"
                loading={storeLoading}
                disabled={!changedForm}
                onClick={saveData}
              >
                Сохранить
              </Button>
            </div>,
          ]}
        >
          <Form form={form} component={false} onValuesChange={handleChangeForm}>
            <Table
              dataSource={timeCards || []}
              editable={user?.role.name !== "worker"}
              loading={loadingData}
            />
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Body;
