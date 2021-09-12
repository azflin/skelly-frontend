import React, { useEffect, useState } from "react";
import BrowseForm from "./BrowseForm";
import {API_URL} from "../config";
import MarketplaceActivityTable from "./MarketplaceActivityTable";

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
        {collectionsData &&
          <MarketplaceActivityTable marketplaceActivity={collectionsData}></MarketplaceActivityTable>
        }
      </div>
    </div>
  );
}
