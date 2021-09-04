import './App.css';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import Browse from "./components/Browse";
import Wallet from "./components/Wallet";
import Token from "./components/Token";

function App() {
  const Root = (props) => (
    <div style={{
      display: 'flex'
    }} {...props}/>
  )

  const Sidebar = (props) => (
    <div style={{
      width: '250px',
      height: '100vh',
      overflow: 'auto',
      borderStyle: 'groove'
    }} {...props} />
  )

  const Main = (props) => (
    <div style={{
      flex: 1,
      height: '100vh',
      overflow: 'auto'
    }} {...props} />
  )

  return (
    <Router>
      <Root>
        <Sidebar>
          <h3>NFT MARKETPLACE</h3>
          <div>Browse</div>
          <div>My NFTs</div>
        </Sidebar>
        <Main>
          <Switch>
            <Route exact path="/">
              <Browse></Browse>
            </Route>
            <Route path="/wallet/:address">
              <Wallet></Wallet>
            </Route>
            <Route path="/collection/:collectionAddress/:tokenId">
              <Token></Token>
            </Route>
          </Switch>
        </Main>
      </Root>
    </Router>
  );
}

export default App;
