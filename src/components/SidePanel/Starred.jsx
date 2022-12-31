import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Menu, Icon } from "semantic-ui-react";
import {
  setCurrentChannel,
  setPrivateChannel,
} from "../../store/features/channelsSlice";

const Starred = () => {
  const dispatch = useDispatch();

  const [starredChannels, setStarredChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState("");

  const changeChannel = (channel) => {
    setActiveChannel(channel.id);
    dispatch(setCurrentChannel(channel));
    dispatch(setPrivateChannel(false));
  };

  const displayChannels = () =>
    starredChannels.length > 0 &&
    starredChannels.map((channel) => (
      <Menu.Item
        key={channel.id}
        onClick={() => changeChannel(channel)}
        name={channel.name}
        style={{ opacity: 0.7 }}
        // active={channel.id === activeChannel && !isPrivateChannel}
      >
        # {channel.name}
      </Menu.Item>
    ));
  return (
    <Menu.Menu className="menu">
      <Menu.Item>
        <span>
          <Icon name="star" /> STARRED{" "}
        </span>{" "}
        ({starredChannels.length})
      </Menu.Item>
      {displayChannels()}
    </Menu.Menu>
  );
};

export default Starred;
