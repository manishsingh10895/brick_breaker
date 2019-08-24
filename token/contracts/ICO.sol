pragma solidity ^0.5.0;

import "./BrickToken.sol";
import "./owned.sol";

contract ICOBrick is BrickToken {
    address public administer;

    address payable public recepient;

    //initial price of token 0.001
    uint public tokenPrice = 1000000000000000;

    // hard cap, stop ico, ico success
    uint public icoTarget = 500000000000000000000;

    uint public receivedFund;

    uint public maxInvestment = 10000000000000000000;
    
    uint public minInvestment = 1000000000000000;
    
    modifier adminOnly {
        require(msg.sender == administer, "Not admin");
        _;
    } 
    
    enum Status {
        inactive,
        active,
        stopped,
        completed
    }
    
    Status public icoStatus;
    
    uint public icoStartTime = now;
    
    // 5 days in seconds
    uint public icoEndTime = now + 432000;
    
    uint public startTrading = icoEndTime + 432000;
    
    constructor(address payable _rec) public {
        recepient = _rec;
    }
    
    function Invest() payable public returns(bool) {
         
        icoStatus = getIcoStatus();
        
        require(icoStatus == Status.active, "Ico is not active");
         
        uint amount  = msg.value;
        
        require(icoTarget >= receivedFund + amount, "Target acheived, no more");
        
        require(amount >= minInvestment && amount <= maxInvestment, "Investment no in allowd range");
        
        uint tokens = amount / tokenPrice;
        
        balanceOf[msg.sender] += tokens;
        
        balanceOf[_creator] -= tokens;
        
        recepient.transfer(amount);
        
        receivedFund += amount;
        
        return true;
    }
    
    function burn() public adminOnly returns (bool) {
        icoStatus = getIcoStatus();
        
        require(icoStatus == Status.completed, "Ico is not completed yet");
        
        balanceOf[_creator] = 0;
    }
    
    function getIcoStatus() public view returns (Status) {
        if (icoStatus == Status.stopped) {
            return Status.stopped;
        }
        
        else if(block.timestamp >= icoStartTime && block.timestamp <= icoEndTime) {
            return Status.active;
        }
        
        else if(block.timestamp <= icoStartTime) {
            return Status.inactive;
        }
        
        else {
            return Status.completed;
        }
    }
    
    function remainingFundindRequired() public view returns (uint) {
        return icoTarget - receivedFund;
    }
    
    function stopIco() public adminOnly {
        icoStatus = Status.stopped;
    }
    
    function activateIco() public adminOnly {
        icoStatus = Status.active;
    }
    
    function inactivateIco() public adminOnly {
        icoStatus = Status.inactive;
    }
    
    function completeIco() public adminOnly {
        icoStatus = Status.completed;
    }
    
    function transfer(address _to, uint256 _value) public returns (bool success) {
        
        require(block.timestamp > startTrading, "Trading is not allowed yet");
        
        super.transfer(_to, _value);
        
        return true;
    }
    
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
    
        require(block.timestamp > startTrading, "Trading is not allowed yet");
        
        super.transferFrom(_from, _to, _value);
        
        return true;
    }
    
}