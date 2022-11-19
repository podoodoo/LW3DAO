import { ethers } from "hardhat"
import { CRYPTO_DEV_TOKEN_CONTRACT_ADDRESS } from "../constants"

async function main() {
    const cryptoDevTokenAddress = CRYPTO_DEV_TOKEN_CONTRACT_ADDRESS
    const exchangeContract = ethers.getContractFactory("Exchange")
    const deployedExchangeContract = (await exchangeContract).deploy(
        cryptoDevTokenAddress
    )

    ;(await deployedExchangeContract).deployed()
    console.log(
        "Exchange Contract Address:",
        (await deployedExchangeContract).address
    )
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => {
        process.exit(0)
    })
    .catch((error) => {
        console.error(error)
        process.exitCode = 1
    })
