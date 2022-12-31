import React from "react";
import { Menu } from "semantic-ui-react";
import Channels from "./Channels";
import DirectMessages from "./DirectMessages";
import Starred from "./Starred";
import UserPanel from "./UserPanel";

const SidePanel = ({ currentUser, currentChannel, isPrivateChannel }) => {
  return (
    <Menu
      size="large"
      inverted
      fixed="left"
      vertical
      style={{ background: "#4c3c4c", fontSize: "1.2rem" }}
    >
      <UserPanel currentUser={currentUser} />
      <Starred />
      <Channels
        currentUser={currentUser}
        currentChannel={currentChannel}
        isPrivateChannel={isPrivateChannel}
      />
      <DirectMessages
        currentUser={currentUser}
        isPrivateChannel={isPrivateChannel}
      />
    </Menu>
  );
};

export default SidePanel;
