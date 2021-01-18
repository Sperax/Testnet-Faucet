// This contract creates a testnet faucet on the rinkeby testnet and will 
// be later migrated to the Sperax Testnet

// References 
// https://ethereum.stackexchange.com/questions/19314/how-to-transfer-from-one-ether-wallet-to-another-using-smartcontract

pragma solidity ^0.6.0;

contract Faucet {
  // Mapping storing the users last access time
  mapping (address => uint256) public access_time; 
  
  constructor() public {}

  // To handle receiving payments from the wallet
  receive() external payable {}
  
  // Gives out the eth to the requester
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
        // If requester requests within 24 hours deny the request
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