import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function BrowseForm() {
  const [wallet, setWallet] = useState("");

  return (
    <div>
      <form>
        <label>
          Search Wallet:
          <input type="text" value={wallet} onChange={e => setWallet(e.target.value)} />
        </label>
        <Link to={"/wallet/" + wallet}><button>Go</button></Link>
      </form>
    </div>
  )
}