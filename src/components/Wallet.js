import React, {useEffect, useState} from 'react';
import { useParams } from "react-router-dom";
import {NETWORK} from "../config";

export default React.memo(function Wallet() {
  const { address } = useParams();
  const [nfts, setNfts] = useState();

  useEffect(async () => {
    console.log("Wallet useEffect");
    const response = await fetch(
      `https://api.paintswap.finance/userNFTs/${address}?allowNSFW=true&numToFetch=100&numToSkip=0`,
    );
    const data = await response.json();
    setNfts(data.nfts);
  }, [address]);

  return (
    <div>
      <h1>{ address.slice(0, 6) + "..." + address.slice(address.length - 4, address.length) }'s NFTs</h1>
      <table>
        <thead>
          <th>ERC721 Contract</th>
          <th>tokenId</th>
          <th>tokenURI</th>
          <th>View</th>
        </thead>
        <tbody>
          {nfts && nfts.map((nft) =>
            <tr>
              <td>
                <a href={NETWORK.block_explorer_url + "address/" + nft.address} target="_blank">
                  {nft.address}
                </a>
              </td>
              <td>{nft.nft.tokenId}</td>
              <td>
                <a href={nft.nft.uri}>{nft.nft.uri}</a>
              </td>
              <td>
                <a href={"#/collection/" + nft.address + "/" + nft.nft.tokenId}>
                  <button>Go</button>
                </a>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
});