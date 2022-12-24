import React, { useState } from "react";
import { Segment, Button, Input } from "semantic-ui-react";
import { push, child, serverTimestamp } from "firebase/database";
import FileModal from "./FileModal";

const MessageForm = ({ messagesRef, currentChannel, currentUser }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);

  const sendMessage = async () => {
    if (message) {
      setLoading(true);

      const newMessage = {
        content: message,
        user: {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
        },
        timestamp: serverTimestamp(),
      };

      await push(child(messagesRef, currentChannel.id), newMessage);

      setLoading(false);
      setMessage("");
    }
  };

  return (
    <Segment className="message__form">
      <Input
        fluid
        name="message"
        style={{ marginBottom: "0.7em" }}
        label={<Button icon="add" />}
        labelPosition="left"
        placeholder="Write your message"
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      />
      <Button.Group icon widths={2}>
        <Button
          color="orange"
          content="Add Reply"
          labelPosition="left"
          icon="edit"
          onClick={sendMessage}
          disabled={loading}
        />
        <Button
          color="teal"
          content="Upload media"
          labelPosition="right"
          icon="cloud upload"
          onClick={() => setModal(true)}
        />
        <FileModal modal={modal} closeModal={() => setModal(false)} />
      </Button.Group>
    </Segment>
  );
};

export default MessageForm;
