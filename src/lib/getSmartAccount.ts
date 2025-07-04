import { createPublicClient, http, WalletClient } from "viem";
// import { toCircleSmartAccount } from "@circle-fin/modular-wallets-core";
import { arbitrumSepolia } from "viem/chains";
import { toEcdsaKernelSmartAccount } from 'permissionless/accounts' 
// 改用 permissionless 的 toEcdsaKernelSmartAccount() 幫忙自動處理 injected EOA

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
  const client = createPublicClient({
    chain: chain,
    transport: http()
  })
  // const publicClient = createPublicClient({ chain, transport: http() });
  
  const smartAccount = await toEcdsaKernelSmartAccount({
    client,
    owners: [window.ethereum!],
    version: '0.3.1'
  })
  console.log("Smart Account is ...")
  console.log(smartAccount)
  // const { account } = walletClient; // get the param for `toCircleSmartAccount`
  // console.log("Wallet Client account :", account);
  // const smartAccount = await toCircleSmartAccount({
  //   client: publicClient,
  //   owner: account, // walletClient.account 不是一個真正有 `signMessage` 方法的 `Account` 物件
  // });
  // console.log("Smart Account:", smartAccount);
  return { smartAccount };
}
