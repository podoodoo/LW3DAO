// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./IWhitelist.sol";

contract CryptoDevs is ERC721Enumerable, Ownable {
    string baseTokenURI;
    IWhitelist whitelist;
    bool public presaleStarted;
    uint public presaleEnded;
    bool public paused;
    uint public tokenIds;
    uint public maxTokenIds = 20;
    uint public price = 0.001 ether;

    modifier onlyWhenNotPaused() {
        require(!paused, "Contract paused");
        _;
    }

    constructor(string memory baseURI, address whitelistContract)
        ERC721("CryptoDevs", "CD")
    {
        baseTokenURI = baseURI;
        whitelist = IWhitelist(whitelistContract);
    }

    function startPresale() public onlyOwner {
        presaleStarted = true;
        presaleEnded = block.timestamp + 5 minutes;
    }

    function presaleMint() public payable onlyWhenNotPaused {
        require(
            presaleStarted && block.timestamp < presaleEnded,
            "Presale is not running."
        );
        require(
            whitelist.whitelistedAddresses(msg.sender),
            "You are not whitelisted."
        );
        require(tokenIds < maxTokenIds, "Exceeded max Crypto Devs supply.");
        require(msg.value >= price, "Need more ether");

        tokenIds += 1;
        _safeMint(msg.sender, tokenIds);
    }

    function mint() public payable onlyWhenNotPaused {
        require(
            presaleStarted && block.timestamp > presaleEnded,
            "Presale has not ended yet."
        );
        require(tokenIds < maxTokenIds, "Exceeded max Crypto Devs supply.");
        require(msg.value >= price, "Need more ether");

        tokenIds += 1;
        _safeMint(msg.sender, tokenIds);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    function setPaused(bool val) public onlyOwner {
        paused = val;
    }

    function withdraw() public onlyOwner {
        address owner = owner();
        uint amount = address(this).balance;
        (bool sent, ) = owner.call{value: amount}("");
        require(sent, "Failed to send ether.");
    }

    receive() external payable {}

    fallback() external payable {}
}
