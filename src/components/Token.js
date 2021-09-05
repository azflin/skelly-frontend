import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import collectionABI from '../collectionABI';

export default function Token({ provider }) {
  const { collectionAddress, tokenId } = useParams();
  // const [uri, setURI] = useState();
  const [data, setData] = useState();
  const [name, setName] = useState();

  useEffect(() => {
    async function fetchAPI() {
      let contract = await new ethers.Contract(
        collectionAddress,
        collectionABI,
        provider
      );

      let uri = await contract.tokenURI(tokenId);
      let name = await contract.name();

      let response = await fetch(uri);

      if (response.ok) {
        setData(await response.json());
        setName(name);
      } else {
        console.log('HTTP-Error: ' + response.status);
      }
    }

    fetchAPI();
  }, []);
  return (
    <div style={{ marginLeft: '5rem' }}>
      {name && <h1>{name}</h1>}
      <img src={data && data.image} />
      {data && <h1>{data.name}</h1>}
      {data && (
        <text>
          ID: {data.id} of {data.totalFantums}
        </text>
      )}
      <br />
      {data && <text>Description: {data.description}</text>}
    </div>
  );
}
