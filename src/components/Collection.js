import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {ethers} from "ethers";
import collectionABI from "../abis/collectionABI";
import {NETWORK} from "../config";

export default function Collection({provider}) {
  const { contract } = useParams();
  const [nfts, setNfts] = useState();
  const [collectionName, setCollectionName] = useState();
  const [collectionActivity, setCollectionActivity] = useState();

  useEffect(() => {
    async function fetchCollection() {
      setNfts(null);

      let collectionContract = await new ethers.Contract(
        contract,
        collectionABI,
        provider
      );
      setCollectionName(await collectionContract.name());

      let response = await fetch(
        `https://api.paintswap.finance/nfts/${contract}?allowNSFW=true&numToFetch=150&numToSkip=0`
      );
      let data = await response.json();
      setNfts(data.nfts);

      response = await fetch(
        "https://protected-reaches-27044.herokuapp.com/collections/" + contract);
      data = await response.json();
      setCollectionActivity(data);
      console.log(data);
    }
    fetchCollection();
  }, [contract]);

  return (
    <div>
      <h1>
        {collectionName}&nbsp;
        <a href={NETWORK.block_explorer_url + "address/" + contract} target="_blank">
          {contract}
        </a>
      </h1>
      <div>
        <div style={{fontSize: "18px", fontWeight: 600}}>
          Marketplace Activity
        </div>
        {collectionActivity && collectionActivity.length
          ?
          <table style={{borderSpacing: "5px"}}>
            <thead>
            <tr>
              <th>Token Id</th>
              <th>Current Bid</th>
              <th>Buy Now Price</th>
              <th>Last Updated</th>
              <th>View</th>
            </tr>
            </thead>
            <tbody>
            {collectionActivity &&
            collectionActivity.map((nft) => (
              <tr key={nft._id}>
                <td>
                  {nft.tokenId}
                </td>
                <td>{nft.bidPrice}</td>
                <td>
                  {nft.offerPrice}
                </td>
                <td>
                  {nft.updatedAt}
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
          :
          <div>There is no current marketplace activity for this collection.</div>
        }
      </div>
      {/* The collection's NFTs (first 150) */}
      {nfts
        ?
        <div style={{marginTop: "15px"}}>
          <div style={{fontSize: "18px", fontWeight: 600}}>
            Collection's NFTs (up to 150)
          </div>
          <table>
            <thead>
            <tr>
              <th>tokenId</th>
              <th>tokenURI</th>
              <th>View</th>
            </tr>
            </thead>
            <tbody>
            {nfts.map((nft) => (
              <tr key={nft.id}>
                <td>{nft.tokenId}</td>
                <td>
                  <a href={nft.uri}>{nft.uri}</a>
                </td>
                <td>
                  <a href={"#/collection/" + nft.address + "/" + nft.tokenId}>
                    <button>Go</button>
                  </a>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
        :
        <div style={{display: "flex", alignItems: "center", flexDirection: "column"}}>
          <div style={{fontSize: "18px", fontWeight: 600}}>Loading collection...</div>
          <div className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      }
    </div>
  );
}
