pragma solidity ^0.6.0;

contract Faucet {
    
    mapping (address => uint256) public access_time; 
    
    constructor() public {
        
    }
    
    // event Received(address, uint);
    receive() external payable {
        // emit Received(msg.sender, msg.value);
    }
    
    function get_eth (address payable requester) public returns (bool) {
    	// Make sure that the balance of the address is more than 1
    	require(address(this).balance > 10000000000000000, "Issue");

        if (access_time[requester] == 0) {
     		// Update access time for requester
    		access_time[requester] = now;

	    	// Transfer ETH from contract to requester
	    	requester.transfer(10000000000000000);

    		return true;

        } else {
        	if (now - access_time[requester] < 86400) {
        		return false;
        	} else {
	     		// Update access time for requester
        		access_time[requester] = now;
		    	
		    	// Transfer ETH to requester
		    	requester.transfer(10000000000000000);

    	        return true;
        	}
        }
    }
    
}

//https://ethereum.stackexchange.com/questions/19314/how-to-transfer-from-one-ether-wallet-to-another-using-smartcontract