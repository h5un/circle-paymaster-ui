import { createPublicClient, http, WalletClient } from "viem";
import { toCircleSmartAccount } from "@circle-fin/modular-wallets-core";
import { arbitrumSepolia } from "viem/chains";
import { useWalletClient } from "wagmi";
import { type UseWalletClientParameters } from "wagmi";

const chain = arbitrumSepolia;

/**
 * 產生使用者對應的 Circle Smart Account（Account Abstraction）
 * @param walletClient - 使用者連接的 EOA 簽名錢包
 */
export async function getSmartAccount(walletClient: any) {
  if (!walletClient) {
    throw new Error("walletClient is undefined (did user connect wallet?)");
  }
  console.log("Wallet Client:", walletClient);
  const publicClient = createPublicClient({ chain, transport: http() });

  const { account } = walletClient;
  const smartAccount = await toCircleSmartAccount({
    client: publicClient,
    owner: account,
  });
  console.log("Smart Account:", smartAccount);
  return { smartAccount, publicClient };
}
