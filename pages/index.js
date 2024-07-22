import { useState, useEffect } from "react";
import { ethers } from "ethers";
import MySmartContractArtifact from "../artifacts/contracts/MySmartContract.sol/MySmartContract.json";

export default function Homepage() {

    const [meMessage, setMeMessage] = useState("Ethererum");
    const [defaultAccount, setDefaultAccount] = useState(undefined);
    const [balance, setBalance] = useState(undefined);
    const [ethWallet, setEthWallet] = useState(undefined);
    const [mySmartContract, setMySmartContract] = useState(undefined);
    const [redeemedAmount, setRedeemedAmount] = useState(0);
    
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your deployed contract address
    const contractABI = MySmartContractArtifact.abi;

    const getBalance = async () => {
        if (mySmartContract) {
            const balance = await mySmartContract.getBalance();
            setBalance(balance.toNumber());
        }
    }

    const deposit = async () => {
        if (mySmartContract) {
            const tx = await mySmartContract.deposit(1);
            await tx.wait();
            getBalance();
        }
    }

    const withdraw = async () => {
        if (mySmartContract) {
            const tx = await mySmartContract.withdraw(1);
            await tx.wait();
            getBalance();
        }
    }

    const getWallet = async () => {
        if (window.ethereum) {
            setEthWallet(window.ethereum);
        }

        if (ethWallet) {
            const accounts = await ethWallet.request({ method: "eth_accounts" });
            if (accounts.length > 0) {
                setDefaultAccount(accounts[0]);
            }
        }
    }

    const connectWalletHandler = async () => {
        try {
            if (!ethWallet) {
                alert("MetaMask Wallet is required to Connect");
                return;
            }

            const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
            setDefaultAccount(accounts[0]);
            getMySmartContract();
        } catch (error) {
            console.error("Error connecting wallet:", error);
        }
    }

    const getMySmartContract = async () => {
        const provider = new ethers.providers.Web3Provider(ethWallet);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        setMySmartContract(contract);
    }

    const redeem = async () => {
        try {
            if (mySmartContract) {
                const tx = await mySmartContract.redeem();
                await tx.wait();
                setRedeemedAmount(balance); // Set the redeemed amount to the current balance
                getBalance(); // Refresh the balance after redemption
            }
        } catch (error) {
            console.error("Error while redeeming:", error.message);
        }
    }

    const initUser = () => {
        if (!ethWallet) {
            return <p>Please Install the MetaMask extension in your Browser</p>;
        }

        if (!defaultAccount) {
            return <button onClick={connectWalletHandler}>Enable wallet for Ethereum contracts</button>;
        }

        getBalance();

        return (
            <div>
                <h3 style={{ fontSize: "24px", margin: "20px 0", color: "#FFFFFF" }}>Your Account : {defaultAccount}</h3>
                <p style={{ fontSize: "20px", color: "#FFFFFF" }}>Your Balance : {balance} ETH</p>
                <div style={{ margin: "20px 0" }}>
                    <button onClick={deposit} style={{ fontSize: "18px" }}>Commit 1 ETH</button>
                    <button onClick={withdraw} style={{ fontSize: "18px" }}>Retrieve 1 ETH</button>
                    <button onClick={redeem} style={{ fontSize: "18px" }}>Redeem</button>
                </div>
                <p style={{ fontSize: "20px", color: "#FFFFFF" }}>Redeemed Amount : {redeemedAmount} ETH</p>
            </div>
        );
    }

    useEffect(() => {
        getWallet();
    }, []);

    return (
        <main className="container">
            <header><h1 style={{ fontSize: "36px", color: "#FFFFFF" }}>Welcome</h1></header>
            <h2 style={{ fontSize: "28px", color: "#FFFFFF" }}>{meMessage}</h2>
            {initUser()}
            <style jsx>{`
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: Arial, sans-serif;
                }
                .container {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    width: 100vw;
                    height: 100vh;
                    background-color: #222222; /* Dark grey background */
                    text-align: center;
                    color: #FFFFFF;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
                }
                button {
                    background-color: #008CBA;
                    color: white;
                    border: none;
                    padding: 15px 32px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 16px;
                    margin: 10px;
                    cursor: pointer;
                    border-radius: 12px;
                }
                button:hover {
                    background-color: #005f73;
                }
            `}
            </style>
        </main>
    )
}
