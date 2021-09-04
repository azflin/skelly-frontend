import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

export default function Token() {
  const { collectionAddress, tokenId } = useParams();

  return (
    <h1>Token { collectionAddress } { tokenId }</h1>
  )
}