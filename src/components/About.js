import React, { useEffect, useState } from "react";
import {NETWORK, MARKETPLACE_CONTRACT} from "../config";

export default function About() {

  return (
    <div>
      <h1>About</h1>
      <div>
        <p>
          Skelly is a bare bones NFT marketplace on Fantom. Trade ERC721s using FTM &
          WFTM (for bidding). Unlike OpenSea, Skelly does not use signatures and all
          offers and bids are simply stored on the blockchain in a smart contract. Only
          one bid can exist on an NFT at a time. Skelly does not take custody of any FTM or
          NFTs, and the transfer occurs upon transaction execution. Skelly takes a 1% fee off
          all transactions.
        </p>
        <p>
          The API used to retrieve NFTs in wallets and to retrieve NFTs of a collection
          are provided by <a href='https://paintswap.finance/' target="_blank">PaintSwap</a>. Only
          some collections are indexed by PaintSwap, and going to a collection that isn't will
          yield no data in the "Collection's NFT" table.
        </p>
        <p><b>Smart Contract</b>: <a href={NETWORK.block_explorer_url + "address/" + MARKETPLACE_CONTRACT} target="_blank">{MARKETPLACE_CONTRACT}</a></p>
        <p>
          A MongoDB instance is used to track all offers and bids of the smart contract. Is it possible
          that this backend falls out of sync or goes down temporarily, which will cause "Marketplace Activity"
          tables to be incorrect. However, the actual NFT detail pages (where you can buy and sell)
          will always show correct info  as they use the metamask RPC to query the blockchain for
          real time data.
        </p>
      </div>
    </div>
  );
}
