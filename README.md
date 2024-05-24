# 0xstory
Cross chain protocol IP management protocol, ft Story Protocol and Layer Zero.
This is a demo for minting and registering an IP NFT with Story protocol on remote chain using Layer Zero.

## Contracts description

### *IPAssetRegistrarOApp.sol*
The main contract that is deployed on both chains. User can mint and register IP NFTs on `Sepolia` chain by running [this function](https://testnet.bscscan.com/address/0xAE5E080fB3b880a047c4347F6f51bCa84F4f6a3b#writeContract#F3) from `BSC Testnet` chain:
```solidity
    function send(
        uint32 _dstEid,
        MintData calldata _mintData,
        bytes calldata _options
    ) external payable {}
```
- `_dstEid` is the endpoint ID of `Sepolia` chain (query from [deployed contracts](https://docs.layerzero.network/v2/developers/evm/technical-reference/deployed-contracts) of LayerZero).
- `_mintData` is the data of NFT that includes `collection address`, `recipient address`, and the `URI` of the NFT.
- `_options` is the message [execution options](https://docs.layerzero.network/v2/developers/evm/gas-settings/options) (e.g., gas to use on destination).
The `most newly Registered IP` will be query from `IPAssetRegistrarOApp` contract on `Sepolia` chain by function [newlyRegisteredIp()](https://eth-sepolia.blockscout.com/address/0x7316e5511784EA3A2735c0Fe8a99324231E49030?tab=read_contract#03b708a7)

### *SimpleIpNft.sol*
A simple NFT contract that is deployed on `Sepolia` chain. This contract must be deployed before minting and registering IP NFTs. The owner of this contract must be the `IPAssetRegistrarOApp` contract on `Sepolia` chain.

## Development
### Deployment
Before deploying the contracts, you need to create a `.secret` file in the root directory of the project and add the `private key` of the account that will deploy the contracts. We also use Node.js version `v18.16.0`, npm version `9.5.1` and hardhat version `2.22.3` for developing and deploying the contracts.

To deploy the contracts on `BSC Testnet` and `Sepolia` chain, you can use the following commands:
1. Install dependencies
```bash
npm install
```
2. Deploy contracts on `BSC Testnet` chain
```bash
npx hardhat deploy --network bsctestnet
```
3. Deploy contracts on `Sepolia` chain
```bash
npx hardhat deploy --network sepolia
```
4. Set Peer for deployed `IPAssetRegistrarOApp` contracts on both chains. You can use the content of `./scripts/setup.js` to do this or use UI on `bscscan` and `etherscan` after verifying contracts.

### Contracts addresses
```
┌──────────────────────┬────────────────────────────────────────────┬────────────────────────────────────────────┐
│       Contract       │                 BSC Testnet                │                   Sepolia                  │
├──────────────────────┼────────────────────────────────────────────┼────────────────────────────────────────────┤
│ IPAssetRegistrarOApp │ 0xAE5E080fB3b880a047c4347F6f51bCa84F4f6a3b │ 0x7316e5511784EA3A2735c0Fe8a99324231E49030 │
├──────────────────────┼────────────────────────────────────────────┼────────────────────────────────────────────┤
│ SimpleIpNft          │ 0xa5eE5654b582857F26BeaaD82f1E69eC5591Bd86 │ 0x8381dE6C4DCa920381fe7626B6c823810B7e1B99 │
└──────────────────────┴────────────────────────────────────────────┴────────────────────────────────────────────┘
```

## Test
To do the test, you need change the address of all contracts in `./test_scripts/send_mess.js` and run the following command:
```bash
node ./test_scripts/send_mess.js
```