"use client";
import { useEffect, useState } from "react";
import { useAccount, useBalance, useWalletClient } from "wagmi";
import InputField from "@/components/ui/InputField"; 
import { sendUsdc } from "../lib/sendUsdc"; 
import { getSmartAccount } from "@/lib/getSmartAccount";
import { type UseWalletClientParameters } from 'wagmi'

export default function TransferForm() {
    const [recipient, setRecipient] = useState<string>("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false)
    const [smartAccount, setSmartAccount] = useState("" as `0x${string}`); 
    const [publicClient, setPublicClient] = useState(null);

    const { data: walletClient } = useWalletClient(); // 使用者連接的錢包
    const { address } = useAccount(); // 使用者的地址
    
    const usdcTokenAddress = process.env.NEXT_PUBLIC_USDC_ADDRESS;

    useEffect(() => {
        async function fetchSmartAccount() {
            // if (!walletClient) {
            //     console.error("Wallet client is not available");
            //     return;
            // }
            try {
                const { smartAccount } = await getSmartAccount(walletClient!);
                setSmartAccount(smartAccount);
            } catch (error) {                   
                console.error("Error fetching smart account:", error);
            }
        }
        fetchSmartAccount();
    }, [walletClient]); // 只要 walletClient 發生變化，就重新執行一次上面這整段

    const { data, isLoading, isError, refetch } = useBalance({
        address: smartAccount,
        token: usdcTokenAddress as `0x${string}`,
        query: {
            enabled: true,  // 可控式開關
        },
    });

    async function handleSubmit() {
        setLoading(true)
        // You can access the current state values here
        console.log("Recipient:", recipient);
        console.log("Amount:", amount);
        try{
            const txHash = await sendUsdc({
                account: smartAccount,
                recipient: recipient,
                amount: amount,
            });

            alert(`✅ Success!\nTransaction Hash:\n ${txHash}`);
            await refetch(); // 重新抓 balance
            setRecipient("");
            setAmount("");
        }
        catch (error) {
            console.error("Error during transfer:", error);
            alert("❌ Transfer failed. Please check the console for details.");
        }
        finally {
            setLoading(false)
        }
    }
    
    return (
        <div>
            <p >Smart Account Address: {smartAccount}</p>
            <p style={{ marginBottom: "1rem" }}>
                Smart Account Balance:{" "}
                {
                    isLoading ? "Loading..." :
                    isError ? "Error fetching balance" :
                    data ? `${data.formatted} ${data.symbol}` : "No data"
                }
            </p>
            <form onSubmit={(e) => {}}>
                <InputField
                    label="Recipient Address"
                    placeholder="0x..."
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                />
                <InputField
                    label="Amount to Send"
                    placeholder="0.0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
            </form>
            <div style={{ display: "inline-block", border: "1px solid #ccc", padding: "5px", borderRadius: "5px" }}>
                <button onClick={handleSubmit} disabled={loading} style={{ border: "none", background: "none", padding: "0", cursor: "pointer" }}>
                    { loading ? "Sending..." : "Send USDC"}
                </button>
            </div>
        </div>
    );
}