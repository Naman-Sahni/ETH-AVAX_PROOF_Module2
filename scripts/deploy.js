const { ethers } = require("hardhat");

async function main() {
  // Get the contract factory for EventManagementSystem
  const EventManagementSystem = await ethers.getContractFactory("EventManagementSystem");

  // Deploy the contract
  const eventManagementSystem = await EventManagementSystem.deploy();  
  await eventManagementSystem.deployed();  // Wait for the deployment to be mined

  // Output the deployed contract address
  console.log(`EventManagementSystem deployed to: ${eventManagementSystem.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
