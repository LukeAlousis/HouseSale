# Avoiding Common Attacks

## Reentrancy

The Reentrancy attack allows functions to be called repeatedly, before the first invocation of the function is finished, allowing attackers to cause different invocations of the function to interact in destructive ways. This attack has been avoided by using the .transfer function to send funds which has a limited gas stipend of 2300 gas. Also the .transfer functions are called last in functions, after all internal work is finished.

## TOD/Front Running

This attack is not relevant in this contract. Miners can see all offers submitted during a block but that does not affect what offer the seller choses.

## Timestamp Dependance

This contract uses timestamps to determine the closing date of a real estate deal and when funds must be submitted. This can be manipulated by miners so the following note was added to the app:

Important Note: This contract uses a closing date to determine when the buyer must submit offers and deal can be closed. This closing date can be used as a rough estimate only as timestamps can be manipulated by a miner. It is recommended to submit funds well before the closing date.

## Integer Overflow and Underflow

This security vulnerability is prevented by using the SafeMath library by OpenZepplin to complete addition, subtraction, multiplication and division.

## DOS with (Unexpected) revert
Not applicable in the contract.

## DOS with Block Gas Limit
This vulnerability is prevented by requiring potential buyers to call a function to return their own deposits if there offer is not accepted rather than calling a function that automatically sends deposits back to all buyers if their deposit is not accepted.

## Forcibly Sending Ether to a Contract
This vulnerability is not applicable because no calculations or functions are based on the contracts balance.
