import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

export default function Wallet() {
  const { address } = useParams();

  return (
    <h1>Wallet Address: { address }</h1>
  )
}