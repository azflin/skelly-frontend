import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import collectionABI from '../abis/collectionABI';
import {NETWORK} from "../config";

export default function Token({ provider }) {
  const { collectionAddress, tokenId } = useParams();
  const [metadata, setMetadata] = useState();
  const [name, setName] = useState();
  const [owner, setOwner] = useState();

  useEffect(() => {
    async function fetchAPI() {
      console.log("UseEffect", collectionAddress, tokenId);
      let contract = await new ethers.Contract(
        collectionAddress,
        collectionABI,
        provider
      );

      let uri = await contract.tokenURI(tokenId);
      console.log("URI", uri);
      let name = await contract.name();
      console.log("name", name);
      let owner = await contract.ownerOf(tokenId);
      console.log("owner", owner);
      setOwner(owner);

      let response = await fetch(uri);

      if (response.ok) {
        let data = await response.json();
        setMetadata(data);
        setName(name);
      } else {
        console.log('HTTP-Error: ' + response.status);
      }
    }

    fetchAPI();
  }, [collectionAddress, tokenId]);

  return (
    <div style={{ marginLeft: '3rem' }}>
      {name && <h1>{name}</h1>}
      <div style={{ display: 'flex' }}>
        <img style={{ maxWidth: '22rem' }} src={metadata && metadata.image} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div>
            <b>Owner: </b>
            <a href={NETWORK.block_explorer_url + "address/" + {owner}} target="_blank">
              {owner}
            </a>
          </div>
          <div>
            <b>Token ID:</b> {tokenId}
          </div>
        </div>
      </div>
      <div>
        {metadata &&
          Object.keys(metadata).map((key) => {
            if (key === 'image') return;
            return <p key={key}>{key}: {JSON.stringify(metadata[key])}</p>;
          }
        )}
      </div>
    </div>
  );
}
