"use client";

import TransferForm from "./TransferForm"
import { useAccount } from "wagmi";

export function HomeContent() {
  const { isConnected } = useAccount();
  return (
    <div style={{ padding: "2rem" }}>
      {isConnected ? (
        <div>
          <TransferForm />
        </div>
      ) : (
        <div>
          <h2>Please connect a wallet ...</h2>
        </div>
      )}
    </div>
  );
}
