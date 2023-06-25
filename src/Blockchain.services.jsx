import Web3 from "web3";
import { setGlobalState, getGlobalState } from "./store";
import abi from "./abis/DominionDAO.json";

const { ethereum } = window;
window.web3 = new Web3(ethereum);
window.web3 = new Web3(window.web3.currentProvider);
const toWei = num => window.web3.utils.toWei(num.toString(), "ether");
const fromWei = num => window.web3.utils.fromWei(num.toString(), "ether");

const connectWallet = async () => {
  try {
    if (!ethereum) return alert("Please install MetaMask");
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    setGlobalState("connectedAccount", accounts[0].toLowerCase());
  } catch (error) {
    reportError(error);
  }
};

const isWalletConnected = async () => {
  try {
    if (!ethereum) return alert("Please install MetaMask");
    const accounts = await ethereum.request({ method: "eth_accounts" });

    window.ethereum.on("chainChanged", chainId => {
      window.location.reload();
    });

    window.ethereum.on("accountsChanged", async () => {
      setGlobalState("connectedAccount", accounts[0].toLowerCase());
      await isWalletConnected();
    });

    if (accounts.length) {
      setGlobalState("connectedAccount", accounts[0].toLowerCase());
    } else {
      alert("Please connect your wallet");
      console.log("no accounts found");
    }
  } catch (error) {
    reportError(error);
  }
};

const getEthereumContract = async () => {
  const connectedAccount = getGlobalState("connectedAccount");

  if (connectedAccount) {
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const networkData = await abi.networks[networkId];
    if (networkData) {
      const contract = new web3.eth.Contract(abi.abi, networkData.address);
      return contract;
    } else {
      return null;
    }
  } else {
    return getGlobalState("contract");
  }
};

const performContribute = async amount => {
  try {
    const contract = await getEthereumContract();
    const account = getGlobalState("connectedAccount");

    await contract.methods
      .contribute()
      .send({ from: account, value: toWei(amount) });

    await getInfo();
  } catch (error) {
    reportError(error);
    return error;
  }
};

const getInfo = async () => {
  try {
    if (!ethereum) return alert("Please install MetaMask");

    const contract = await getEthereumContract();
    const connectedAccount = getGlobalState("connectedAccount");
    const isStakeholder = await contract.methods
      .isStakeholder()
      .call({ from: connectedAccount });
    const balance = await contract.methods.daoBalance().call();
    const mybalance = await contract.methods
      .getBalance()
      .call({ from: connectedAccount });
    setGlobalState("balance", fromWei(balance));
    setGlobalState("mybalance", fromWei(mybalance));
    setGlobalState("isStakeholder", isStakeholder);
  } catch (error) {
    reportError(error);
  }
};

const reportError = error => {
  console.log(JSON.stringify(error));
  throw new Error(`Error: ${error.message}`);
};

export { connectWallet, isWalletConnected, performContribute, getInfo };
