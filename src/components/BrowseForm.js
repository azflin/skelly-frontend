import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {BorderedDiv} from "./Token";

export default function BrowseForm() {
  const [wallet, setWallet] = useState("");
  const [contract, setContract] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [specificCollectionContract, setSpecificCollectionContract] = useState("");

  return (
    <BorderedDiv style={{flexDirection: "column", display: "inline-block"}}>
      <form style={{marginBottom: "10px"}}>
        <label>
          <div style={{fontSize: "18px", fontWeight: "650"}}>Search Wallet:</div>
          <input
            type="text"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
          />
        </label>
        <Link to={"/wallet/" + wallet}>
          <button style={{marginLeft: "10px"}}>Go</button>
        </Link>
      </form>
      <form>
        <div style={{fontSize: "18px", fontWeight: "650"}}>Search Specific NFT:</div>
        <label style={{marginRight: "15px"}}>
          ERC721 Contract:&nbsp;
          <input
            type="text"
            value={contract}
            onChange={(e) => setContract(e.target.value)}
          />
        </label>
        <label>
          Token ID:&nbsp;
          <input
            type="text"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
          />
        </label>
        <Link to={"/collection/" + contract + "/" + tokenId}>
          <button style={{marginLeft: "10px"}}>Go</button>
        </Link>
      </form>
      <form style={{marginTop: "10px"}}>
        <div style={{fontSize: "18px", fontWeight: "650"}}>Go to Collection:</div>
        <label style={{marginRight: "15px"}}>
          ERC721 Contract:&nbsp;
          <input
            type="text"
            value={specificCollectionContract}
            onChange={(e) => setSpecificCollectionContract(e.target.value)}
          />
        </label>
        <Link to={"/collection/" + specificCollectionContract}>
          <button style={{marginLeft: "10px"}}>Go</button>
        </Link>
      </form>
    </BorderedDiv>
  );
}
