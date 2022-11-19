import { ethers } from "hardhat"
import { WHITELIST_CONTRACT_ADDRESS, METADATA_URL } from "../constants/index"

async function main() {
    const whitelistContract = WHITELIST_CONTRACT_ADDRESS
    const metadataURL = METADATA_URL

    const cryptoDevsContract = await ethers.getContractFactory("CryptoDevs")
    const deployedCryptoDevsContract = await cryptoDevsContract.deploy(
        metadataURL,
        whitelistContract
    )

    await deployedCryptoDevsContract.deployed()

    console.log(
        "Crypto Devs Contract Address:",
        deployedCryptoDevsContract.address
    )
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exitCode = 1
    })
