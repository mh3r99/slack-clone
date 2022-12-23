import React, { useState, useEffect } from "react";
import { Button, Form, Icon, Input, Menu, Modal } from "semantic-ui-react";
import {
  getDatabase,
  ref,
  set,
  child,
  push,
  onChildAdded,
} from "firebase/database";
import { useDispatch } from "react-redux";
import { setCurrentChannel } from "../../store/features/channelsSlice";

const Channels = ({ currentUser }) => {
  const dispatch = useDispatch();
  const database = getDatabase();
  const channelsRef = ref(database, "channels");
  const [channels, setChannels] = useState([]);
  const [modal, setModal] = useState(false);
  const [formData, setFormData] = useState({
    channelName: "",
    channelDetails: "",
  });
  const { channelName, channelDetails } = formData;

  useEffect(() => {
    addListeners();
  }, []);

  const addListeners = () => {
    let loadedChannels = [];

    onChildAdded(channelsRef, (data) => {
      loadedChannels.push(data.val());
      setChannels(loadedChannels);
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid()) {
      const key = push(channelsRef).key;

      const newChannel = {
        id: key,
        name: channelName,
        details: channelDetails,
        createdBy: {
          name: currentUser.name,
          avatar: currentUser.avatar,
        },
      };

      await set(child(channelsRef, key), newChannel);

      setFormData({
        channelName: "",
        channelDetails: "",
      });

      addListeners();

      setModal(false);
    }
  };

  const isFormValid = () => channelName && channelDetails;

  const displayChannels = () =>
    channels.length > 0 &&
    channels.map((channel) => (
      <Menu.Item
        key={channel.id}
        onClick={() => dispatch(setCurrentChannel(channel))}
        name={channel.name}
        style={{ opacity: 0.7 }}
      >
        # {channel.name}
      </Menu.Item>
    ));

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
        {displayChannels()}
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
