import React from "react";
import { useParams } from "react-router-dom";
import { Training as BaseTraining } from "../components";
import Modal from "../components/training/Modal";
import { useAddTrainingMutation } from "../services/TrainingService";

const Training: React.FC = () => {
  const { id } = useParams();
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [addTraining, { isLoading: addLoading }] = useAddTrainingMutation();

  const handleAddTraining = async (values: any, file: File | undefined) => {
    if (id) {
      const formData = new FormData();
      formData.set("type", values.type);
      formData.set("title", values.title);
      values.link && formData.set("link", values.link);
      file && formData.set("file", file);
      addTraining({ id, data: formData });
    }
  };

  return (
    <>
      {id && <BaseTraining id={id} onModal={() => setModalVisible(true)} />}

      <Modal
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        onFormFinish={handleAddTraining}
        loading={addLoading}
      />
    </>
  );
};

export default Training;
