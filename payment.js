// Import ethers.js and WalletConnect
import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.esm.min.js';
import { EthereumProvider } from 'https://esm.sh/@walletconnect/ethereum-provider@2.8.0';

// WalletConnect Project ID
const projectId = "0aace5c9d8a1f556dd726deba318fbfc";

// Get DOM elements
const connectButton = document.getElementById("connectWallet");
const statusText = document.getElementById("status");
const amountInput = document.getElementById("amount");
const payButton = document.getElementById("pay");
const cryptoSelect = document.getElementById("crypto");
const walletIDText = document.getElementById("walletID"); // Display wallet address

// Wallet connection variables
let provider;
let signer;
let walletAddress;

// USDT ERC-20 Contract Address & ABI (Mainnet)
const USDT_CONTRACT = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // Tether USDT Contract
const USDT_ABI = [
    "function transfer(address to, uint amount) public returns (bool)"
];

// BTC Address (Replace with your BTC wallet)
const BTC_ADDRESS = "YourBTCWalletHere";

// Function to connect wallet (MetaMask or WalletConnect)
async function connectWallet() {
    if (window.ethereum) {
        try {
            provider = new ethers.BrowserProvider(window.ethereum);
            signer = await provider.getSigner();
            const accounts = await provider.send("eth_requestAccounts", []);
            walletAddress = accounts[0]; // Get first account

            statusText.innerText = `Connected ✅`;
            walletIDText.innerText = `Wallet: ${walletAddress}`;
            connectButton.disabled = true;
            payButton.disabled = false;
        } catch (error) {
            console.error("MetaMask connection failed:", error);
            statusText.innerText = "MetaMask Connection failed! ❌";
        }
    } else {
        try {
            provider = await EthereumProvider.init({
                projectId: projectId,
                chains: [1], // Mainnet
                showQrModal: true
            });

            await provider.enable();
            signer = new ethers.BrowserProvider(provider).getSigner();
            walletAddress = (await signer.getAddress()).toLowerCase();

            statusText.innerText = `Connected ✅`;
            walletIDText.innerText = `Wallet: ${walletAddress}`;
            connectButton.disabled = true;
            payButton.disabled = false;
        } catch (error) {
            console.error("WalletConnect failed:", error);
            statusText.innerText = "WalletConnect failed! ❌";
        }
    }
}

// Function to send ETH payment
async function sendETHPayment(recipient, amount) {
    try {
        const tx = await signer.sendTransaction({
            to: recipient,
            value: ethers.parseEther(amount)
        });

        alert(`ETH Transaction Sent ✅\nTX Hash: ${tx.hash}`);
        console.log("Transaction Details:", tx);
    } catch (error) {
        console.error("ETH Transaction failed:", error);
        alert("ETH Transaction failed ❌.");
    }
}

// Function to send USDT payment (ERC-20)
async function sendUSDT(recipient, amount) {
    try {
        const contract = new ethers.Contract(USDT_CONTRACT, USDT_ABI, signer);
        const tx = await contract.transfer(recipient, ethers.parseUnits(amount, 6)); // USDT uses 6 decimals

        alert(`USDT Transaction Sent ✅\nTX Hash: ${tx.hash}`);
        console.log("Transaction Details:", tx);
    } catch (error) {
        console.error("USDT Transaction failed:", error);
        alert("USDT Transaction failed ❌.");
    }
}

// Function to handle BTC Payment
function showBTCDetails(amount) {
    alert(`Send ${amount} BTC to this address: ${BTC_ADDRESS}`);
}

// Function to send selected crypto payment
async function sendPayment() {
    if (!signer) {
        alert("Wallet not connected.");
        return;
    }

    const amount = amountInput.value;
    const selectedCrypto = cryptoSelect.value;
    const recipientAddress = "0xYourRecipientAddressHere"; // Replace with actual recipient wallet

    if (!amount || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    if (selectedCrypto === "ETH") {
        await sendETHPayment(recipientAddress, amount);
    } else if (selectedCrypto === "USDT") {
        await sendUSDT(recipientAddress, amount);
    } else if (selectedCrypto === "BTC") {
        showBTCDetails(amount);
    }
}

function sendMessage() {
    var phoneNumber = "+15722426128";
    var message = "Hello, I would like to make a transfer payment";
    var isApple = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isApple) {
        window.location.href = "sms:" + phoneNumber + "&body=" + encodeURIComponent(message);
    } else {
        window.location.href = "sms:" + phoneNumber + "?body=" + encodeURIComponent(message);
    }
}


// Event listeners
connectButton.addEventListener("click", connectWallet);
payButton.addEventListener("click", sendPayment);

