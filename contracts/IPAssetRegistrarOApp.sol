// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OApp.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IIPAssetRegistry.sol";
import "./SimpleIpNft.sol";

struct MintData {
    address collectionAddress;
    address to;
    string uri;
}

/// @notice This OApp allows users to mint a NFT on a remote chain and register it with the IPAssetRegistry of Story Protocol.
/// @dev All allowd NFT collections must be owned by this OApp in order to authorize minting.
contract IPAssetRegistrarOApp is OApp {
    // The allowed NFT collection contract address
    mapping(address => bool) public allowedCollections;

    // The address of IPAssetRegistry contract
    address public ipAssetRegistry;

    // The Id of chain
    uint256 public chainId;

    // Current tokenID
    uint256 public tokenId;

    MintData public currentMintData;

    address public newlyRegisteredIp;

    constructor(
        address _endpoint,
        address _owner
    ) OApp(_endpoint, _owner) Ownable(msg.sender) {}

    /// @notice Allows the owner to add a new NFT collection contract to the allowed list.
    /// @param _collection The address of the NFT collection contract.
    /// @param _allowed The boolean value to allow or disallow minting from the collection.
    function setAllowedCollection(
        address _collection,
        bool _allowed
    ) external onlyOwner {
        allowedCollections[_collection] = _allowed;
    }

    /// @notice Allows the owner to set the IPAssetRegistry contract address.
    /// @param _ipAssetRegistry The address of the IPAssetRegistry contract.
    /// @param _chainId The Id of chain.
    function setIpAssetRegistry(
        address _ipAssetRegistry,
        uint256 _chainId
    ) external onlyOwner {
        ipAssetRegistry = _ipAssetRegistry;
        chainId = _chainId;
    }

    /// @notice Sends a message from the source to destination chain.
    /// @param _dstEid The destination chain's endpoint ID.
    /// @param _mintData The data of Nft. A structure includes: collection address, the recipient address, and the URI of the NFT.
    /// @param _options The message execution options (e.g., gas to use on destination).
    function send(
        uint32 _dstEid,
        MintData calldata _mintData,
        bytes calldata _options
    ) external payable {
        bytes memory _payload = encodeData(_mintData); // Encodes message as bytes.
        _lzSend(
            _dstEid, // Destination chain's endpoint ID.
            _payload, // Encoded message payload being sent.
            _options, // Message execution options (e.g., gas to use on destination).
            MessagingFee(msg.value, 0), // Fee struct containing native gas and ZRO token.
            payable(msg.sender) // The refund address in case the send call reverts.
        );
    }

    /// @notice Quotes the gas needed to pay for the full omnichain transaction in native gas or ZRO token.
    /// @param _dstEid Destination chain's endpoint ID.
    /// @param _mintData The data of Nft. A structure includes: collection address, the recipient address, and the URI of the NFT.
    /// @param _options Message execution options (e.g., for sending gas to destination).
    function quote(
        uint32 _dstEid,
        MintData calldata _mintData,
        bytes calldata _options
    ) public view returns (uint256 nativeFee, uint256 lzTokenFee) {
        bytes memory _payload = encodeData(_mintData); // Encodes message as bytes.

        MessagingFee memory fee = _quote(_dstEid, _payload, _options, false);
        return (fee.nativeFee, fee.lzTokenFee);
    }

    /// @notice Internal function override to handle incoming messages from another chain.
    /// @dev _origin A struct containing information about the message sender.
    /// @dev _guid A unique global packet identifier for the message.
    /// @param payload The encoded message payload being received.
    /// @dev The following params are unused in the current implementation of the OApp.
    /// @dev _executor The address of the Executor responsible for processing the message.
    /// @dev _extraData Arbitrary data appended by the Executor to the message.
    function _lzReceive(
        Origin calldata /* _origin */,
        bytes32 /* _guid */,
        bytes calldata payload,
        address /* _executor */,
        bytes calldata /* _extraData */
    ) internal override {
        // Decode the payload data to get the MintData struct.
        MintData memory _mintData = abi.decode(payload, (MintData));

        // Mint the NFT on the allowed collection.
        require(
            allowedCollections[_mintData.collectionAddress],
            "Collection not allowed"
        );
        uint256 newTokenId = SimpleIpNft(_mintData.collectionAddress).safeMint(
            _mintData.to,
            _mintData.uri
        );

        currentMintData = _mintData;
        tokenId = newTokenId;

        // Register the NFT with the IPAssetRegistry.
        newlyRegisteredIp = IIPAssetRegistry(ipAssetRegistry).register(
            chainId,
            _mintData.collectionAddress,
            tokenId
        );
    }

    /// @notice The process of creating payload data for the message will be handled in this function.
    /// @dev The params of this function can be modified as per the requirements of the OApp.
    function encodeData(
        MintData calldata _mintData
    ) internal pure returns (bytes memory) {
        return abi.encode(_mintData);
    }
}
