import { ethers } from "hardhat"
import { CRYPTODEVS_NFT_CONTRACT_ADDRESS } from "../constants"

async function main() {
    const fakeNFTMarketplace = ethers.getContractFactory("FakeNFTMarketplace")
    const cryptoDevsDAO = ethers.getContractFactory("CryptoDevsDAO")

    // deploy market
    const deployedFakeNFTMarketplace = (await fakeNFTMarketplace).deploy()
    await (await deployedFakeNFTMarketplace).deployed()

    console.log(
        "Fake NFT Marketplace deployed to address:",
        (await deployedFakeNFTMarketplace).address
    )

    // deploy DAO
    const deployedCryptoDevsDAO = (await cryptoDevsDAO).deploy(
        (await deployedFakeNFTMarketplace).address,
        CRYPTODEVS_NFT_CONTRACT_ADDRESS,
        { value: ethers.utils.parseEther("1") }
    )
    await (await deployedCryptoDevsDAO).deployed()

    console.log(
        "Crypto Devs DAO deployed to address:",
        (await deployedCryptoDevsDAO).address
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
