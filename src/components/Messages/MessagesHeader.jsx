import React from "react";
import { Header, Segment, Input, Icon } from "semantic-ui-react";

const MessagesHeader = ({
  channelName,
  numUniqueUsers,
  handleSearchChange,
  isSearching,
  isPrivateChannel,
  handleStar,
  isChannelStarred,
}) => {
  return (
    <Segment clearing>
      <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
        <span>
          {channelName}
          {!isPrivateChannel && (
            <Icon
              onClick={handleStar}
              name={isChannelStarred ? "star" : "star outline"}
              color={isChannelStarred ? "yellow" : "black"}
            />
          )}
        </span>
        <Header.Subheader>{numUniqueUsers}</Header.Subheader>
      </Header>
      <Header floated="right">
        <Input
          loading={isSearching}
          size="mini"
          icon="search"
          name="searchTerm"
          placeholder="Search Messages"
          onChange={handleSearchChange}
        />
      </Header>
    </Segment>
  );
};

export default MessagesHeader;
