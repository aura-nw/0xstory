/// This script is used to set Peer for OApp contract
/// Because the peer address is taken from other network,
/// So it will must be executed after the contract_deploy script is executed successfully.
/// By default, the content of this script will be commented out and not executed
module.exports = async ({
  getNamedAccounts,
  deployments,
}) => {
  // const networkName = hre.network.name;

  // console.log('networkName:', networkName);

  // var peer = "";
  // var targetEID = 0;

  // // Query targetEID based on network
  // // from https://docs.layerzero.network/v2/developers/evm/technical-reference/deployed-contracts
  // if (networkName == 'bsctestnet') {
  //   // the address of IPAssetRegistrarOApp on sepolia testnet with zero padding
  //   peer = "0x0000000000000000000000007316e5511784EA3A2735c0Fe8a99324231E49030";
  //   targetEID = 40161;
  // } else if (networkName == 'sepolia') {
  //   // the address of IPAssetRegistrarOApp on bsctestnet with zero padding
  //   peer = "0x000000000000000000000000AE5E080fB3b880a047c4347F6f51bCa84F4f6a3b";
  //   targetEID = 40102;
  // }

  // const { execute } = deployments;
  // const { deployer } = await getNamedAccounts();

  // // setPeer for oApp
  // await execute(
  //   "IPAssetRegistrarOApp",
  //   { from: deployer, log: true },
  //   'setPeer',
  //   targetEID,
  //   peer
  // );
};

module.exports.dependencies = ['contract_deploy'];
module.exports.tags = ['setup_deploy'];
module.exports.runAtTheEnd = true;
