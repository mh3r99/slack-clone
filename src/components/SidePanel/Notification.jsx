import React, { useState, useEffect } from "react";
import { child, getDatabase, onValue, ref } from "firebase/database";
import { Label } from "semantic-ui-react";

const Notification = ({ user, channel, notificationChannelId }) => {
  const database = getDatabase();
  const messagesRef = ref(database, "privateMessages");
  const usersRef = ref(database, "users");

  const [channelsVisited, setChannelsVisited] = useState(null);
  const [messagesTimeStamp, setMessagesTimeStamp] = useState(null);

  useEffect(() => {
    setChannelsVisited(null);
    setMessagesTimeStamp(null);
  }, [notificationChannelId]);

  useEffect(() => {
    if (user) {
      onValue(child(usersRef, `${user.id}/lastVisited`), (snap) => {
        setChannelsVisited(snap.val());
      });

      onValue(messagesRef, (snap) => {
        let messages = snap.val();

        let channelsId = Object.keys(messages || {});
        let messagesTimeStamp = {};
        channelsId.forEach((channelId) => {
          let channelMessageKeys = Object.keys(messages[channelId]);
          channelMessageKeys.reduce((agg, item) => {
            messagesTimeStamp[channelId] = [
              ...(messagesTimeStamp[channelId] || []),
            ];
            messagesTimeStamp[channelId].push(
              messages[channelId][item].timestamp
            );
          });
        });
        setMessagesTimeStamp(messagesTimeStamp);
      });
    }
  }, [user]);

  const calcNotifications = (channelId) => {
    if (
      channelsVisited &&
      messagesTimeStamp &&
      channel &&
      channel.id !== channelId
    ) {
      let lastVisited = channelsVisited[channelId];

      let channelMessagesTimeStamp = messagesTimeStamp[channelId];

      if (channelMessagesTimeStamp) {
        let notificationCount = channelMessagesTimeStamp.filter(
          (timestamp) => !lastVisited || lastVisited < timestamp
        ).length;
        return notificationCount === 0 ? null : (
          <Label color="red">{notificationCount}</Label>
        );
      }

      return null;
    }
  };

  return <> {calcNotifications(notificationChannelId)} </>;
};

export default Notification;
