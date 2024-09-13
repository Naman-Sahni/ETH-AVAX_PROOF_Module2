// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

contract namanAssessment {  
    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event OwnerChanged(address indexed oldOwner, address indexed newOwner);
    event FundsTransferred(address indexed to, uint256 amount);
    
    mapping(address => uint256) public balanceOf;
    mapping(address => uint256) public transactionCount; // Mapping to track transaction count
    mapping(address => uint256) public dummyState; // Dummy state for confirmation

    address payable public owner;

    constructor() payable {
        owner = payable(msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    function getBalanceFromWalletAddress(address walletAddress) public view returns(uint256) {
        return balanceOf[walletAddress];
    }
    
    function depositAmount(uint256 _amount) public payable {
        uint _previousBalance = balanceOf[msg.sender];
        balanceOf[msg.sender] += _amount;
        assert(balanceOf[msg.sender] == _previousBalance + _amount);
        emit Deposit(msg.sender, _amount);

        transactionCount[msg.sender] += 1; // Increment transaction count on deposit
    }

    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdrawAmount(uint256 _withdrawAmount) public {
        uint _previousBalance = balanceOf[msg.sender];
        if (balanceOf[msg.sender] < _withdrawAmount) {
            revert InsufficientBalance({
                balance: _previousBalance,
                withdrawAmount: _withdrawAmount
            });
        }
        balanceOf[msg.sender] -= _withdrawAmount;
        assert(balanceOf[msg.sender] == (_previousBalance - _withdrawAmount));
        emit Withdraw(msg.sender, _withdrawAmount);

        transactionCount[msg.sender] += 1; // Increment transaction count on withdrawal
    }
    
    function checkBalance() public view returns(uint256) {
        return balanceOf[msg.sender];
    }

    function Acountholder() public pure returns(string memory) {
        return "Anshul";
    }

    function updateDummyState() public returns (uint256) {
        dummyState[msg.sender] += 1; // Increment dummy state for confirmation
        transactionCount[msg.sender] += 1; // Increment transaction count
        return transactionCount[msg.sender];
    }

    function getTransactionCount(address _user) public view returns (uint256) {
        return transactionCount[_user];
    }
    
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

     function transferFunds(address payable to, uint256 amount) public {
        require(to != address(0), "Cannot transfer to zero address");
        require(amount > 0, "Transfer amount must be greater than zero");
        if (address(this).balance < amount) {
            revert InsufficientBalance({
                balance: address(this).balance,
                withdrawAmount: amount
            });
        }
}
