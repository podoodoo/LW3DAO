import { ethers } from "hardhat"

async function main() {
    const whitelistContract = await ethers.getContractFactory("Whitelist")
    const deployedWhitelistContract = await whitelistContract.deploy()
    await deployedWhitelistContract.deployed()

    console.log(
        "Whitelist contract deployed at address:",
        deployedWhitelistContract.address
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
