import { NextRequest, NextResponse } from 'next/server';
import 'dotenv/config'
import { createPublicClient, http, getContract } from 'viem'
import { arbitrumSepolia } from 'viem/chains'
import { toCircleSmartAccount } from '@circle-fin/modular-wallets-core'
import { erc20Abi } from 'viem'
import { signPermit } from "@/lib/permit.js" // A signed EIP-2612 permit
import { encodePacked } from 'viem'
import { createBundlerClient } from 'viem/account-abstraction'
import { hexToBigInt } from 'viem'

function toUSDCUnits(amountStr) {
  const parts = amountStr.split(".")
  const integer = parts[0] || "0"
  const decimal = (parts[1] || "").padEnd(6, "0").slice(0, 6)
  return BigInt(integer + decimal)
} 

/**
 * 發送 USDC 的交易，透過 Circle Smart Account 與 Paymaster 完成 gasless 操作
 * User has to connect their wallet and input the recipient address and amount.
 * @param {object} params - 參數
 * @param {`0x${string}`} params.account - Circle Smart Account 物件
 * @param {string} params.recipient - 接收者地址
 * @param {string} params.amount - 使用者輸入的金額字串（例如 "1.5"）
 * @returns {Promise<string>} - 成功後回傳交易哈希值 (transaction hash)
 */
export async function sendUsdc({ account, recipient, amount }) {
    const chain = arbitrumSepolia
    const usdcAddress = process.env.NEXT_PUBLIC_USDC_ADDRESS

    const client = createPublicClient({ chain, transport: http() })
    // const account = await toCircleSmartAccount({ client: client, owner: walletClient })

    // Check the USDC balance
    const usdc = getContract({ client, address: usdcAddress, abi: erc20Abi })
    const usdcBalance = await usdc.read.balanceOf([account.address])

    // if (usdcBalance < 1000000) {
    //   return Response.json({
    //     error: `Insufficient USDC balance: ${usdcBalance.toString()}`,
    //   }, { status: 400 })
    // }
    
    // Use the Circle permit
    const paymasterAddress = process.env.NEXT_PUBLIC_PAYMASTER_V07_ADDRESS
    const paymaster = {
        async getPaymasterData(parameters) {
          const permitAmount = 10_000_000n
          const permitSignature = await signPermit({
            tokenAddress: usdcAddress,
            account,
            client,
            spenderAddress: paymasterAddress,
            permitAmount: permitAmount,
          })
      
          const paymasterData = encodePacked(
            ['uint8', 'address', 'uint256', 'bytes'],
            [0, usdcAddress, permitAmount, permitSignature],
          )
      
          return {
            paymaster: paymasterAddress,
            paymasterData,
            paymasterVerificationGasLimit: 200_000n,
            paymasterPostOpGasLimit: 15_000n,
            isFinal: true,
          }
        },
    }

    // Set up the bundler client to send the AA userOperation
    const bundlerClient = createBundlerClient({
      account,
      client,
      paymaster,
      userOperation: {
        estimateFeesPerGas: async ({ account, bundlerClient, userOperation }) => {
          const { standard: fees } = await bundlerClient.request({
            method: 'pimlico_getUserOperationGasPrice',
          })
          const maxFeePerGas = hexToBigInt(fees.maxFeePerGas)
          const maxPriorityFeePerGas = hexToBigInt(fees.maxPriorityFeePerGas)
          return { maxFeePerGas, maxPriorityFeePerGas }
        },
      },
      transport: http(`https://public.pimlico.io/v2/${client.chain.id}/rpc`),
    })   

    // Submit a user operation to transfer USDC
    const hash = await bundlerClient.sendUserOperation({
      account,
      calls: [
        {
          to: usdc.address,
          abi: usdc.abi,
          functionName: 'transfer',
          args: [recipient, toUSDCUnits(amount)],
        },
      ],
    })
    console.log('UserOperation hash', hash)
    
    const receipt = await bundlerClient.waitForUserOperationReceipt({ hash })
    const txHash = receipt.receipt.transactionHash
    console.log('Transaction hash', txHash)
    
    return txHash;
}