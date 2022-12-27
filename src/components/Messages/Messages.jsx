import React, { useEffect, useState } from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessageForm from "./MessageForm";
import MessagesHeader from "./MessagesHeader";
import { getDatabase, ref, child, onChildAdded, off } from "firebase/database";
import Message from "./Message";

const Messages = ({ currentChannel, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [progressBar, setProgressBar] = useState(false);
  const [numUniqueUsers, setNumUniqueUsers] = useState(0);

  const database = getDatabase();
  const messagesRef = ref(database, "messages");

  useEffect(() => {
    if (currentChannel) {
      addMessageListener();
    }

    return () => {
      setMessages([]);
      setMessagesLoading(true);
      off(messagesRef);
    };
  }, [currentChannel]);

  useEffect(() => {
    countUniqueUsers();
  }, [messages]);

  const addMessageListener = () => {
    onChildAdded(child(messagesRef, currentChannel.id), (data) => {
      setMessages((prev) => [...prev, data.val()]);
      setMessagesLoading(false);
    });
  };

  const isProgressBarVisible = (percent) => {
    if (percent > 0) {
      setProgressBar(true);
    } else {
      setProgressBar(false);
    }
  };

  const displayChannelName = () =>
    currentChannel ? `#${currentChannel?.name}` : "";

  const countUniqueUsers = () => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);

    const plural = uniqueUsers.length > 1;
    setNumUniqueUsers(`${uniqueUsers.length} user${plural ? "s" : ""}`);
  };

  return (
    <>
      <MessagesHeader
        channelName={displayChannelName()}
        numUniqueUsers={numUniqueUsers}
      />
      <Segment>
        <Comment.Group
          className={progressBar ? "messages__progress" : "messages"}
        >
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
        isProgressBarVisible={isProgressBarVisible}
      />
    </>
  );
};

export default Messages;
