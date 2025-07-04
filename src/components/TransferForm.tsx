"use client";
import { useEffect, useState } from "react";
import { useAccount, useBalance, useWalletClient } from "wagmi";
import InputField from "@/components/ui/InputField"; 
import { sendUsdc } from "../lib/sendUsdc"; 
import { getSmartAccount } from "@/lib/getSmartAccount";

export default function TransferForm() {
    const usdcTokenAddress = process.env.NEXT_PUBLIC_USDC_ADDRESS;
    const [recipient, setRecipient] = useState<string>("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false)
    const [smartAccount, setSmartAccount] = useState<any>(null); 

    const { data: walletClient } = useWalletClient(); // 使用者連接的錢包, a hook provided by wagmi
    
    // 只要「使用者連上錢包」後，就立即建立對應的 Smart Account 並記下來
    useEffect(() => {
        async function fetchSmartAccount() {
            if (!walletClient) return; // 保護機制：只有在有錢包時才跑下面的 async
            
            try {
                const { smartAccount } = await getSmartAccount(walletClient!);
                setSmartAccount(smartAccount);
            } catch (error) {                   
                console.error("Error fetching smart account:", error);
            }
        }
        fetchSmartAccount();
    }, [walletClient]); // 只要 walletClient 發生變化，就重新執行一次上面這整段
    
    const { data, isLoading, isError, refetch /* Hook 回傳*/ } = useBalance({
        address: smartAccount?.address,
        token: usdcTokenAddress as `0x${string}`,
        query: {
            enabled: !!smartAccount,  // 確保只有在 smartAccount 存在時才執行
        },
    });
    

    async function handleSubmit() {
        setLoading(true)
        // You can access the current state values here
        console.log("Recipient:", recipient);
        console.log("Amount:", amount);
        try{
            if (!walletClient) {
                alert("Wallet not connected");
                return;
            }
            const txHash = await sendUsdc({
                account: smartAccount, // data type must be the return value of `toCircleSmartAccount`
                walletClient: walletClient!, // 使用者連接的錢包
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
            const errMsg = (error as Error).message;
            alert(`❌ Transfer failed: ${errMsg || "Unknown error"}`);
        }
        finally {
            setLoading(false)
        }
    }
    
    return (
        <div>
            <p >Smart Account Address: {smartAccount?.address}</p>
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