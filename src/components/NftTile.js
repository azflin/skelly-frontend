import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

export default function NftTile({tokenURI}) {

  const [imageURL, setImageURL] = useState();

  useEffect(async () => {
    let response, data;
    response = await fetch(tokenURI);
    if (response.ok) {
      data = await response.json();
      setImageURL(data.image)
    } else {
      console.log("FETCH ERROR", response.statusText);
    }
    console.log("tokenURI response", data);
  }, []);

  return (
    <div>
      <span>NFT TILE for {tokenURI}</span>
      {imageURL && <img src={imageURL} alt=""/>}
    </div>
  )
}