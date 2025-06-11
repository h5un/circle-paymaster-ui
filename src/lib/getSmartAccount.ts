import { createPublicClient, http, WalletClient } from "viem";
import { toCircleSmartAccount } from "@circle-fin/modular-wallets-core";
import { arbitrumSepolia } from "viem/chains";

const chain = arbitrumSepolia;

/**
 * Generates a Circle Smart Account (Account Abstraction) for the user.
 * @param walletClient - The externally owned account (EOA) wallet connected by the user.
 * @returns An object containing the Circle Smart Account and the public client.
 * @throws An error if the walletClient is undefined.
 */
export async function getSmartAccount(walletClient: any) {
  if (!walletClient) {
    throw new Error("walletClient is undefined ");
  }
  const publicClient = createPublicClient({ chain, transport: http() });
  
  const { account } = walletClient; // get the param for `toCircleSmartAccount`
  // console.log("Wallet Client account :", account);
  const smartAccount = await toCircleSmartAccount({
    client: publicClient,
    owner: account,
  });
  // console.log("Smart Account:", smartAccount);
  return { smartAccount, publicClient };
}
