import { Contract, utils } from "ethers"
import {
    CRYPTO_DEV_TOKEN_CONTRACT_ADDRESS,
    EXCHANGE_CONTRACT_ADDRESS,
    CRYPTO_DEV_TOKEN_CONTRACT_ABI,
    EXCHANGE_CONTRACT_ABI
} from "../constants"

const addLiquidity = async (signer, addCDamountWei, addEtherAmountWei) => {
    try {
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
        let tx = await tokenContract.approve(
            EXCHANGE_CONTRACT_ADDRESS,
            addCDamountWei.toString()
        )
        await tx.wait()
        tx = await exchangeContract.addLiquidity(addCDamountWei, {
            value: addEtherAmountWei
        })
        await tx.wait()
    } catch (error) {}
}

const calculateCD = async (
    _addEther = "0",
    etherBalanceContract,
    cdTokenReserve
) => {
    const _addEtherAmountWei = utils.parseEther(_addEther)
    const cryptoDevTokenAmount = _addEtherAmountWei
        .mul(cdTokenReserve)
        .div(etherBalanceContract)
    return cryptoDevTokenAmount
}

export { addLiquidity, calculateCD }
