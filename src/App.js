import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractABI from "./util/ContractABI.json";

const contractAddress = "0x24Bc51411448ac9ec9211bf3dC6b4c8A1462F9ff";

function App() {
  const [account, setAccount] = useState(null);
  const [greeting, setGreeting] = useState("");
  const [inputValue, setInputValue] = useState("");

  const connectMetamask = async () => {
    try {
      // Requesting access to the user's MetaMask account
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Retrieving the current account from MetaMask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const currentAccount = await signer.getAddress();
      console.log(currentAccount);

      // Setting the account value in state
      setAccount(currentAccount);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getInitialGreeting = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        const initialGreeting = await contract.greet();
        setGreeting(initialGreeting);
      } catch (error) {
        console.error(error);
      }
    };
    getInitialGreeting();
  }, []);

  const getGreeting = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const response = await contract.greet();
      setGreeting(response);
    } catch (error) {
      console.error(error);
    }
  };

  const setNewGreeting = async (newGreeting) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      await contract.setGreeting(newGreeting);
      setGreeting(newGreeting);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {account === null ? (
        <button onClick={connectMetamask}>Connect Metamask</button>
      ) : (
        <div>
          <p>Account: {account}</p>
          <button onClick={getGreeting}>Get Greeting</button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button onClick={() => setNewGreeting(inputValue)}>Set Greeting</button>
        </div>
      )}
      <p>Greeting: {greeting}</p>
    </div>
  );
}

export default App;
