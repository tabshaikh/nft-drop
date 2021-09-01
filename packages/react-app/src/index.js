import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";

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
  <React.StrictMode>
    <Main></Main>
  </React.StrictMode>,
  document.getElementById("root")
);
