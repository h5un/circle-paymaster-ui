"use client";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { anvil, arbitrumSepolia } from "wagmi/chains";

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!walletConnectProjectId) {
    throw new Error("Error: NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not defined. Please set it in your .env.local file");
}

let config: ReturnType<typeof getDefaultConfig>;
// 防止在 SSR 過程中觸發 WalletConnect 初始化
if (typeof window !== "undefined") {
    config = getDefaultConfig({
        appName: "circle-paymaster", // Your dApp's name, shown in wallet prompts
        projectId: walletConnectProjectId, // WalletConnect Cloud Project ID
        chains: [anvil, arbitrumSepolia], // Array of chains your dApp supports
        ssr: false, // Set to false for static sites or if not heavily using SSR with wagmi
    });
}
export default config!;