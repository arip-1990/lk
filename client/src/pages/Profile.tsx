import React, {useState} from "react";
import { Row, Col, Card, Tabs, Button, Modal, Select } from "antd";
import { useLocation } from "react-router-dom";
import type { TabsProps } from 'antd';

import { useAuth } from "../hooks/useAuth";
import { User, Test, WorkerTest } from "../templates";
import { API_URL } from "../services/api";
import Claim from "../templates/profile/Claim";
import {useFetchStoresQuery} from "../services/StoreService";

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<string>("1");
  const [testType, setTestType] = React.useState<string>("base");
  const { user } = useAuth();
  const {state} = useLocation();
  const [openModalExport, setOpenModalExport] = useState<boolean>(false);
  const {data:stores} = useFetchStoresQuery()
  const [storeId, setStoreId] = useState<string>('')
console.log(testType)
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Личные данные',
      children: <User />,
    },
    {
      key: '2',
      label: 'Результаты тестов',
      children: user?.role.name === "worker" ? (
        <Test
          user={{
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
          }}
          onChangeTestType={(type) => console.log(type)}
        />
      ) : (
        <WorkerTest onChangeTestType={(type) => setTestType(type)} />
      ),
    },
    {
      key: '3',
      label: 'Претензии к поставщикам',
      children: <Claim />,
    },
  ];

  React.useEffect(() => setActiveTab(state?.key || "1"), [state]);

  const handleChange = (key: string) => {
    setActiveTab(key);
  };

  const exportModal = (activeTab: string) => {
      if (activeTab !== "2") return ""
      setOpenModalExport(true)
  }
  const selectStore = (value: string) => {
      setStoreId(value)
  };

  return (
    <Row style={{ flex: 1 }}>
      <Col span={24}>
        <Card style={{ height: "100%" }}>
          <Tabs
            style={{ color: "#22aca6" }}
            onChange={handleChange}
            activeKey={activeTab}
            tabBarExtraContent={
              user?.role.name === "admin" &&
              (activeTab == "2" || activeTab == "3") ? (
                <Button
                    type="primary"
                    onClick={() => exportModal(activeTab)}
                >
                    {activeTab == "2" ?
                        "Выгрузка в Excel"

                        :
                        <a
                            href={`${API_URL}/export/claim`}
                        >
                            Выгрузка в Excel
                        </a>
                    }
                </Button>
              ) : null
            }
          
            items={items}
          />
            <Modal
                title="Basic Modal"
                open={openModalExport}
                okText={<a href={`${API_URL}/export/test/${testType}?store_id=${storeId}`}>Выгрузить в exel</a>}
                onCancel={() => setOpenModalExport(false)}
            >
                <Select
                    showSearch
                    style={{ width: 400 }}
                    placeholder="Search to Select"
                    optionFilterProp="label"
                    onChange={selectStore}
                    filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    options={stores?.map((store) => {
                        return {
                            value: store.id,
                            label: store.name
                        }
                    })}
                />

            </Modal>
        </Card>
      </Col>
    </Row>
  );
};

export default Profile;
