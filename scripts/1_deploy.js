async function main() {
  const Token = await ethers.getContractFactory("Token")
  const token = await Token.deploy('Dapp University', 'DAPP', '1000000');
  await token.deployed();
  console.log(`Contract deployed at ${token.address}`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
