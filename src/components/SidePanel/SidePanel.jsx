import React from "react";
import { Menu } from "semantic-ui-react";
import Channels from "./Channels";
import DirectMessages from "./DirectMessages";
import UserPanel from "./UserPanel";

const SidePanel = ({ currentUser, isPrivateChannel }) => {
  return (
    <Menu
      size="large"
      inverted
      fixed="left"
      vertical
      style={{ background: "#4c3c4c", fontSize: "1.2rem" }}
    >
      <UserPanel currentUser={currentUser} />
      <Channels currentUser={currentUser} isPrivateChannel={isPrivateChannel} />
      <DirectMessages
        currentUser={currentUser}
        isPrivateChannel={isPrivateChannel}
      />
    </Menu>
  );
};

export default SidePanel;
