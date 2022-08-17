import { ethers } from "hardhat";

const main = async () => {
  const FundMyProjectFactory = await ethers.getContractFactory("FundMyProjectFactory");
  const fundMyProjectFactory = await FundMyProjectFactory.deploy();

  await fundMyProjectFactory.deployed();

  console.log("FundMyProject deployed to:", fundMyProjectFactory.address);
};

const runMain = async() => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error)
    process.exit(1);
  }
}

runMain();