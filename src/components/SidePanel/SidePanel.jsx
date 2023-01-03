import React from "react";
import { Menu } from "semantic-ui-react";
import Channels from "./Channels";
import DirectMessages from "./DirectMessages";
import FavoriteChannels from "./FavoriteChannels";
import UserPanel from "./UserPanel";

const SidePanel = ({ currentUser, currentChannel, favoriteChannels }) => {
  return (
    <Menu
      size="large"
      inverted
      fixed="left"
      vertical
      style={{ background: "#4c3c4c", fontSize: "1.2rem" }}
    >
      <UserPanel currentUser={currentUser} />
      <FavoriteChannels
        currentUser={currentUser}
        currentChannel={currentChannel}
        favoriteChannels={favoriteChannels}
      />
      <Channels currentUser={currentUser} currentChannel={currentChannel} />
      <DirectMessages
        currentUser={currentUser}
        currentChannel={currentChannel}
      />
    </Menu>
  );
};

export default SidePanel;
