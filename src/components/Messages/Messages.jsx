import React, { useEffect, useState } from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessageForm from "./MessageForm";
import MessagesHeader from "./MessagesHeader";
import { getDatabase, ref, child, onChildAdded } from "firebase/database";
import Message from "./Message";

const Messages = ({ currentChannel, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);

  const database = getDatabase();
  const messagesRef = ref(database, "messages");

  useEffect(() => {
    if (currentChannel && currentUser) {
      addListeners(currentChannel.id);
    }
  }, [currentChannel, currentUser]);

  const addListeners = (channelId) => {
    addMessageListener(channelId);
  };

  const addMessageListener = (channelId) => {
    let loadedMessages = [];

    onChildAdded(child(messagesRef, channelId), (data) => {
      loadedMessages.push(data.val());
      setMessages(loadedMessages);
      setMessagesLoading(false);
    });
  };

  console.log(messages);

  return (
    <>
      <MessagesHeader />
      <Segment>
        <Comment.Group className="messages">
          {messages.length > 0 &&
            messages.map((message) => (
              <Message
                key={message.timestamp}
                message={message}
                currentUser={currentUser}
              />
            ))}
        </Comment.Group>
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
