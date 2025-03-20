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
const walletIDText = document.getElementById("walletID"); // Display wallet address

// Wallet connection variables
let provider;
let signer;
let walletAddress;

// Function to connect wallet (MetaMask or WalletConnect)
async function connectWallet() {
    if (window.ethereum) {
        try {
            // Connect with MetaMask
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
        // If MetaMask is not available, use WalletConnect
        try {
            provider = await EthereumProvider.init({
                projectId: projectId, // Use your WalletConnect Project ID
                chains: [1], // Mainnet
                showQrModal: true // Show QR code for mobile connection
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
async function sendPayment() {
    if (!signer) {
        alert("Wallet not connected.");
        return;
    }

    const amount = amountInput.value;
    if (!amount || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    const recipientAddress = "0xYourRecipientAddressHere"; // Replace with actual recipient wallet

    try {
        const tx = await signer.sendTransaction({
            to: recipientAddress,
            value: ethers.parseEther(amount)
        });

        alert(`Transaction sent! ✅\nTX Hash: ${tx.hash}`);
        console.log("Transaction Details:", tx);
    } catch (error) {
        console.error("Transaction failed:", error);
        alert("Transaction failed ❌. Check the console for details.");
    }
}

// Event listeners
connectButton.addEventListener("click", connectWallet);
payButton.addEventListener("click", sendPayment);
