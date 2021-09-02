// We could use the pinata gateway/ ipfs one
// ipfs path of the json: https://ipfs.io/ipfs/QmQD9mHT3Xja1Yajufo1b7uDTHHFLicZNhgF1HS1UxfY8k
// ipfs path of the image: https://ipfs.io/ipfs/QmVG2BtW4YoDMkrhys4SwD1qm6RtN7sAQXT64vgbUXVb7

// tabish@tabish:~/degen/nft-drop$ yarn hardhat deploy-nft
// yarn run v1.22.10
// $ yarn workspace hardhat deploy-nft
// $ hardhat run scripts/deploy_nft.js --network localhost
// Deploying the contracts with the account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
// Account balance: 9999999561630250000000
// Nft address: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
// Done in 2.63s.

async function main() {
  const accounts = await ethers.getSigners();

  const Nft = await ethers.getContractFactory("Nft");
  const nft = await Nft.attach(
    "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0" // The deployed contract address
  );

  // console.log(nft);

  // Returning the owner of the contract
  const OWNER = await nft.owner();

  console.log("Owner of Contract: ", OWNER);
  console.log("Minting for Account: ", accounts[1].address);
  const tokenId = await nft.tokenCounter();
  const tokenIdString = tokenId.toString();

  //   console.log(nft);
  await nft.mintItem(
    accounts[1].address,
    "QmQD9mHT3Xja1Yajufo1b7uDTHHFLicZNhgF1HS1UxfY8k",
    { from: OWNER } // the path of the json uri which is uploaded to ipfs we use _setBaseURI("https://ipfs.io/ipfs/"); there not the complete path needed
  );

  console.log(
    "Minted NFT for account: ",
    accounts[1].address,
    "with token id:",
    tokenIdString
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
