pragma solidity ^0.5.0;

import './owned.sol';

contract BrickToken is owned {

    uint public totalSupply;
    string public name;
    string public symbol;

    uint8 public decimals = 18;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    address public _creator;

    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
    event Burn(address indexed from, uint amount);

    constructor(string memory _name, string memory _symbol, uint _initialSupply) public {
        _creator = msg.sender;

        totalSupply = _initialSupply*10**uint256(decimals);

        balanceOf[msg.sender] = totalSupply;
        name = _name;
        symbol = _symbol;
    }

    function _transfer(address _from, address _to, uint _value) internal {
        require(_to != address(0x0), "Address in 0");

        require(balanceOf[_from] > _value, "Low Balance");

        require(balanceOf[_to] + _value >= balanceOf[_to], "value is 0");

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(_from, _to, _value);
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        _transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= allowance[_from][msg.sender], "AMOUNT more than allowed value");

        allowance[_from][msg.sender] -= _value;

        _transfer(_from, _to, _value);

        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    function mintToken(address _target, uint256 _mintedAmount) public onlyOwner{
        balanceOf[_target] += _mintedAmount;

        totalSupply += _mintedAmount;

        emit Transfer(address(0x0), owner, _mintedAmount);
        emit Transfer(owner, _target, _mintedAmount);
    }

    function burn(uint256 _value) private onlyOwner returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "insufficient balance");

        balanceOf[msg.sender] -= _value;

        totalSupply = _value;

        emit Burn(msg.sender, _value);

        return true;

    }
}