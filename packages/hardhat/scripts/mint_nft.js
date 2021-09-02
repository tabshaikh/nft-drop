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
    "0x4c5859f0F772848b2D91F1D83E2Fe57935348029" // The deployed contract address
  );

  console.log(
    "------------------- MINTING -------------------------------------"
  );

  // Returning the owner of the contract
  const OWNER = await nft.owner();

  console.log("Owner of Contract: ", OWNER);
  console.log("Minting for Account: ", accounts[1].address);
  const tokenId = await nft.tokenCounter();
  const tokenIdString = tokenId.toString();

  //   console.log(nft);
  await nft.connect(accounts[1]).mintItem(
    "QmQD9mHT3Xja1Yajufo1b7uDTHHFLicZNhgF1HS1UxfY8k",
    { from: accounts[1].address } // the path of the json uri which is uploaded to ipfs we use _setBaseURI("https://ipfs.io/ipfs/"); there not the complete path needed
  );

  console.log(
    "Minted NFT for account: ",
    accounts[1].address,
    "with token id:",
    tokenIdString
  );

  console.log(
    "--------------------------------------------------------------------------"
  );

  console.log(
    "------------------- PAUSING -------------------------------------"
  );

  await nft.pause({ from: OWNER });

  console.log("Trying Minting ...");

  await nft
    .connect(accounts[1])
    .mintItem(
      "QmQD9mHT3Xja1Yajufo1b7uDTHHFLicZNhgF1HS1UxfY8k",
      { from: accounts[1].address } // the path of the json uri which is uploaded to ipfs we use _setBaseURI("https://ipfs.io/ipfs/"); there not the complete path needed
    )
    .catch((error) => {
      console.error(error);
    });

  await nft.unpause({ from: OWNER });

  console.log(
    "------------------------ UNPAUSING Mint Function ------------------------------------"
  );

  console.log(
    "------------------- Blacklisting Account ",
    accounts[1].address,
    " -------------------------------------"
  );

  await nft.blacklist(accounts[1].address);

  console.log("Trying to mint nft to account:", accounts[1].address);

  await nft
    .connect(accounts[1])
    .mintItem(
      "QmQD9mHT3Xja1Yajufo1b7uDTHHFLicZNhgF1HS1UxfY8k",
      { from: accounts[1].address } // the path of the json uri which is uploaded to ipfs we use _setBaseURI("https://ipfs.io/ipfs/"); there not the complete path needed
    )
    .catch((error) => {
      console.error(error);
    });

  console.log(
    "--------------------------------------------------------------------------"
  );

  console.log(
    "------------------- Removing Blacklisted Account ",
    accounts[1].address,
    " -------------------------------------"
  );

  await nft.removeFromblacklist(accounts[1].address);

  console.log("Trying to mint nft to account:", accounts[1].address);

  const tokenId1 = await nft.tokenCounter();
  const tokenIdString1 = tokenId1.toString();

  //   console.log(nft);
  await nft
    .connect(accounts[1])
    .mintItem("QmQD9mHT3Xja1Yajufo1b7uDTHHFLicZNhgF1HS1UxfY8k", {
      from: accounts[1].address,
    });

  console.log(
    "Minted NFT for account: ",
    accounts[1].address,
    "with token id:",
    tokenIdString1
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
