module.exports = async ({
  getNamedAccounts,
  deployments,
}) => {
  const networkName = hre.network.name;

  console.log('networkName:', networkName);

  var iPAssetRegistry = "";
  var chainId = 0;
  var lzEndpoint = "";
  var EID = 0;

  // Query lzEndpoint and EID based on network
  // from https://docs.layerzero.network/v2/developers/evm/technical-reference/deployed-contracts
  if (networkName == 'bsctestnet') {
    iPAssetRegistry = ethers.constants.AddressZero; // Now the Story protocol didn't work on bsctestnet
    chainId = 97;
    lzEndpoint = "0x6EDCE65403992e310A62460808c4b910D972f10f";
    EID = 40102;
  } else if (networkName == 'sepolia') {
    iPAssetRegistry = "0xd43fE0d865cb5C26b1351d3eAf2E3064BE3276F6";
    chainId = 11155111;
    lzEndpoint = "0x6EDCE65403992e310A62460808c4b910D972f10f";
    EID = 40161;
  }

  const { deploy, execute } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log('Deploying contracts with the account:', deployer);

  // Deploy the IPAssetRegistrarOApp contract
  const oApp = await deploy("IPAssetRegistrarOApp", {
    from: deployer,
    args: [lzEndpoint, deployer],
    log: true,
    autoMine: true,
  });

  // Deploy the SimpleIpNft contract with the IPAssetRegistrarOApp contract is owner
  const simpleNft = await deploy("SimpleIpNft", {
    from: deployer,
    args: [oApp.address],
    log: true,
    autoMine: true,
  });

  // Set the IpAssetRegistry contract in the IPAssetRegistrarOApp contract
  await execute(
    "IPAssetRegistrarOApp",
    { from: deployer, log: true },
    "setIpAssetRegistry",
    iPAssetRegistry,
    chainId
  );

  // Register the SimpleIpNft contract in the IPAssetRegistrarOApp contract
  await execute(
    "IPAssetRegistrarOApp",
    { from: deployer, log: true },
    "setAllowedCollection",
    simpleNft.address,
    true
  );
};

module.exports.tags = ['contract_deploy'];
