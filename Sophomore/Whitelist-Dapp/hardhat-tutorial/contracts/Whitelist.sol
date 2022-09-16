// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Whitelist {
    uint8 public maxWhitelistedAddresses;
    mapping(address => bool) public whitelistedAddresses;
    uint8 public numAddressesWhitelisted;

    constructor(uint8 _maxWhitelistedAddresses) {
        maxWhitelistedAddresses = _maxWhitelistedAddresses;
    }
    
    /**
     * addAddressToWhitelist - Adds address of sender to whitelist
     */
    function addAddressToWhitelist() public {
        require(!whitelistedAddresses[msg.sender], "Sender already whitelisted");
        require(numAddressesWhitelisted < maxWhitelistedAddresses, "Limit reached. Can't add more addresses");
        
        whitelistedAddresses[msg.sender] = true;
        numAddressesWhitelisted += 1;
    }
}