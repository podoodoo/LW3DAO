import { ethers } from "hardhat"
import { CRYPTO_DEVS_NFT_CONTRACT_ADDRESS } from "../constants"

async function main() {
    const cryptoDevNFTContract = CRYPTO_DEVS_NFT_CONTRACT_ADDRESS
    const cryptoDevTokenContract = await ethers.getContractFactory(
        "CryptoDevToken"
    )
    const deployedCryptoDevTokenContract = await cryptoDevTokenContract.deploy(
        cryptoDevNFTContract
    )

    await deployedCryptoDevTokenContract.deployed()

    console.log(
        "Deployed Crypto Dev Token At:",
        deployedCryptoDevTokenContract.address
    )
}

main()
    .then(() => {
        process.exit(0)
    })
    .catch((error) => {
        console.error(error)
        process.exitCode = 1
    })
