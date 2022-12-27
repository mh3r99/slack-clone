import React from "react";
import { Menu, Icon } from "semantic-ui-react";

const DirectMessages = () => {
  const users = [];
  return (
    <Menu.Menu className="menu">
      <Menu.Item>
        <span>
          <Icon name="mail" /> DIRECT MESSAGES
        </span>{" "}
        ({users.length})
      </Menu.Item>
    </Menu.Menu>
  );
};

export default DirectMessages;
