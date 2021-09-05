import './App.css';
import {
  HashRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Browse from './components/Browse';
import Wallet from './components/Wallet';
import Token from './components/Token';
import Collection from "./components/Collection";
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import { NETWORK } from './config';

const COLLECTIONS = [
  {
    name: "Baby Boo",
    address: "0xf6a4dc2c70e45a43c85151c4afa89f3ea9c463fd"
  },
  {
    name: "Fantums",
    address: "0x0c600d41b9c7656e60c0bf76d79b1532b4770d0c"
  },
  {
    name: "Strange Brew",
    address: "0x9044948e1a934340766c16f094cc32205d60d1b2"
  },
  {
    name: "Shiba Punks",
    address: "0x28908d5795b4d8f4cc175c63523f974412f2a5b1"
  }
]

function App() {
  // Provider, signer, and address
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [address, setAddress] = useState();

  // Various loading, status etc variables
  const [metamaskInstalled, setMetamaskInstalled] = useState(false);
  const [wrongChain, setWrongChain] = useState(false);
  const [ready, setReady] = useState();

  // Function to request metamask connection. This sets signer.
  const connectMetamask = async () => {
    if (provider) {
      try {
        let accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setAddress(accounts[0]);
        setSigner(provider.getSigner());
      } catch {
        console.log('User rejected connection request.');
      }
    }
  };

  // On initial load, set the provider. If already connected, set address and signer as well.
  useEffect(() => {
    async function getProvider() {
      if (await detectEthereumProvider()) {
        setMetamaskInstalled(true);
        let p = new ethers.providers.Web3Provider(window.ethereum, 'any');
        // Listen for chain changes
        p.on('network', (newNetwork, oldNetwork) => {
          // When a Provider makes its initial connection, it emits a "network"
          // event with a null oldNetwork along with the newNetwork. So, if the
          // oldNetwork exists, it represents a changing network
          if (oldNetwork) {
            window.location.reload();
          }
        });
        let chainId = (await p.getNetwork()).chainId;
        if (chainId !== NETWORK.chainId) {
          setWrongChain(true);
          return;
        }
        let accounts = await p.listAccounts();
        if (accounts.length) {
          setAddress(accounts[0]);
          setSigner(p.getSigner());
        }
        setProvider(p);
        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
          console.log('Accounts changed', accounts[0]);
          setAddress(accounts[0]);
        });
        setReady(true);
      }
    }
    getProvider();
  }, []);

  const Root = (props) => (
    <div
      style={{
        display: 'flex',
      }}
      {...props}
    />
  );

  const Sidebar = (props) => (
    <div
      style={{
        width: '250px',
        height: '100vh',
        overflow: 'auto',
        borderStyle: 'groove',
      }}
      {...props}
    />
  );

  const Main = (props) => (
    <div
      style={{
        flex: 1,
        height: '100vh',
        overflow: 'auto',
      }}
      {...props}
    />
  );

  return (
    <Router>
      <Root>
        <Sidebar>
          <h3>NFT MARKETPLACE</h3>
          <div><a href="#/">Browse</a></div>
          <div><a href={"#/wallet/" + address}>My NFTs</a></div>
          <h3>Collections</h3>
          {COLLECTIONS.map((x) =>
            <div>
              <a href={"#/collection/" + x.address}>
                {x.name}
              </a>
            </div>
          )}
        </Sidebar>
        <Main>
          {wrongChain ? (
            <h1>Wrong Chain - switch to FTM 250</h1>
          ) : (
            <>
              <div align='right'>
                {address ? (
                  <button>
                    {NETWORK.name +
                      ': ' +
                      address.slice(0, 6) +
                      '...' +
                      address.slice(38)}
                  </button>
                ) : (
                  <button onClick={connectMetamask}>Connect</button>
                )}
              </div>
              <Switch>
                <Route exact path='/'>
                  {ready && <Browse></Browse>}
                </Route>
                <Route path='/wallet/:address'>
                  {ready && <Wallet></Wallet>}
                </Route>
                <Route path='/collection/:collectionAddress/:tokenId'>
                  {ready && <Token provider={provider} />}
                </Route>
                <Route path='/collection/:contract'>
                  {ready && <Collection></Collection>}
                </Route>
              </Switch>
            </>
          )}
        </Main>
      </Root>
    </Router>
  );
}

export default App;
