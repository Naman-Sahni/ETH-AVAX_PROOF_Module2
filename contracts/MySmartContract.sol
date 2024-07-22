// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.7;

contract MySmartContract {

    address payable public wallet_address;
    uint256 public balance;

    event ShowAddress(address wallet_address);
    event DepositEvent(uint256 deposit_value, uint256 balance);
    event WithdrawEvent(uint256 withdraw_value, uint256 balance);
    event RedeemEvent(uint256 amount);

    constructor(uint256 init_val) {
        balance = init_val;
        wallet_address = payable(msg.sender);
    }

    function getBalance() public view returns(uint256) {
        return balance;
    }

    function displayAddress() public payable {
        emit ShowAddress(wallet_address);
    }

    function deposit(uint256 deposit_value) public payable {
        balance += deposit_value;
        emit DepositEvent(deposit_value, balance);
    }

    function withdraw(uint256 withdraw_value) public payable {
        require(balance >= withdraw_value, "Insufficient balance");
        balance -= withdraw_value;
        emit WithdrawEvent(withdraw_value, balance);
    }

    function redeem() public {
        require(balance > 0, "No balance to redeem");
        uint256 amount = balance;
        balance = 0;
        emit RedeemEvent(amount);
    }
}
