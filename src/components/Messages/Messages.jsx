import React, { useEffect, useState } from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessageForm from "./MessageForm";
import MessagesHeader from "./MessagesHeader";
import {
  getDatabase,
  ref,
  child,
  onChildAdded,
  onChildRemoved,
  off,
  update,
  remove,
  set,
} from "firebase/database";
import Message from "./Message";
import { useDispatch } from "react-redux";
import {
  removeFavoriteChannel,
  setFavoriteChannel,
} from "../../store/features/channelsSlice";

const Messages = ({ currentChannel, currentUser, favoriteChannels }) => {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [progressBar, setProgressBar] = useState(false);
  const [numUniqueUsers, setNumUniqueUsers] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const database = getDatabase();
  const messagesRef = ref(database, "messages");
  const privateMessagesRef = ref(database, "privateMessages");
  const usersRef = ref(database, "users");

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

  useEffect(() => {
    if (currentUser) {
      onChildAdded(child(usersRef, `${currentUser.id}/favorite`), (data) => {
        dispatch(setFavoriteChannel(data.val()));
      });

      onChildRemoved(child(usersRef, `${currentUser.id}/favorite`), (data) => {
        dispatch(removeFavoriteChannel(data.val()));
      });
    }
  }, [currentUser]);

  const addMessageListener = () => {
    onChildAdded(child(getMessagesRef(), currentChannel.id), (data) => {
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
    currentChannel
      ? `${currentChannel.isPrivate ? "@" : "#"}${currentChannel.name}`
      : "";

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

  const getMessagesRef = () =>
    currentChannel?.isPrivate ? privateMessagesRef : messagesRef;

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

  const handleStar = () => {
    let favoriteRef = child(
      usersRef,
      `${currentUser.id}/favorite/${currentChannel.id}`
    );
    if (isChannelStarred()) {
      remove(favoriteRef);
    } else {
      set(favoriteRef, {
        channelId: currentChannel.id,
        channelName: currentChannel.name,
      });
    }
  };

  const isChannelStarred = () =>
    favoriteChannels.find(
      (channel) => channel.channelId === currentChannel?.id
    );

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
        isPrivateChannel={currentChannel?.isPrivate}
        handleStar={handleStar}
        isChannelStarred={isChannelStarred()}
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
        isPrivateChannel={currentChannel?.isPrivate}
        getMessagesRef={getMessagesRef}
      />
    </>
  );
};

export default Messages;
