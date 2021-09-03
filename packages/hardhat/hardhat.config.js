require("@nomiclabs/hardhat-waffle");
require("hardhat-deploy");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.6.11",
  paths: {
    artifacts: "../react-app/src/contracts/artifacts",
  },
  networks: {
    // add additional networks here
    hardhat: {
      chainId: 1337, // specific to how hardhat works
    },
  },
};
