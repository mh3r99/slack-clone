import "./App.css";
import { Grid } from "semantic-ui-react";
import ColorPanel from "../ColorPanel/ColorPanel";
import SidePanel from "../SidePanel/SidePanel";
import Messages from "../Messages/Messages";
import MetaPanel from "../MetaPanel/MetaPanel";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function App() {
  const { currentUser } = useSelector((state) => state.user);
  const { currentChannel, favoriteChannels } = useSelector(
    (state) => state.channels
  );

  return (
    <>
      {!currentUser ? (
        <Navigate to="/login" />
      ) : (
        <Grid columns="equal" className="app" style={{ background: "#eee" }}>
          <ColorPanel />
          <SidePanel
            currentUser={currentUser}
            currentChannel={currentChannel}
            favoriteChannels={favoriteChannels}
          />
          <Grid.Column style={{ marginLeft: 320 }}>
            <Messages
              currentChannel={currentChannel}
              currentUser={currentUser}
              favoriteChannels={favoriteChannels}
            />
          </Grid.Column>
          <Grid.Column width={4}>
            <MetaPanel />
          </Grid.Column>
        </Grid>
      )}
    </>
  );
}

export default App;
