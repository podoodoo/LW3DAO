import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import * as dotenv from "dotenv"

dotenv.config()

const QUICKNODE_API_KEY_URL = process.env.QUICKNODE_API_KEY_URL
const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY

const config: HardhatUserConfig = {
    solidity: "0.8.17",
    networks: {
        goerli: {
            url: QUICKNODE_API_KEY_URL,
            accounts: [GOERLI_PRIVATE_KEY!]
        }
    }
}

export default config
