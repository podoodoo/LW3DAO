// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IFakeNFTMarketplace {
    function getPrice() external view returns (uint256);

    function available(uint256 _tokenId) external view returns (bool);

    function purchase(uint256 _tokenId) external payable;
}

interface ICryptoDevsNFT {
    function balanceOf(address owner) external view returns (uint256);

    function tokenOfOwnerByIndex(address owner, uint256 index)
        external
        view
        returns (uint256);
}

struct Proposal {
    uint256 nftTokenId;
    // the UNIX timestamp until which this proposal is active.
    uint256 deadline;
    uint256 yayVotes;
    uint256 nayVotes;
    bool executed;
    mapping(uint256 => bool) voters;
}

contract CryptoDevsDAO is Ownable {
    enum Vote {
        YAY, // 0
        NAY // 1
    }

    mapping(uint256 => Proposal) public proposals;
    uint256 public numProposals;

    IFakeNFTMarketplace nftMarketplace;
    ICryptoDevsNFT cryptoDevsNFT;

    modifier onlyNFTOwner() {
        require(cryptoDevsNFT.balanceOf(msg.sender) > 0, "NOT_A_DAO_MEMBER");
        _;
    }

    modifier activeProposalOnly(uint256 index) {
        require(
            proposals[index].deadline > block.timestamp,
            "DEADLINE_EXCEEDED"
        );
        _;
    }

    modifier inactiveProposalOnly(uint256 index) {
        require(
            proposals[index].deadline <= block.timestamp,
            "DEADLINE_NOT_EXCEEDED"
        );
        require(
            proposals[index].executed == false,
            "PROPOSAL_ALREADY_EXECUTED"
        );
        _;
    }

    constructor(address _nftMarketplace, address _cryptoDevsNFT) payable {
        nftMarketplace = IFakeNFTMarketplace(_nftMarketplace);
        cryptoDevsNFT = ICryptoDevsNFT(_cryptoDevsNFT);
    }

    function createProposal(uint256 _tokenId)
        external
        onlyNFTOwner
        returns (uint256)
    {
        require(nftMarketplace.available(_tokenId), "NFT_NOT_AVAILABLE");
        Proposal storage proposal = proposals[numProposals];
        proposal.nftTokenId = _tokenId;
        proposal.deadline = block.timestamp + 5 minutes;
        numProposals += 1;
        return numProposals - 1;
    }

    function voteOnProposal(uint256 proposalIndex, Vote vote)
        external
        onlyNFTOwner
        activeProposalOnly(proposalIndex)
    {
        Proposal storage currentProposal = proposals[proposalIndex];
        uint256 voterBalance = cryptoDevsNFT.balanceOf(msg.sender);
        uint256 numVotes = 0;

        for (uint256 i = 0; i < voterBalance; i++) {
            uint256 tokenId = cryptoDevsNFT.tokenOfOwnerByIndex(msg.sender, i);
            if (currentProposal.voters[tokenId] == false) {
                numVotes += 1;
                currentProposal.voters[tokenId] == true;
            }
        }

        require(numVotes > 0, "ALREADY_VOTED");

        if (vote == Vote.YAY) {
            currentProposal.yayVotes += numVotes;
        } else {
            currentProposal.nayVotes += numVotes;
        }
    }

    function executeProposal(uint256 proposalIndex)
        external
        onlyNFTOwner
        inactiveProposalOnly(proposalIndex)
    {
        Proposal storage currentProposal = proposals[proposalIndex];
        if (currentProposal.yayVotes > currentProposal.nayVotes) {
            uint256 nftPrice = nftMarketplace.getPrice();
            require(address(this).balance >= nftPrice, "NOT_ENOUGH_ETH");
            nftMarketplace.purchase{value: nftPrice}(
                currentProposal.nftTokenId
            );
        }
        currentProposal.executed = true;
    }

    function withdrawEth() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    receive() external payable {}

    fallback() external payable {}
}
