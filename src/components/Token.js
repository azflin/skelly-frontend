import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import collectionABI from '../abis/collectionABI';
import marketplaceABI from '../abis/marketplaceABI';
import wethABI from "../abis/wethABI";
import { NETWORK, MARKETPLACE_CONTRACT, WETH_CONTRACT } from "../config";
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
  const [signerAddress, setSignerAddress] = useState();
  const [salePriceInput, setSalePriceInput] = useState("");
  const [marketplaceContract, setMarketplaceContract] = useState();
  const [txHash, setTxHash] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [txStatus, setTxStatus] = useState();
  const [bid, setBid] = useState();
  const [offer, setOffer] = useState();
  const [userApprovedNftTransfer, setUserApprovedNftTransfer] = useState();
  const [userApprovedWeth, setUserApprovedWeth] = useState();

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
      if (signer) {
        let address = await signer.getAddress();
        setSignerAddress(address);
        let isApproved = await contract.isApprovedForAll(address, MARKETPLACE_CONTRACT);
        setUserApprovedNftTransfer(isApproved);
      }

      // Fetch token URI data
      let uri = await contract.tokenURI(tokenId);
      let response = await fetch(uri);
      if (response.ok) {
        let data = await response.json();
        setMetadata(data);
      } else {
        console.log('HTTP-Error: ' + response.status);
      }
      // refreshBidAsk();
    }
    fetchAPI();
  }, [collectionAddress, tokenId]);

  // get marketplace contract and connect with signer (if signer). Get NFT contract
  // and check if signer is approved. Set bid and offer.
  useEffect(() => {
    async function fetchMarketplaceContract() {
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
      if (signer) {
        contract = contract.connect(signer);
        let signerAddress = await signer.getAddress();
        let nftContract = await new ethers.Contract(
          collectionAddress,
          collectionABI,
          provider
        );
        let isApproved = await nftContract.isApprovedForAll(signerAddress, MARKETPLACE_CONTRACT);
        setUserApprovedNftTransfer(isApproved);
      }
      setMarketplaceContract(contract);
      setSalePriceInput("");
    }
    fetchMarketplaceContract();
  }, [signer, collectionAddress, tokenId]);

  // Check if user approved WETH for marketplace contract
  useEffect(() => {
    async function checkApprovedWeth() {
      if (signer) {
        let wethContract = await new ethers.Contract(
          WETH_CONTRACT,
          wethABI,
          signer
        )
        let allowance = await wethContract.allowance(
          await signer.getAddress(),
          MARKETPLACE_CONTRACT
        );
        console.log("allowance weth", allowance);
        if (allowance > 0) {
          setUserApprovedWeth(true);
        }
      }
    }
    checkApprovedWeth();
  }, [signer])

  // List your NFT for sale
  const listNFT = async () => {
    let txResponse;
    try {
      txResponse = await marketplaceContract.makeOffer(
        collectionAddress,
        tokenId,
        ethers.utils.parseEther(salePriceInput)
      );
    } catch (error) {
      setTxStatus("error");
      setErrorMessage(
        (error.data && error.data.message)
          ? error.message + " " + error.data.message
          : error.message);
      return;
    }
    setTxHash(txResponse.hash);
    setTxStatus("processing");
    try {
      await txResponse.wait();
      setTxStatus("success");
      await refreshBidAsk();
    } catch (error) {
      console.log("ERROR", error);
      setErrorMessage(
        (error.data && error.data.message)
          ? error.message + " " + error.data.message
          : error.message);
      setTxStatus("error")
      return;
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

  // Delist your NFT's offer
  const delist = async () => {
    let txResponse;
    try {
      txResponse = await marketplaceContract.removeOffer(collectionAddress, tokenId);
    } catch (error) {
      setTxStatus("error");
      setErrorMessage(
        (error.data && error.data.message)
          ? error.message + " " + error.data.message
          : error.message);
      return;
    }
    setTxHash(txResponse.hash);
    setTxStatus("processing");
    try {
      await txResponse.wait();
      setTxStatus("success");
      await refreshBidAsk();
    } catch (error) {
      console.log("ERROR", error);
      setErrorMessage(
        (error.data && error.data.message)
          ? error.message + " " + error.data.message
          : error.message);
      setTxStatus("error")
      return;
    }
  }

  // Buy now
  const buyNow = async () => {
    if (!signer) {
      alert("Connect to Metamask!");
    } else {
      let txResponse;
      let offerInWei = ethers.utils.parseEther(offer.price.toString()).toString();
      try {
        txResponse = await marketplaceContract.takeOffer(
          collectionAddress,
          tokenId,
          {
            value: offerInWei
          }
        );
      } catch (error) {
        setTxStatus("error");
        setErrorMessage(
          (error.data && error.data.message)
            ? error.message + " " + error.data.message
            : error.message);
        return;
      }
      setTxHash(txResponse.hash);
      setTxStatus("processing");
      try {
        await txResponse.wait();
        setTxStatus("success");
        await refreshBidAsk();
        setOwner(await signer.getAddress());
      } catch (error) {
        console.log("ERROR", error);
        setErrorMessage(
          (error.data && error.data.message)
            ? error.message + " " + error.data.message
            : error.message);
        setTxStatus("error")
        return;
      }
    }
  }

  // Approve your NFT for sale
  const approveForSale = async () => {
    if (signer) {
      let nftContract = await new ethers.Contract(
        collectionAddress,
        collectionABI,
        signer
      );
      let txResponse;
      try {
        txResponse = await nftContract.setApprovalForAll(MARKETPLACE_CONTRACT, true);
      } catch (error) {
        setTxStatus("error");
        setErrorMessage(
          (error.data && error.data.message)
            ? error.message + " " + error.data.message
            : error.message);
        return;
      }
      setTxHash(txResponse.hash);
      setTxStatus("processing");
      try {
        await txResponse.wait();
        setTxStatus("success");
        setUserApprovedNftTransfer(true);
      } catch (error) {
        console.log("ERROR", error);
        setErrorMessage(
          (error.data && error.data.message)
            ? error.message + " " + error.data.message
            : error.message);
        setTxStatus("error")
        return;
      }
    } else {
      alert("Connect to metamask!");
    }
  }

  // Approve weth
  const approveWeth = async () => {
    if (signer) {
      let wethContract = await new ethers.Contract(
        WETH_CONTRACT,
        wethABI,
        signer
      );
      let txResponse;
      try {
        txResponse = await wethContract.approve(MARKETPLACE_CONTRACT, ethers.constants.MaxUint256);
      } catch (error) {
        setTxStatus("error");
        setErrorMessage(
          (error.data && error.data.message)
            ? error.message + " " + error.data.message
            : error.message);
        return;
      }
      setTxHash(txResponse.hash);
      setTxStatus("processing");
      try {
        await txResponse.wait();
        setTxStatus("success");
        setUserApprovedWeth(true)
      } catch (error) {
        console.log("ERROR", error);
        setErrorMessage(
          (error.data && error.data.message)
            ? error.message + " " + error.data.message
            : error.message);
        setTxStatus("error")
        return;
      }
    } else {
      alert("Connect to Metamask!");
    }
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
          {signerAddress === owner ?
            userApprovedNftTransfer ?
              <div style={{display: "flex"}}>
                <input
                  type="number"
                  value={salePriceInput}
                  onChange={e => setSalePriceInput(e.target.value)} />
                <button onClick={listNFT}>List for Sale</button>
                <div><button onClick={delist}>Delist</button></div>
              </div>
              : <button onClick={approveForSale}>Approve For Sale</button>
              : <div>
                {(offer && offer.price) ?
                  <button onClick={buyNow}>Buy Now</button> : ""
                }
                {/* Approve WETH if not approved, else Bid button */}
                <div>
                  {
                    !userApprovedWeth
                      ? <button onClick={approveWeth}>
                          Approve Weth before you can bid
                        </button>
                      : <div>
                        <input type="number" />
                        <button>Bid</button>
                      </div>
                  }
                </div>
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
