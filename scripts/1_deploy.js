const hre = require("hardhat");

async function main() {
  const Token = await ethers.getContractFactory("Token")
  const token = await Token.deploy();
  await token.deployed();
  console.log(`Contract deployed at ${token.address}`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
