#Testing the HouseSale Contract

Six tests were designed to provide adequate coverage for the contract.

1. Make sure the contract deploys
Simple test to make sure the contract has deployed

2. Only the owner can put a house up for sale
The owner of the contract is account[0]. This test test to see if account[1] is able to put up a house for sale. If an error is thrown when account[1] sends addHouseForSale then the test passes.

3. Make sure only the buyer that put in an offer can pull his offer and receive his deposit back if the offer hasn’t been accepted
The owner puts a house up for sale for 5 eth. The buyer puts in an offer with a deposit of 1 eth. An account that is not the buyer tries to pull the offer to receive the buyers deposit. If this fails the test continues with the buyer pulling his offer. The buyer then receives the deposit back minus the gas fees.

4.Make sure only the owner of the contract can accept an offer
Couple offers are made and someone other than the owner tries to accept an offer. If the attempt fails then the test passed.

4. If an offer is accepted make sure anyone else who put in an offer can get their deposit back
After an offer is accepted the owners of the rejected offers can call returnDeposit to get their money back. This test makes sure that is possible and also ensures only owner of the rejected offer can call returnDeposit.


5. Full Run of the Contract
This test was made to check if the contract runs properly from start to finish. The contract owner puts a house up for sale. Multiple accounts put in offers on the house with the deposit. The contract owner selects the best offer (second offer). The buyer then submits all remaining funds. After the closing date closeDeal is then called which transfers the funds to the seller (future version: and the ERC721 token to the buyer).

6. If the closing date has passed and the buyer hasn't fully funded the contract then the seller gets the buyers deposit
If the buyer is not able to fund the contract by the closing date the deposit of the buyer is sent to the seller. This test ensures the deposit is sent to the buyer using closeDeal after the closing date has passed if the buyer has not submitted all remaining funds.
