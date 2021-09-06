# Nft Drop
A Dapp to send your friends Nft as a gift. Its simple as uploading an image and minting an Nft 🚀

Site: https://nft-drop.netlify.app/

Currently works on rinkeby testnet.

Contracts deployed at Rinkeby Testnet: 0x033b6cf9421C4203208709c25108A19a9BF49DFB

### How to use:
- Jump onto the site https://nft-drop.netlify.app/
- Change your network to rinkeby testnet
- Add rinkeby testnet eth using rinkeby faucet https://faucet.rinkeby.io/
- Fill in the address, set name, description for your nft, upload the image and boom then click on `mint nft` button (in the background your image file would be automatically uploaded to ipfs and a metadata for your nft would be created and uploaded to ipfs).
- In a few seconds your Nft would be minted and sent to the address 🎉

### How to setup the repository:
```
git clone https://github.com/tabshaikh/nft-drop.git
cd nft-drop
yarn install

To run frontend:
yarn start

To run chain:
yarn chain

Deploy contracts:
yarn deploy

Test contracts:
yarn test

```
