import { Contract, utils } from "ethers"
import { EXCHANGE_CONTRACT_ADDRESS, EXCHANGE_CONTRACT_ABI } from "../constants"

const removeLiquidity = async (signer, removeLPTokensWei) => {
    const exchangeContract = new Contract(
        EXCHANGE_CONTRACT_ADDRESS,
        EXCHANGE_CONTRACT_ABI,
        signer
    )
    const tx = await exchangeContract.removeLiquidity(removeLPTokensWei)
    tx.wait()
}

const getTokensAfterRemove = async (
    provider,
    removeLPTokensWei,
    _ethBalance,
    cryptoDevTokenReserve
) => {
    try {
        const exchangeContract = new Contract(
            EXCHANGE_CONTRACT_ADDRESS,
            EXCHANGE_CONTRACT_ABI,
            provider
        )
        const _totalSupply = exchangeContract.totalSupply()
        const _removeEther = _ethBalance
            .mul(removeLPTokensWei)
            .div(_totalSupply)
        const _removeCD = cryptoDevTokenReserve
            .mul(removeLPTokensWei)
            .div(_totalSupply)
        return { _removeEther, _removeCD }
    } catch (error) {
        console.error(error)
    }
}

export { removeLiquidity, getTokensAfterRemove }
