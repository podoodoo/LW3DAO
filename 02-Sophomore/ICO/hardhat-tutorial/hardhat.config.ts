import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env" })

const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY
const API_KEY_URL = process.env.API_KEY_URL

const config: HardhatUserConfig = {
    solidity: "0.8.17",
    networks: {
        goerli: {
            url: API_KEY_URL,
            accounts: [GOERLI_PRIVATE_KEY!]
        }
    }
}

export default config
