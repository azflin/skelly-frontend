import React, { useEffect, useState } from "react";
import BrowseForm from "./BrowseForm";
import {API_URL} from "../config";
import { Link } from "react-router-dom";

export default function Browse() {

  const [collectionsData, setCollectionsData] = useState([]);

  useEffect(() => {
    async function fetchAPI() {
      console.log("fetching API");
      let response = await fetch(API_URL + "collections");
      if (response.ok) {
        let data = await response.json();
        setCollectionsData(data);
      } else {
        console.log("HTTP ERROR: ", response.status);
      }
    }
    fetchAPI();
  }, []);

  return (
    <div>
      <h1>Browse</h1>
      <BrowseForm></BrowseForm>
      <div>
        <div style={{fontSize: "18px", fontWeight: "600", marginBottom: "15px"}}>
          Recent Activity
        </div>
        <table style={{borderSpacing: "5px"}}>
          <thead>
            <tr>
              <th>ERC721 Contract</th>
              <th>Token ID</th>
              <th>Bid</th>
              <th>Offer</th>
              <th>Updated At</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
          {collectionsData.length && collectionsData.map((x) =>
            <tr key={x._id}>
              <td>{x.contractAddress}</td>
              <td>{x.tokenId}</td>
              <td>{x.bidPrice}</td>
              <td>{x.offerPrice}</td>
              <td>{x.updatedAt}</td>
              <td>
                <Link to={`/collection/${x.contractAddress}/${x.tokenId}`}>
                  <button>Go</button>
                </Link>
              </td>
            </tr>
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
