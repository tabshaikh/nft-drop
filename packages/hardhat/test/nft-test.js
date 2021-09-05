const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Nft.sol", function () {
  let Nft;
  let nft;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Nft = await ethers.getContractFactory("Nft");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call Nft.deploy() and await
    // for it to be deployed(), which happens once its transaction has been
    // mined.
    nft = await Nft.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await nft.owner()).to.equal(owner.address);
    });

    it("Should set token counter to 1", async function () {
      expect(await nft.tokenCounter()).to.equal(1);
    });
  });

  describe("Minting to an address", function () {
    it("Should increment token counter", async function () {
      let beforeTokenCounter = parseInt(await nft.tokenCounter());
      let id = await nft.mintItemToAdress(
        addr1.address,
        "QmQD9mHT3Xja1Yajufo1b7uDTHHFLicZNhgF1HS1UxfY8k"
      );
      expect(await nft.tokenCounter()).to.equal(beforeTokenCounter + 1);
    });

    it("Should check the owner of nft is same as the passed address", async function () {
      let beforeTokenCounter = parseInt(await nft.tokenCounter());

      let id = await nft.mintItemToAdress(
        addr1.address,
        "QmQD9mHT3Xja1Yajufo1b7uDTHHFLicZNhgF1HS1UxfY8k"
      );
      expect(await nft.ownerOf(beforeTokenCounter)).to.equal(addr1.address);
    });
  });

  describe("When paused", function () {
    it("Minting should fail", async function () {
      await nft.pause({ from: owner.address });
      await expect(
        nft.mintItemToAdress(
          addr1.address,
          "QmQD9mHT3Xja1Yajufo1b7uDTHHFLicZNhgF1HS1UxfY8k"
        )
      ).to.be.reverted;
    });
  });

  describe("When address is blacklisted", function () {
    it("Minting should fail", async function () {
      await nft.blacklist(addr1.address, { from: owner.address });
      await expect(
        nft.mintItemToAdress(
          addr1.address,
          "QmQD9mHT3Xja1Yajufo1b7uDTHHFLicZNhgF1HS1UxfY8k"
        )
      ).to.be.reverted;
    });
  });
});
