// A signed EIP-2612 permit which is used to set the paymaster's allowance 
// without submitting a separate transaction.

import { maxUint256, erc20Abi, parseErc6492Signature, getContract } from 'viem'

// Adapted from https://github.com/vacekj/wagmi-permit/blob/main/src/permit.ts
export async function eip2612Permit({
  token,
  chain,
  ownerAddress,
  spenderAddress,
  value,
}) {
  return {
    types: {
      Permit: [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
      ],
    },
    primaryType: 'Permit',
    domain: {
      name: await token.read.name(),
      version: await token.read.version(),
      chainId: chain.id,
      verifyingContract: token.address,
    },
    message: {
      owner: ownerAddress,
      spender: spenderAddress,
      value,
      nonce: await token.read.nonces([ownerAddress]),
      // The paymaster cannot access block.timestamp due to 4337 opcode
      // restrictions, so the deadline must be MAX_UINT256.
      deadline: maxUint256,
    },
  }
}

export const eip2612Abi = [
  ...erc20Abi,
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    name: 'nonces',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
  },
  {
    inputs: [],
    name: 'version',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
]

// 使用 EOA 的 walletClient 來簽署 permit 的主要函式
export async function signPermit({
  tokenAddress,
  client,
  walletClient,
  spenderAddress,
  permitAmount,
}) {
  const token = getContract({
    client,
    address: tokenAddress,
    abi: eip2612Abi,
  })

  const address = walletClient.account.address;

  const permitData = await eip2612Permit({
    token,
    chain: client.chain,
    ownerAddress: address,
    spenderAddress,
    value: permitAmount,
  })

  // 使用 walletClient 彈出視窗請使用者進行簽名
  const signature = await walletClient.signTypedData({
    account: address,
    domain: permitData.domain,
    types: permitData.types,
    primaryType: permitData.primaryType,
    message: permitData.message,
  });

  const isValid = await client.verifyTypedData({
    ...permitData,
    address: address,
    signature: signature,
  })

  if (!isValid) {
    throw new Error(
      `Invalid permit signature for ${address}: ${signature}`,
    )
  }

  // 解析簽名，移除 ERC-6492 包裝格式，取出原始 signature bytes
  const { signature: stripped } = parseErc6492Signature(signature)
  return stripped // 回傳可直接用於 paymasterData 的原始簽名
}
