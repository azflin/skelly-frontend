import React from 'react';
import styled from 'styled-components'

const StatusDiv = styled.div`
  position: fixed;
  bottom: 50px;
  right: 20px;
  border: 2px solid white;
  border-radius: 10px;
  font-size: 24px;
  padding: 10px;
  background-color: ${props =>
    props.type === "processing"
    || props.type === "success" ? "rgba(38, 122, 59, 0.8)" : "rgba(255, 0, 0, 0.7)"};
  max-width: 300px;
`

export function Status({type, messageJSX, url, txHash, closeable, setTxStatus}) {
  return (
    <StatusDiv type={type}>
      {messageJSX}
      {url && <div><a href={url} target="_blank">{txHash.slice(0, 6) + "..." + txHash.slice(62)} ↗️</a></div>}
      {closeable && <button onClick={() => setTxStatus("")} style={{position: "absolute", right: "5px", top: "5px"}}>&#10006;</button>}
    </StatusDiv>
  )
}