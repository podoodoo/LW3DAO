// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Exchange is ERC20 {
    ERC20 public cryptoDevTokenAddress;

    constructor(address _CryptoDevToken) ERC20("CryptoDev LP Token", "CDLP") {
        require(_CryptoDevToken != address(0), "Invalid Token Address.");
        cryptoDevTokenAddress = ERC20(_CryptoDevToken);
    }

    function getReserve() public view returns (uint) {
        return ERC20(cryptoDevTokenAddress).balanceOf(address(this));
    }

    function addLiquidity(uint _amount) public payable returns (uint) {
        uint liquidity;
        uint ethBalance = address(this).balance;
        uint tokenReserve = getReserve();

        if (tokenReserve == 0) {
            cryptoDevTokenAddress.transferFrom(
                msg.sender,
                address(this),
                _amount
            );
            liquidity = ethBalance;
            _mint(msg.sender, liquidity);
        } else {
            uint ethReserve = ethBalance - msg.value;
            uint cryptoDevTokenAmount = (msg.value * tokenReserve) / ethReserve;
            require(
                _amount >= cryptoDevTokenAmount,
                "Amount of token sent is less than minimum tokens required."
            );
            cryptoDevTokenAddress.transferFrom(
                msg.sender,
                address(this),
                cryptoDevTokenAmount
            );
            liquidity = (msg.value * totalSupply()) / ethReserve;
            _mint(msg.sender, liquidity);
        }

        return liquidity;
    }

    function removeLiquidity(uint _amount) public returns (uint, uint) {
        require(_amount > 0, "Amount needs to be greater than zero.");
        uint ethReserve = address(this).balance;
        uint _totalSupply = totalSupply();
        uint ethAmount = (ethReserve * _amount) / _totalSupply;
        uint cryptoDevTokenAmount = (getReserve() * _amount) / _totalSupply;
        _burn(msg.sender, _amount);
        payable(msg.sender).transfer(ethAmount);
        ERC20(cryptoDevTokenAddress).transfer(msg.sender, cryptoDevTokenAmount);
        return (ethAmount, cryptoDevTokenAmount);
    }

    function getTokenAmount(
        uint inputAmount,
        uint inputReserve,
        uint outputReserve
    ) public pure returns (uint) {
        require(inputReserve > 0 && outputReserve > 0, "Invalid reserves.");
        // 1% fee
        uint inputAmountWithFee = inputAmount * 99;

        // from xy = k,
        // x = inputReserve, y = outputReserve
        // (x + Δx) * (y - Δy) = x * y
        // Δy = (y * Δx) / (x + Δx)

        uint numerator = inputAmountWithFee * outputReserve;
        uint denominator = (inputReserve * 100) + inputAmountWithFee;
        return numerator / denominator;
    }

    function swapEthToCryptoDevToken(uint _minTokens) public payable {
        uint tokenReserve = getReserve();
        uint tokensBought = getTokenAmount(
            msg.value,
            address(this).balance - msg.value,
            tokenReserve
        );

        require(tokensBought >= _minTokens, "Insufficient funds.");
        ERC20(cryptoDevTokenAddress).transfer(msg.sender, tokensBought);
    }

    function swapCryptoDevTokenToEth(uint _tokensSold, uint _minEth)
        public
        payable
    {
        uint tokenReserve = getReserve();
        uint ethBought = getTokenAmount(
            _tokensSold,
            tokenReserve,
            address(this).balance
        );

        require(ethBought >= _minEth, "Insufficient funds.");
        ERC20(cryptoDevTokenAddress).transferFrom(
            msg.sender,
            address(this),
            _tokensSold
        );
        payable(msg.sender).transfer(ethBought);
    }
}
