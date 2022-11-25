import { expect } from "chai"
import { ethers } from "hardhat"
import keccak256 from "keccak256"
import { MerkleTree } from "merkletreejs"

function encodeLeaf(address, spots) {
    return ethers.utils.defaultAbiCoder.encode(
        ["address", "uint64"],
        [address, spots]
    )
}

describe("Check if merkle root is working", () => {
    it("Should verify if given address is whitelisted", async function () {
        const [owner, addr1, addr2, addr3, addr4, addr5] =
            await ethers.getSigners()
        const list = [
            encodeLeaf(owner.address, 2),
            encodeLeaf(addr1.address, 2),
            encodeLeaf(addr2.address, 2),
            encodeLeaf(addr3.address, 2),
            encodeLeaf(addr4.address, 2),
            encodeLeaf(addr5.address, 2)
        ]

        const merkleTree = new MerkleTree(list, keccak256, {
            hashLeaves: true,
            sortPairs: true
        })

        const root = merkleTree.getHexRoot()

        const whitelist = await ethers.getContractFactory("Whitelist")
        const deployedWhitelist = await whitelist.deploy(root)
        await deployedWhitelist.deployed()

        const leaf = keccak256(list[0])
        const proof = merkleTree.getHexProof(leaf)

        let verified = await deployedWhitelist.checkInWhitelist(proof, 2)
        expect(verified).to.equal(true)

        verified = await deployedWhitelist.checkInWhitelist([], 2)
        expect(verified).to.equal(false)
    })
})
