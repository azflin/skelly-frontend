import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NETWORK, API_URL } from "../config";

export default function Wallet() {
  const { address } = useParams();
  const [nfts, setNfts] = useState();
  const [nftsWithActivity, setNftsWithActivity] = useState();

  useEffect(() => {
    async function fetchWallet() {
      console.log("Wallet useEffect");
      let response = await fetch(
        `https://api.paintswap.finance/userNFTs/${address}?allowNSFW=true&numToFetch=150&numToSkip=0`
      );
      let data = await response.json();
      setNfts(data.nfts);
      response = await fetch(API_URL + "wallet/" + address);
      data = await response.json();
      console.log(data);
      setNftsWithActivity(data);
    }
    fetchWallet();
  }, [address]);

  return (
    <div>
      <h1>
        {address.slice(0, 6) +
          "..." +
          address.slice(address.length - 4, address.length)}
        's NFTs
      </h1>
      <div>
        <div style={{fontWeight: "600", fontSize: "18px", marginBottom: "10px"}}>
          NFTs with Marketplace Activity
        </div>
        <table style={{borderSpacing: "5px"}}>
          <thead>
          <tr>
            <th>ERC721 Contract</th>
            <th>Token Id</th>
            <th>Current Bid</th>
            <th>Buy Now Price</th>
            <th>View</th>
          </tr>
          </thead>
          <tbody>
          {nftsWithActivity &&
          nftsWithActivity.map((nft) => (
            <tr key={nft._id}>
              <td>
                <a
                  href={NETWORK.block_explorer_url + "address/" + nft.address}
                  target="_blank"
                >
                  {nft.contractAddress}
                </a>
              </td>
              <td>{nft.tokenId}</td>
              <td>
                {nft.bidPrice}
              </td>
              <td>
                {nft.offerPrice}
              </td>
              <td>
                <a
                  href={"#/collection/" + nft.contractAddress + "/" + nft.tokenId}
                >
                  <button>Go</button>
                </a>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
      <div style={{fontWeight: "600", fontSize: "18px", marginBottom: "10px", marginTop: "10px"}}>
        All Wallet's NFTs
      </div>
      <table style={{borderSpacing: "5px"}}>
        <thead>
          <tr>
            <th>ERC721 Contract</th>
            <th>tokenId</th>
            <th>tokenURI</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {nfts &&
            nfts.map((nft) => (
              <tr key={nft.id}>
                <td>
                  <a
                    href={NETWORK.block_explorer_url + "address/" + nft.address}
                    target="_blank"
                  >
                    {nft.address}
                  </a>
                </td>
                <td>{nft.nft.tokenId}</td>
                <td>
                  <a href={nft.nft.uri}>{nft.nft.uri}</a>
                </td>
                <td>
                  <a
                    href={"#/collection/" + nft.address + "/" + nft.nft.tokenId}
                  >
                    <button>Go</button>
                  </a>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
