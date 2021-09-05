import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";

import { create } from "ipfs-http-client";
import parse from "html-react-parser";

import {
  Form,
  FloatingLabel,
  Container,
  Button,
  Navbar,
} from "react-bootstrap";

import Nft from "./contracts/artifacts/contracts/Nft.sol/Nft.json";
import nftcontractAddress from "./contracts/contract-address.json";

const contractAddress = nftcontractAddress.Nft;

const providerOptions = {};

const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions,
});

const client = create("https://ipfs.infura.io:5001/api/v0");

function App() {
  const [message, setMessage] = useState("");
  const [mintAddress, setMintAddress] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [indicator, setIndicator] = useState("Loading...");

  const [injectedProvider, setInjectedProvider] = useState();
  const [buttonStatus, setButtonStatus] = useState("Connect");
  const [signedUser, setSignedUser] = useState();
  const [signerAddress, setSignerAddress] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);

  async function getsAddress(signer) {
    const address = await signer.getAddress();
    setSignerAddress(address);
  }

  async function requestProvider() {
    console.log("connecting");
    try {
      const provider = await web3Modal.connect();
      const ip = new ethers.providers.Web3Provider(provider);
      const signer = ip.getSigner();
      setInjectedProvider(ip);
      setSignedUser(signer);
      setSignerAddress(await signer.getAddress());
      setButtonStatus("Disconnect");
      console.log(provider);

      // Subscribe to accounts change
      provider.on("accountsChanged", () => {
        console.log(`account changed!`);
        const ip = new ethers.providers.Web3Provider(provider);
        setInjectedProvider(ip);
        const signer = ip.getSigner();
        setInjectedProvider(ip);
        setSignedUser(signer);
        getsAddress(signer);
      });
    } catch (e) {
      console.log(e);
      if (e) {
        setMessage(e.message);
      }
      return;
    }
  }

  async function disconnectProvider() {
    console.log("disconnecting");
    await web3Modal.clearCachedProvider();
    setInjectedProvider();
    setSignedUser();
    setSignerAddress("");
    setButtonStatus("Connect");
  }

  async function handleFileUpload() {
    try {
      const added = await client.add(selectedFile);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      const json = {
        name: name,
        description: description,
        image_url: url,
      };
      const uploaded_json = await client.add(JSON.stringify(json));
      console.log(url);
      console.log(uploaded_json);
      return [url, uploaded_json];
    } catch (error) {
      console.log("Error uploading file: ", error);
      return [];
    }
  }

  async function mintNft() {
    setLoading(true);
    setIndicator("Loading...");
    if (!ethers.utils.isAddress(mintAddress)) {
      setMessage("Invalid Address");
      setMintAddress("");
      setLoading(false);
      return;
    }
    if (typeof window.ethereum !== "undefined") {
      if (name === "") {
        setMessage("Name required");
        setLoading(false);
        return;
      }

      if (description === "") {
        setMessage("Description required");
        setLoading(false);
        return;
      }

      if (!isFilePicked) {
        setMessage("File input required");
        setLoading(false);
        return;
      }

      setIndicator("Uploading Files...");
      const output = await handleFileUpload();

      if (output.length === 0) {
        setMessage("File Uploading Failed");
        setLoading(false);
        return;
      }

      const [image_url, json_url] = output;

      setIndicator("Minting Nft...");

      const contract = new ethers.Contract(
        contractAddress,
        Nft.abi,
        signedUser
      );

      const tokenId = await contract.tokenCounter();
      const tokenIdString = tokenId.toString();

      try {
        const transaction = await contract.mintItemToAdress(
          mintAddress,
          json_url.path
        );
        await transaction.wait();
        console.log(transaction);
      } catch (e) {
        console.log(e);
        if (e.data) {
          setMessage(e.data.message);
        } else if (e.value) {
          setMessage(e.value.data.message);
        }
        setMintAddress("");
        setLoading(false);
        setSelectedFile();
        setIsFilePicked(false);
        setName("");
        setDescription("");
        return;
      }

      setMessage(
        "Uploaded JSON at <a target='_blank' href='https://ipfs.io/ipfs/" +
          json_url.path +
          "' > Link </a>. Minted Nft to address: " +
          mintAddress +
          " with token Id " +
          tokenIdString
      );

      setMintAddress("");
      setLoading(false);
      setSelectedFile(null);
      setIsFilePicked(true);
      setName("");
      setDescription("");
    } else {
      setMessage("Please Install Metamask Wallet");
      setLoading(false);
      return;
    }
  }

  useEffect(() => {
    requestProvider();
  }, []);

  // For file upload ...
  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  };

  return (
    <>
      {/* Header ---------------------------------------------------------------- */}
      <Navbar fixed="top" bg="light">
        <Container>
          <Navbar.Brand href="#">🎨 NFT Drop</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              {injectedProvider ? (
                <div>
                  <span style={{ marginRight: "10px" }}>
                    <strong>Signed in as:</strong> {signerAddress}
                  </span>
                  <Button
                    variant="outline-primary"
                    onClick={disconnectProvider}
                  >
                    {buttonStatus}
                  </Button>
                </div>
              ) : (
                <Button variant="outline-primary" onClick={requestProvider}>
                  {buttonStatus}
                </Button>
              )}
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* ------------------------------------------------------------------------ */}

      <div class="hero-text">
        <h2>Send your friend's an NFT 🚀</h2>
      </div>

      <div className="app-container">
        <Container className="mint">
          <Form>
            <Form.Group className="mb-3" controlId="formGroupAddress">
              <FloatingLabel controlId="floatingInput" label="Address">
                <Form.Control
                  type="textarea"
                  onChange={(e) => setMintAddress(e.target.value)}
                  disabled={isLoading}
                  placeholder="Set Address"
                  value={mintAddress}
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupName">
              <FloatingLabel controlId="floatingInput" label="Name">
                <Form.Control
                  type="textarea"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name your Nft"
                  value={name}
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupDescription">
              <FloatingLabel controlId="floatingInput" label="Description">
                <Form.Control
                  type="textarea"
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter Description for your Nft"
                  value={description}
                />
              </FloatingLabel>
            </Form.Group>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Control onChange={changeHandler} type="file" />
            </Form.Group>
            <Button
              variant="primary"
              disabled={isLoading || buttonStatus === "Connect"}
              onClick={!isLoading ? mintNft : null}
            >
              {isLoading ? indicator : "Mint Nft"}
            </Button>
            <p>{parse(message)}</p>
          </Form>
        </Container>
      </div>
    </>
  );
}

export default App;
