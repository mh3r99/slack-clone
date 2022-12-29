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

const DirectMessages = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);
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

  return (
    <Menu.Menu className="menu">
      <Menu.Item>
        <span>
          <Icon name="mail" /> DIRECT MESSAGES
        </span>{" "}
        ({users.length})
      </Menu.Item>
      {users.map((user) => (
        <Menu.Item
          key={user.id}
          onClick={() => console.log(user)}
          style={{ opacity: 0.7, fontStyle: "italic" }}
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
