import React from "react";
import { Comment, Image } from "semantic-ui-react";
import moment from "moment";

const Message = ({ message, currentUser }) => {
  return (
    <Comment>
      <Comment.Avatar src={message.user.avatar} />
      <Comment.Content
        className={message.user.id === currentUser.id ? "message__self" : "'"}
      >
        <Comment.Author as="a">{message.user.name}</Comment.Author>
        <Comment.Metadata>
          {moment(message.timestamp).fromNow()}
        </Comment.Metadata>
        {message?.image ? (
          <Image src={message.image} className="message__image" />
        ) : (
          <Comment.Text>{message.content}</Comment.Text>
        )}
      </Comment.Content>
    </Comment>
  );
};

export default Message;
