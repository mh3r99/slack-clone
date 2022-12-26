import React, { useState } from "react";
import { Modal, Input, Button, Icon } from "semantic-ui-react";

const FileModal = ({ modal, closeModal, uploadFile }) => {
  const [file, setFile] = useState(null);
  const [authorized, setAuthorized] = useState(["image/jpeg", "image/png"]);

  const addFile = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const sendFile = () => {
    if (file && isAuthorized(file.type)) {
      uploadFile(file);
      closeModal();
      setFile(null);
    }
  };

  const isAuthorized = (fileType) => authorized.includes(fileType);
  return (
    <Modal basic open={modal} onClose={closeModal}>
      <Modal.Header>Select an Image File</Modal.Header>
      <Modal.Content>
        <Input
          fluid
          label="File types: jpg, png"
          name="file"
          type="file"
          onChange={addFile}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button color="green" inverted onClick={sendFile}>
          <Icon name="checkmark" /> Send
        </Button>
        <Button color="red" inverted onClick={closeModal}>
          <Icon name="remove" /> Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default FileModal;
