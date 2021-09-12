import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {BorderedDiv} from "./Token";

export default function CollectionForm({contract}) {
  const [tokenId, setTokenId] = useState("");

  return (
    <BorderedDiv style={{flexDirection: "column", display: "inline-block"}}>
      <form>
        <div style={{fontSize: "18px", fontWeight: "650"}}>Search NFT in collection:</div>
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
    </BorderedDiv>
  );
}
