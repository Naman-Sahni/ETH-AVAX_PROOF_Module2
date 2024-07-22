const hre = require("hardhat");

async function main() {
    const initBalance = 1; // Initial balance to deploy contract with
    const MySmartContract = await hre.ethers.getContractFactory("MySmartContract");
    const myContract = await MySmartContract.deploy(initBalance);
    await myContract.deployed();

    myContract.displayAddress();

    console.log(`A contract with balance of ${initBalance} ETH deployed to ${myContract.address}`);

    myContract.on("ShowAddress", (walletAddress) => {
        console.log(`Wallet address: ${walletAddress}`);
    });

    myContract.on("DepositEvent", (depositValue, balance) => {
        console.log(`New deposit: ${depositValue} ETH, new balance: ${balance} ETH`);
    });

    myContract.on("WithdrawEvent", (withdrawValue, balance) => {
        console.log(`New withdrawal: ${withdrawValue} ETH, new balance: ${balance} ETH`);
    });

    myContract.on("RedeemEvent", (amount) => {
        console.log(`Redeemed amount: ${amount} ETH`);
    });

    // Call the "redeem" function
    await myContract.redeem();
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
