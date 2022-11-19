import { Contract } from "ethers"
import {
    CRYPTO_DEV_TOKEN_CONTRACT_ADDRESS,
    EXCHANGE_CONTRACT_ADDRESS,
    CRYPTO_DEV_TOKEN_CONTRACT_ABI,
    EXCHANGE_CONTRACT_ABI
} from "../constants"

const getEtherBalance = async (provider, address, contract = false) => {
    try {
        if (contract) {
            const balance = await provider.getBalance(EXCHANGE_CONTRACT_ADDRESS)
            return balance
        } else {
            const balance = await provider.getBalance(address)
            return balance
        }
    } catch (error) {
        console.error(error)
        return 0
    }
}

const getCDTokensBalance = async (provider, address) => {
    try {
        const tokenContract = new Contract(
            CRYPTO_DEV_TOKEN_CONTRACT_ADDRESS,
            CRYPTO_DEV_TOKEN_CONTRACT_ABI,
            provider
        )

        const balance = await tokenContract.balanceOf(address)
        return balance
    } catch (error) {
        console.error(error)
    }
}

const getLPTokensBalance = async (provider, address) => {
    try {
        const exchangeContract = new Contract(
            EXCHANGE_CONTRACT_ADDRESS,
            EXCHANGE_CONTRACT_ABI,
            provider
        )
        const balance = await exchangeContract.balanceOf(address)
        return balance
    } catch (error) {
        console.error(error)
    }
}

const getReserveOfCDTokens = async (provider, address) => {
    try {
        const exchangeContract = new Contract(
            EXCHANGE_CONTRACT_ADDRESS,
            EXCHANGE_CONTRACT_ABI,
            provider
        )
        const reserve = exchangeContract.getReserve()
        return reserve
    } catch (error) {
        console.error(error)
    }
}

export {
    getEtherBalance,
    getCDTokensBalance,
    getLPTokensBalance,
    getReserveOfCDTokens
}
