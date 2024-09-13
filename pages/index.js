import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/namanAssessment.sol/namanAssessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [Accountholder, setOwnerName] = useState("Naman");
  const [transactionCount, setTransactionCount] = useState(null); // Store transaction count
  const [networkID, setNetworkID] = useState(null); // Initialize networkID state
  const [recipientAddress, setRecipientAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  const contractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts && accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account is found like this");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("**-- Connect your Metamask wallet by clicking here --**");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet, "any");
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async (walletaddress) => {
    if (atm) {
      alert(walletaddress);
      setBalance((await atm.getBalanceFromWalletAddress(walletaddress)).toNumber());
    }
  };

  const deposit = async () => {
    if (!ethWallet || !atm) {
      alert("Please connect to MetaMask first.");
      return;
    }

    try {
      const tx = await atm.depositAmount(4, { gasLimit: 3e7 });
      await tx.wait(); // Wait for the transaction to be mined
      alert("Deposit successful!");
      getBalance(account);
    } catch (error) {
      console.error("Error depositing:", error);
      alert("Deposit failed. Please try again.");
    }
  };

  const withdraw = async () => {
    if (!ethWallet || !atm) {
      alert("Please connect to MetaMask first.");
      return;
    }

    try {
      const tx = await atm.withdrawAmount(1, { gasLimit: 3e7 });
      await tx.wait(); // Wait for the transaction to be mined
      alert("Withdrawal successful!");
      getBalance(account);
    } catch (error) {
      console.error("Error withdrawing:", error);
      alert("Withdrawal failed. Please try again.");
    }
  };

  const checkOwnerName = async () => {
    if (atm) {
      let ownerName = await atm.Acountholder();
      setOwnerName(ownerName);
    }
  };

  const viewTransactionCount = async () => {
    if (!ethWallet || !account) {
      alert("Please connect to MetaMask first");
      return;
    }

    try {
      // Update dummy state to trigger a transaction confirmation
      const tx = await atm.updateDummyState(); 
      await tx.wait(); // Wait for the transaction to be mined

      // After transaction confirmation, get the updated transaction count
      const txCount = await atm.getTransactionCount(account);
      setTransactionCount(txCount.toNumber()); // Store the transaction count
      alert("Transaction count fetched successfully.");
    } catch (error) {
      console.error("Error viewing transaction count:", error);
      alert("Failed to retrieve transaction count.");
    }
  };

  const transferFunds = async (toAddress, amount) => {
    if (!ethWallet || !account) {
      alert("Wallet not connected");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(ethWallet);  //Creates a new Web3 provider using an existing Ethereum wallet.
      const signer = provider.getSigner();  //Retrieves the signer (account) to authorize transactions from the provider.
      const tx = await signer.sendTransaction({ //Sends the transaction to address, with ether
        to: toAddress,
        value: ethers.utils.parseEther(amount),
      });
      await tx.wait();
      console.log("Transaction confirmed:", tx);
      alert("Transfer successful!");
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transfer failed!");
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>You need to install Metamask in order to use this ATM.</p>;
    }

    if (!account) {
      return (
        <button onClick={connectAccount}>
          Connect your Metamask wallet
        </button>
      );
    }

    if (balance === undefined) {
      getBalance(account);
    }

    return (
      <div className="overlay">
        <p>Your Balance: {balance}</p>
        <p>Your Account: {account}</p>
        <p style={{ fontFamily: "Sans-serif" }}>Account holder: {Accountholder}</p>
        <button onClick={deposit}>Deposit 4 ETH</button>
        <button onClick={withdraw}>Withdraw 1 ETH</button>
        <button onClick={() => getBalance(prompt("Wallet Address: "))}>
          Check Others Balance
        </button>
        <h2>Transfer funds</h2>
      
      <div className="flex items-center justify-center mt-8">
        <div className="grid grid-cols-2 gap-6 max-w-[500px]">
          <input
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            placeholder="Recipient address"
            className="px-4 py-3 bg-gray-100 rounded-lg shadow-md focus:outline-none"
          />
          <input
            type="number"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
            placeholder="Enter transfer amount (ETH)"
            className="px-4 py-3 bg-gray-100 rounded-lg shadow-md focus:outline-none"
          />
        </div>
      </div>
      <div className="flex items-center justify-center mt-4">
      <button
            className="bg-black text-white px-6 py-3 rounded-lg shadow-md focus:outline-none"
            onClick={() => transferFunds(recipientAddress, transferAmount)}
          >
            Transfer Funds
      </button>
        <h2>Transaction Count</h2>
        <p>Your transaction count: {transactionCount !== null ? transactionCount : "N/A"}</p>
        <button onClick={viewTransactionCount}>Get Transaction Count</button>
      </div>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>WELCOME NAMAN ATM </h1>
        <p>SELECT YOUR SERVICE "24/7 Available"</p>
        <p>OPTION BELOW :</p>
      </header>

      {initUser()}
      <style jsx>
        {`
          .container {
            text-align: center;
            background-color: black;
            background-size: cover;
            color: olive green;
            font-family: "Times New Roman", serif;
            border: 10px solid black;
            border-radius: 20px;
            background-image: url("https://i.pinimg.com/736x/7e/3e/45/7e3e45df377741765257f432219a166e.jpg");
            height: 850px;
            width: 1500px;
            opacity: 0.9 ;
            font-weight: 1000;
          }

          header {
            padding: 10px;
          }

          h1 {
            font-family: "Arial", serif;
            font-size: 60px;
            margin-bottom: 20px;
          }

          p {
            font-size: 24px;
          }

          button {
            background-color: #4caf50;
            color: white;
            border: none;
            padding: 10px 30px;
            font-size: 20px;
            cursor: pointer;
          }

          button:hover {
            cursor: pointer;
          }

          ul {
            list-style-type: none;
            padding: 0;
          }

          li {
            font-size: 18px;
            margin: 10px 0;
          }
        `}
      </style>
    </main>
  );
}
