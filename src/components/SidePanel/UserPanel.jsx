import React from "react";
import { Dropdown, Grid, Header, Icon, Image } from "semantic-ui-react";
import { getAuth, signOut } from "firebase/auth";

const UserPanel = ({ currentUser }) => {
  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth);
  };

  const dropdownOptions = [
    {
      key: "user",
      text: (
        <div>
          Signed in as <strong>{currentUser.name}</strong>
        </div>
      ),
      disabled: true,
    },
    {
      key: "avatar",
      text: <div>Change Avatar</div>,
    },
    {
      key: "signout",
      text: <div onClick={handleSignOut}>Sign Out</div>,
    },
  ];

  return (
    <Grid style={{ background: "#4c3c4c" }}>
      <Grid.Column>
        <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
          <Header inverted floated="left" as="h2">
            <Icon name="code" />
            <Header.Content>DevChat</Header.Content>
          </Header>
        </Grid.Row>
        <Header style={{ padding: "0.25em" }} as="h4" inverted>
          <Dropdown
            trigger={
              <span>
                <Image src={currentUser.avatar} avatar spaced="right" />
                {currentUser.name}
              </span>
            }
            options={dropdownOptions}
          />
        </Header>
      </Grid.Column>
    </Grid>
  );
};

export default UserPanel;
