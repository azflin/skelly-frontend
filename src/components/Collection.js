import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {ethers} from "ethers";
import collectionABI from "../abis/collectionABI";
import {NETWORK, API_URL} from "../config";
import MarketplaceActivityTable from "./MarketplaceActivityTable";
import CollectionForm from "./CollectionForm";

export default function Collection({provider}) {
  const { contract } = useParams();
  const [nfts, setNfts] = useState();
  const [collectionName, setCollectionName] = useState();
  const [collectionActivity, setCollectionActivity] = useState();

  useEffect(() => {
    async function fetchCollection() {
      setNfts(null);
      setCollectionActivity(null);

      let collectionContract = await new ethers.Contract(
        contract,
        collectionABI,
        provider
      );
      setCollectionName(await collectionContract.name());

      let response = await fetch(API_URL + "collections/" + contract);
      let data = await response.json();
      setCollectionActivity(data);

      response = await fetch(
        `https://api.paintswap.finance/nfts/${contract}?allowNSFW=true&numToFetch=150&numToSkip=0`
      );
      data = await response.json();
      setNfts(data.nfts);
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
      <CollectionForm contract={contract}></CollectionForm>
      <div>
        {collectionActivity ?
          <MarketplaceActivityTable marketplaceActivity={collectionActivity}></MarketplaceActivityTable>
          :
          <div>
            <div>Loading marketplace activity...</div>
            <div className="lds-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
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
