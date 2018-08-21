#Design Pattern Decisions

##Included the libraries from OpenZepplin called SafeMath and Pausable

TheSafeMath library prevents over/under vulnerabilities from occurring by utilizing the add, subtract, multiply and divide functions for math operations.

The Pausable library is required for the emergency stop. It ensures that only the owner of the contract account is able to pause the functions that can change state

##Modifiers to verify the buyer and seller

There are certain functions in the contract that must be restricted to the potential buyers or seller. For example only the potential buyers can get their deposit returned to them if they want to pull an offer.

##Deposits are not returned to potential buyers automatically
If an offer on a house has been accepted that means all other offers have been rejected and the users that have a rejected offer must be able to get their deposits returned. If the transactions to return deposits was automatic that would mean a function would have to get the list of all rejected offers and then transfer the deposit to all users with a rejected offer. This would cost a significant amount of gas as the number of offers could be high. A decision was made to require each user with a rejected offer to call a function to return their deposit id it has been rejected. This puts the gas cost on the user that has an offer rejected. It also prevents multiple transfers form being required in one function.

##Using Structs for Home and Offering
Each home and offer have their own unique properties (address, offer price, etc). It was important to to track all of these properties for every home of offer. Therefore it was decided to use structs for each.

##Using Arrays vs Mappings for Houses and Offers

Mappings were originally decided to use because of the cost of gas if arrays need to be modified when an offer is pulled or houses are no longer for sale. The decision was then made to use arrays because of their simplicity when interacting with Web3 and houses and offers do not need to be removed from the array when no longer for sale or pulled respectively.
