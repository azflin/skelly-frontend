import React, {useEffect, useMemo, useState} from 'react';
import { useParams } from "react-router-dom";
import NftTile from "./NftTile";

export default React.memo(function Wallet() {
  const { address } = useParams();
  const [nfts, setNfts] = useState();

  useEffect(async () => {
    console.log("Wallet useEffect");
    const response = await fetch(
      `https://api.paintswap.finance/userNFTs/${address}?allowNSFW=true&numToFetch=20&numToSkip=0`,
    );
    const data = await response.json();
    setNfts(data.nfts);
    console.log(data.nfts);
  }, [address]);

  return (
    <>
      <h1>Displaying NFTs of { address }</h1>
      {nfts && nfts.map((nft =>
        <NftTile key={nft.id} tokenURI={nft.nft.uri}></NftTile>
      ))}
    </>
  )
});