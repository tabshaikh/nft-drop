import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useWallet, UseWalletProvider } from "use-wallet";

import "./index.css";

function App() {
  const wallet = useWallet();
  const blockNumber = wallet.getBlockNumber();

  return (
    <>
      <h1>Wallet</h1>
      {wallet.status === "connected" ? (
        <div>
          <div>Account: {wallet.account}</div>
          <div>Balance: {wallet.balance}</div>
          <button onClick={() => wallet.reset()}>disconnect</button>
        </div>
      ) : (
        <div>
          Connect:
          <button onClick={() => wallet.connect()}>MetaMask</button>
          <button onClick={() => wallet.connect("frame")}>Frame</button>
          <button onClick={() => wallet.connect("portis")}>Portis</button>
        </div>
      )}
    </>
  );
}

const Main = () => {
  const [address, setAddress] = useState("");

  const ethereum = window.ethereum;

  ethereum.on("accountsChanged", function (accounts) {
    setAddress(accounts[0]);
  });

  return (
    <div className="container">
      {ethereum && <p>Your connected ethereum address: {address}</p>}
      Hello World{" "}
    </div>
  );
};

ReactDOM.render(
  <UseWalletProvider
    chainId={1}
    connectors={{
      // This is how connectors get configured
      portis: { dAppId: "my-dapp-id-123-xyz" },
    }}
  >
    <App />
    <Main></Main>
  </UseWalletProvider>,
  document.getElementById("root")
);
