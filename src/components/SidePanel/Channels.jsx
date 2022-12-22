import React, { useState } from "react";
import { Button, Form, Icon, Input, Menu, Modal } from "semantic-ui-react";
import { getDatabase, ref, set, child, push } from "firebase/database";

const Channels = ({ currentUser }) => {
  const [channels, setChannels] = useState([]);
  const [modal, setModal] = useState(false);
  const [formData, setFormData] = useState({
    channelName: "",
    channelDetails: "",
  });
  const { channelName, channelDetails } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid()) {
      const database = getDatabase();

      const key = push(child(ref(database), "channels")).key;

      const newChannel = {
        id: key,
        name: channelName,
        details: channelDetails,
        createdBy: {
          name: currentUser.name,
          avatar: currentUser.avatar,
        },
      };

      await set(ref(database, "channels/" + key), newChannel);

      setFormData({
        channelName: "",
        channelDetails: "",
      });
      setModal(false);
    }
  };

  const isFormValid = () => channelName && channelDetails;

  return (
    <>
      <Menu.Menu
        style={{
          paddingBottom: "2em",
        }}
      >
        <Menu.Item>
          <span>
            <Icon name="exchange" /> CHANNELS
          </span>{" "}
          ({channels.length}) <Icon name="add" onClick={() => setModal(true)} />
        </Menu.Item>
      </Menu.Menu>

      <Modal basic open={modal} onClose={() => setModal(false)}>
        <Modal.Header>Add a Channel</Modal.Header>
        <Modal.Content>
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <Input
                fluid
                label="Name of Channel"
                name="channelName"
                onChange={handleChange}
              />
            </Form.Field>
            <Form.Field>
              <Input
                fluid
                label="About the Channel"
                name="channelDetails"
                onChange={handleChange}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" inverted onClick={handleSubmit}>
            <Icon name="checkmark" /> Add
          </Button>
          <Button color="red" inverted onClick={() => setModal(false)}>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default Channels;
