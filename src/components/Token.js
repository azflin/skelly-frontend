import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import collectionABI from '../abis/collectionABI';
import marketplaceABI from '../abis/marketplaceABI';
import { NETWORK, MARKETPLACE_CONTRACT } from "../config";
import {Status} from "./Status";
import styled from "styled-components";

const Dots = styled.span`
  &::after {
    display: inline-block;
    animation: ellipsis 1.25s infinite;
    content: ".";
    width: 1em;
    text-align: left;
  }
  @keyframes ellipsis {
    0% {
      content: ".";
    }
    33% {
      content: "..";
    }
    66% {
      content: "...";
    }
  }
`

export default function Token({ provider, signer }) {
  const { collectionAddress, tokenId } = useParams();

  const [metadata, setMetadata] = useState();
  const [name, setName] = useState();
  const [owner, setOwner] = useState();
  const [isOwner, setIsOwner] = useState();
  const [salePrice, setSalePrice] = useState("");
  const [marketplaceContract, setMarketplaceContract] = useState();
  const [txHash, setTxHash] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [txStatus, setTxStatus] = useState();
  const [bid, setBid] = useState();
  const [offer, setOffer] = useState();

  // Fetch ERC721 contract details and tokenURI json when collectionAddress or tokenID
  // change
  useEffect(() => {
    async function fetchAPI() {
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
      console.log("URI", uri);
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

  // get marketplace contract and connect with signer
  useEffect(() => {
    async function fetchMarketplaceContract() {
      if (signer) {
        console.log("Marketplace contract");
        console.log(MARKETPLACE_CONTRACT);
        console.log(marketplaceABI);
        let contract = await new ethers.Contract(
          MARKETPLACE_CONTRACT,
          marketplaceABI,
          provider
        );
        let offer = await contract.offers(collectionAddress, tokenId);
        setOffer({
          price: parseFloat(ethers.utils.formatEther(offer.price)),
          seller: offer.seller});
        let bid = await contract.bids(collectionAddress, tokenId);
        setBid({
          price: parseFloat(ethers.utils.formatEther(bid.price)),
          bidder: bid.bidder});
        setMarketplaceContract(contract.connect(signer));
      }
    }
    fetchMarketplaceContract();
  }, [signer]);

  const listNFT = async () => {
    let txResponse;
    try {
      txResponse = await marketplaceContract.makeOffer(
        collectionAddress,
        tokenId,
        ethers.utils.parseEther(salePrice)
      );
    } catch (error) {
      console.log("ERROR: ", error);
      setTxStatus("error");
      setErrorMessage(error.message);
      return;
    }
    setTxHash(txResponse.hash);
    setTxStatus("processing");
    let txReceipt;
    try {
      txReceipt = await txResponse.wait();
      setTxStatus("success");
      await refreshBidAsk();
    } catch (error) {
      console.log("ERROR", error);
      setErrorMessage(error.message);
      setTxStatus("error")
      return;
    }
    if (txReceipt.status === 1) {
      console.log("txReceipt", txReceipt);
    } else {
      console.log("Transaction receipt somehow has non 1 status.");
    }
  }

  const refreshBidAsk = async () => {
    let offer = await marketplaceContract.offers(collectionAddress, tokenId);
    let bid = await marketplaceContract.bids(collectionAddress, tokenId);
    setOffer({
      price: parseFloat(ethers.utils.formatEther(offer.price)),
      seller: offer.seller});
    setBid({
      price: parseFloat(ethers.utils.formatEther(bid.price)),
      bidder: bid.bidder});
  }

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
          {/* List for sale if owner */}
          {isOwner &&
            <div style={{display: "flex"}}>
              <input type="number" value={salePrice} onChange={e => setSalePrice(e.target.value)} />
              <button onClick={listNFT}>List for Sale</button>
            </div>
          }
          {/* Current bid and offer information */}
          {offer && offer.price ?
            <div>{offer.seller} selling for : {offer.price} {NETWORK.currency}</div>
            : <div>Not Listed for Sale</div>
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
      {txStatus === "processing" &&
      <Status
        type="processing"
        url={NETWORK.block_explorer_url + "tx/" + txHash}
        txHash={txHash}
        messageJSX={<div>Processing Transaction<Dots></Dots></div>}>
      </Status>
      }
      {txStatus === "error" &&
      <Status
        type="error"
        messageJSX={<div>{errorMessage}</div>}
        closeable={true}
        setTxStatus={setTxStatus}>
      </Status>
      }
      {txStatus === "success" &&
      <Status
        type="success"
        url={NETWORK.block_explorer_url + "tx/" + txHash}
        txHash={txHash}
        messageJSX={<div>Success!</div>}
        closeable={true}
        setTxStatus={setTxStatus}
      >
      </Status>
      }
    </div>
  );
}
