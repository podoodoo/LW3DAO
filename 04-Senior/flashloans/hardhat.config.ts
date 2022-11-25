import "@nomicfoundation/hardhat-toolbox"
import * as dotenv from "dotenv"
dotenv.config({ path: ".env" })

const QUICKNODE_RPC_URL = process.env.QUICKNODE_RPC_URL

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    solidity: "0.8.10",
    networks: {
        hardhat: {
            forking: {
                url: QUICKNODE_RPC_URL
            }
        }
    }
}
