import React, { useState, useEffect } from "react";
import { Menu, Icon } from "semantic-ui-react";
import {
  ref,
  getDatabase,
  onChildAdded,
  onValue,
  set,
  child,
  onDisconnect,
  onChildRemoved,
  off,
} from "firebase/database";
import { useDispatch } from "react-redux";
import { setCurrentChannel } from "../../store/features/channelsSlice";

const DirectMessages = ({ currentUser, currentChannel }) => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [activeChannel, setActiveChannel] = useState("");

  const database = getDatabase();
  const usersRef = ref(database, "users");
  const connectedRef = ref(database, ".info/connected");
  const statusRef = ref(database, "status");

  useEffect(() => {
    if (currentUser) {
      onChildAdded(usersRef, (data) => {
        if (
          currentUser.id !== data.key &&
          !users.find((user) => user.id === data.key)
        ) {
          let user = data.val();
          user.id = data.key;
          setUsers((prev) => [...prev, user]);
        }
      });

      onValue(connectedRef, (snap) => {
        if (snap.val()) {
          const userStatusRef = child(statusRef, currentUser.id);
          set(userStatusRef, true);
          onDisconnect(userStatusRef).remove();
        }
      });
    }

    return () => {
      off(usersRef);
      off(connectedRef);
    };
  }, [currentUser]);

  useEffect(() => {
    onChildAdded(statusRef, (data) => {
      if (currentUser.id !== data.key) {
        setConnectedUsers((prev) => [...prev, data.key]);
      }
    });

    onChildRemoved(statusRef, (data) => {
      if (currentUser.id !== data.key) {
        setConnectedUsers((prevState) => {
          let updatedState = [...prevState];
          let index = updatedState.indexOf(data.key);
          updatedState.splice(index, 1);
          return updatedState;
        });
      }
    });

    return () => off(statusRef);
  }, [users]);

  const changeChannel = (user) => {
    const channelId = getChannelId(user.id);

    const channelData = {
      id: channelId,
      name: user.name,
    };

    dispatch(
      setCurrentChannel({ ...channelData, isPrivate: true, isFavorite: false })
    );
    setActiveChannel(user.id);
  };

  const getChannelId = (userId) => {
    return userId < currentUser.id
      ? `${userId}/${currentUser.id}`
      : `${currentUser.id}/${userId}`;
  };

  return (
    <Menu.Menu className="menu">
      <Menu.Item>
        <span>
          <Icon name="star" /> DIRECT MESSAGES
        </span>{" "}
        ({users.length})
      </Menu.Item>
      {users.map((user) => (
        <Menu.Item
          key={user.id}
          onClick={() => changeChannel(user)}
          style={{ opacity: 0.7, fontStyle: "italic" }}
          active={activeChannel === user.id && currentChannel.isPrivate}
        >
          <Icon
            name="circle"
            color={connectedUsers.indexOf(user.id) !== -1 ? "green" : "red"}
          />
          @ {user.name}
        </Menu.Item>
      ))}
    </Menu.Menu>
  );
};

export default DirectMessages;
