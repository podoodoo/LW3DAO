import { Contract } from "ethers"
import {
    CRYPTO_DEV_TOKEN_CONTRACT_ADDRESS,
    EXCHANGE_CONTRACT_ADDRESS,
    CRYPTO_DEV_TOKEN_CONTRACT_ABI,
    EXCHANGE_CONTRACT_ABI
} from "../constants"

const getAmountOfTokensReceivedFromSwap = async (
    _swapAmountWei,
    provider,
    ethSelected,
    ethBalance,
    reservedCD
) => {
    const exchangeContract = new Contract(
        EXCHANGE_CONTRACT_ADDRESS,
        EXCHANGE_CONTRACT_ABI,
        provider
    )
    let amountOfTokens
    if (ethSelected) {
        amountOfTokens = await exchangeContract.getTokenAmount(
            _swapAmountWei,
            ethBalance,
            reservedCD
        )
    } else {
        amountOfTokens = await exchangeContract.getTokenAmount(
            _swapAmountWei,
            reservedCD,
            ethBalance
        )
    }

    return amountOfTokens
}

const swapTokens = async (
    signer,
    swapAmountWei,
    tokenToBeReceivedAfterSwap,
    ethSelected
) => {
    const exchangeContract = new Contract(
        EXCHANGE_CONTRACT_ADDRESS,
        EXCHANGE_CONTRACT_ABI,
        signer
    )
    const tokenContract = new Contract(
        CRYPTO_DEV_TOKEN_CONTRACT_ADDRESS,
        CRYPTO_DEV_TOKEN_CONTRACT_ABI,
        signer
    )
    let tx

    if (ethSelected) {
        tx = await exchangeContract.swapEthToCryptoDevToken(
            tokenToBeReceivedAfterSwap,
            { value: swapAmountWei }
        )
    } else {
        tx = await tokenContract.approve(
            EXCHANGE_CONTRACT_ADDRESS,
            swapAmountWei.toString()
        )
        tx.wait()
        tx = await exchangeContract.swapCryptoDevTokenToEth(
            swapAmountWei,
            tokenToBeReceivedAfterSwap
        )
        tx.wait()
    }
}

export { getAmountOfTokensReceivedFromSwap, swapTokens }
