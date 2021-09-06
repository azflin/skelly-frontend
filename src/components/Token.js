import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import collectionABI from '../abis/collectionABI';
import {NETWORK} from "../config";

export default function Token({ provider, signer }) {
  const { collectionAddress, tokenId } = useParams();

  const [metadata, setMetadata] = useState();
  const [name, setName] = useState();
  const [owner, setOwner] = useState();
  const [isOwner, setIsOwner] = useState();
  const [salePrice, setSalePrice] = useState();

  // Fetch contract details and tokenURI json when collectionAddress or tokenID
  // change
  useEffect(() => {
    async function fetchAPI() {
      console.log("UseEffect", collectionAddress, tokenId);
      console.log("signer", signer);
      let contract = await new ethers.Contract(
        collectionAddress,
        collectionABI,
        provider
      );

      setName(await contract.name());
      let ownerLocal = await contract.ownerOf(tokenId)
      setOwner(ownerLocal);
      let address = await signer.getAddress();
      if (address == ownerLocal) {
        setIsOwner(true);
      }

      let uri = await contract.tokenURI(tokenId);
      let response = await fetch(uri);

      if (response.ok) {
        let data = await response.json();
        setMetadata(data);
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
          {isOwner &&
            <div style={{display: "flex"}}>
              <input type="number" value={salePrice} onChange={e => setSalePrice(e.target.value)} />
              <button>List for Sale</button>
            </div>
          }
        </div>
      </div>
      {/* NFT Metadata */}
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
