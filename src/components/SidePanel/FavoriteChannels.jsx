import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Menu, Icon } from "semantic-ui-react";
import { setCurrentChannel } from "../../store/features/channelsSlice";

const FavoriteChannels = ({
  currentUser,
  currentChannel,
  favoriteChannels,
}) => {
  const dispatch = useDispatch();
  const [activeChannel, setActiveChannel] = useState("");

  const changeChannel = (channel) => {
    const channelData = {
      id: channel.channelId,
      name: channel.channelName,
    };

    dispatch(
      setCurrentChannel({ ...channelData, isPrivate: false, isFavorite: true })
    );
    setActiveChannel(channel.channelId);
  };

  return (
    <Menu.Menu className="menu">
      <Menu.Item>
        <span>
          <Icon name="star" /> STARRED
        </span>{" "}
        ({favoriteChannels.length})
      </Menu.Item>
      {favoriteChannels.map((channel) => (
        <Menu.Item
          key={channel.channelId}
          onClick={() => changeChannel(channel)}
          style={{ opacity: 0.7 }}
          active={
            activeChannel === channel.channelId && currentChannel.isFavorite
          }
        >
          # {channel.channelName}
        </Menu.Item>
      ))}
    </Menu.Menu>
  );
};

export default FavoriteChannels;
