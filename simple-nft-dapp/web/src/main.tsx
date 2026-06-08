import React from "react";
import ReactDOM from "react-dom/client";
import { ccc } from "@ckb-ccc/connector-react";
import { App } from "./App";
import { createTestnetClient, DEFAULT_RPC_URL } from "./ckb";
import "./styles.css";

const client = createTestnetClient(DEFAULT_RPC_URL);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ccc.Provider
      name="Simple NFT Minter"
      defaultClient={client}
      clientOptions={[{ name: "CKB Testnet", client }]}
      preferredNetworks={[
        {
          addressPrefix: "ckt",
          signerType: ccc.SignerType.CKB,
          network: "testnet",
        },
      ]}
    >
      <App />
    </ccc.Provider>
  </React.StrictMode>,
);
