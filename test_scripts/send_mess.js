const fs = require('fs');
const { ethers, BigNumber } = require('ethers');
const IPAssetRegistrarOApp = require('../artifacts/contracts/IPAssetRegistrarOApp.sol/IPAssetRegistrarOApp.json');

const { Options } = require('@layerzerolabs/lz-v2-utilities');

async function main(networkName = 'bsctestnet') {
    // Create options for lzSend() function
    const GAS_LIMIT = 1000000; // Gas limit for the executor
    const MSG_VALUE = 0; // msg.value for the lzReceive() function on destination in wei
    const _options = Options.newOptions().addExecutorLzReceiveOption(GAS_LIMIT, MSG_VALUE);

    var RPC_URL = '';
    var iPAssetRegistrarOAppAddress = "";
    var targetDstEid = 0;
    var mintData = "";
    var targetOptions = _options.toHex();

    // Setup the parameters based on the network
    if (networkName == 'bsctestnet') {
        RPC_URL = "https://data-seed-prebsc-1-s1.bnbchain.org:8545";

        iPAssetRegistrarOAppAddress = "0xAE5E080fB3b880a047c4347F6f51bCa84F4f6a3b";
        targetDstEid = 40161;   // This should be the EID of sepolia testnet

        // The collectionAddress should be the address of the collection contract on sepolia testnet
        mintData = {
            collectionAddress: "0x8381dE6C4DCa920381fe7626B6c823810B7e1B99",
            to: "0xD02c8cebc86Bd8Cc5fE876b4B793256C0d67a887",
            uri: "ipfs://bafybeienl44uwy37aiuukqehrfdj5lbtjbebkpsgosg47zpb7tmcrqavnm/1.json",
        };
        const abiCoder = new ethers.utils.AbiCoder();
        console.log('mintData:', abiCoder.encode(
            ["tuple(address, address, string)"],
            [["0x8381dE6C4DCa920381fe7626B6c823810B7e1B99", "0xD02c8cebc86Bd8Cc5fE876b4B793256C0d67a887", "ipfs://bafybeienl44uwy37aiuukqehrfdj5lbtjbebkpsgosg47zpb7tmcrqavnm/1.json"]]
        ));
    } else if (networkName == 'sepolia') {
        RPC_URL = "https://rpc-sepolia.rockx.com";

        iPAssetRegistrarOAppAddress = "0x7316e5511784EA3A2735c0Fe8a99324231E49030";
        targetDstEid = 40102;   // This should be the EID of bsctestnet

        // The collectionAddress should be the address of the collection contract on bsctestnet
        mintData = {
            collectionAddress: "0xa5eE5654b582857F26BeaaD82f1E69eC5591Bd86",
            to: "0xD02c8cebc86Bd8Cc5fE876b4B793256C0d67a887",
            uri: "ipfs://bafybeienl44uwy37aiuukqehrfdj5lbtjbebkpsgosg47zpb7tmcrqavnm/1.json",
        };
        const abiCoder = new ethers.utils.AbiCoder();
        console.log('mintData:', abiCoder.encode(
            ["tuple(address, address, string)"],
            [["0xa5eE5654b582857F26BeaaD82f1E69eC5591Bd86", "0xD02c8cebc86Bd8Cc5fE876b4B793256C0d67a887", "ipfs://bafybeienl44uwy37aiuukqehrfdj5lbtjbebkpsgosg47zpb7tmcrqavnm/1.json"]]
        ));
    }

    // Create the contract object and connect with the signer
    const private_key = fs.readFileSync('.secret').toString().trim();
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const signer = new ethers.Wallet(private_key, provider);
    console.log('signer:', signer.address);
    console.log("iPAssetRegistrarOApp address:", iPAssetRegistrarOAppAddress);

    const iPAssetRegistrarOApp = new ethers.Contract(iPAssetRegistrarOAppAddress, IPAssetRegistrarOApp.abi, signer);

    console.log("iPAssetRegistrarOApp deployed on:", iPAssetRegistrarOApp.signer.provider.connection.url);

    const { nativeFee, _ } = await iPAssetRegistrarOApp.quote(targetDstEid, mintData, targetOptions);

    console.log("Native fee:", nativeFee.toString());

    const tx = await iPAssetRegistrarOApp.send(targetDstEid, mintData, targetOptions, { value: nativeFee });
    console.log("Transaction hash:", tx.hash);
}

var args = process.argv.slice(2);

main(args[0]).catch((error) => {
    console.error(error);
    process.exitCode = 1;
});