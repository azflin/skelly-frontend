import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function BrowseForm() {
  const [wallet, setWallet] = useState("");
  const [contract, setContract] = useState("");
  const [tokenId, setTokenId] = useState("");

  return (
    <div>
      <form>
        <label>
          Search Wallet:
          <input type="text" value={wallet} onChange={e => setWallet(e.target.value)} />
        </label>
        <Link to={"/wallet/" + wallet}><button>Go</button></Link>
      </form>
      <form>
        <label>
          ERC721 Contract:
          <input type="text" value={contract} onChange={e => setContract(e.target.value)} />
        </label>
        <label>
          Token ID:
          <input type="text" value={tokenId} onChange={e => setTokenId(e.target.value)} />
        </label>
        <Link to={"/collection/" + contract +"/" + tokenId}><button>Go</button></Link>
      </form>
    </div>
  )
}