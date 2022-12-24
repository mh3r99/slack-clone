import React from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessageForm from "./MessageForm";
import MessagesHeader from "./MessagesHeader";
import { getDatabase, ref, set, child } from "firebase/database";

const Messages = ({ currentChannel, currentUser }) => {
  const database = getDatabase();
  const messagesRef = ref(database, "messages");

  return (
    <>
      <MessagesHeader />
      <Segment>
        <Comment.Group className="messages"></Comment.Group>
      </Segment>

      <MessageForm
        messagesRef={messagesRef}
        currentChannel={currentChannel}
        currentUser={currentUser}
      />
    </>
  );
};

export default Messages;
