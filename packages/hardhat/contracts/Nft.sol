//SPDX-License-Identifier: Unlicense
pragma solidity >=0.6.0 <0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Nft is ERC721, Ownable {
    uint256 public tokenCounter;

    constructor() public ERC721("Alien World", "AW") {
        _setBaseURI("https://ipfs.io/ipfs/");
        tokenCounter = 0;
    }

    function mintItem(address to, string memory tokenURI)
        public
        onlyOwner
        returns (uint256)
    {
        tokenCounter = tokenCounter + 1;

        uint256 id = tokenCounter;
        _mint(to, id);
        _setTokenURI(id, tokenURI);

        return id;
    }
}
