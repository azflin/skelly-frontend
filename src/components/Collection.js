import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Collection() {
  const { contract } = useParams();
  const [nfts, setNfts] = useState();

  useEffect(() => {
    async function fetchCollection() {
      console.log("Collection useEffect");
      const response = await fetch(
        `https://api.paintswap.finance/nfts/${contract}?allowNSFW=true&numToFetch=150&numToSkip=0`
      );
      const data = await response.json();
      setNfts(data.nfts);
    }
    fetchCollection();
  }, [contract]);

  return (
    <div>
      <h1>
        Collection{" "}
        {contract.slice(0, 6) +
          "..." +
          contract.slice(contract.length - 4, contract.length)}
        's NFTs
      </h1>
      <table>
        <thead>
          <tr>
            <th>tokenId</th>
            <th>tokenURI</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {nfts &&
            nfts.map((nft) => (
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
  );
}
