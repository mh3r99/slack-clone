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
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const database = getDatabase();
  const messagesRef = ref(database, "messages");

  useEffect(() => {
    if (currentChannel) {
      addMessageListener();
    }

    return () => {
      setMessages([]);
      setSearchResults([]);
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

  const handleSearchChange = (e) => {
    setIsSearching(true);

    const channelMessages = [...messages];
    const regex = new RegExp(e.target.value, "gi");
    const result = channelMessages.reduce((acc, message) => {
      if (message?.content?.match(regex) || message?.user?.name?.match(regex)) {
        acc.push(message);
      }

      return acc;
    }, []);

    setSearchResults(result);
    setTimeout(() => setIsSearching(false), 1000);
  };

  const displayMessages = (messages) =>
    messages.map((message) => (
      <Message
        key={message.timestamp}
        message={message}
        currentUser={currentUser}
      />
    ));

  return (
    <>
      <MessagesHeader
        channelName={displayChannelName()}
        numUniqueUsers={numUniqueUsers}
        handleSearchChange={handleSearchChange}
        isSearching={isSearching}
      />
      <Segment>
        <Comment.Group
          className={progressBar ? "messages__progress" : "messages"}
        >
          {isSearching
            ? displayMessages(searchResults)
            : displayMessages(messages)}
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
