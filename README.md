
# Real Estate Offering and Transaction Platform

This application allows sellers to offer "imaginary" houses for sale, buyers to bid on and submit funds on a house and performs the final transaction of funds once the closing date has been reached. All of this is done completely and transparently on the Ethereum blockchain.

## Links to Required Documents

## User Stories
A seller (home owner) wants to sell their house using the blockchain. The seller opens the web app and clicks Add New House For Sale, enters the relevant details including the home address, desired sales price and required deposit amount to submit an offer. The house is then listed on the web application for potential buyers to bid on by placing offers with the required deposit amount.

*FUTURE FEATURES – A future version of this app could utilize a verification system like to verify the seller is a real person and owns the property they want to sell. When the house is put up for sale the ownership can be linked to an ERC 721 token that would be transferred to the buyer once the deal is closed.*

Using the web app, users (potential buyers) can look through the houses for sale and then place offers on the sellers house. Each offer requires the House Id, Offer Price (The amount they are willing to pay for the house) and the Days until closing (when the potential buyer would like the deal to close).

The seller can then look through all offers that have been placed on their property by entering the houseId into the web app. The web app will only display offers to the seller. The seller can then accept any offer that has been made. Once an offer has been accepted the buyers deposit is locked in the contract, the closing date is set by adding day the offer has been accepted plus Days until closing (set by the buyer), the remaining balance is calculated as the offer price minus the offer deposit.

The buyer then has to submit all remaining funds to the contract using the web app. The submission of funds must be done before the closing date, if done after the closing the transaction will fail and the buyers deposit will be sent to the seller. Once all funds are submitted the buyer and seller must wait until the closing date to close the deal. The deal can be closed by any user that has the houseId. When closeDeal is called the funds are submitted to the seller *FUTURE FEATURE – An ERC 721 token representing ownership of the house would be sent to the buyer* and the deal has been completed!

## Components

### For buyers:
Add House For Sale: Allows sellers to put a house up for sale by entering the house address and price.

Take Down House: Allows sellers to remove a house for sale as long as they haven't accepted an offer.

Accept Offer: Allows the seller to accept an offer made on their house.

Close Deal: When called, this function transfers the buyers funds to the seller. This can only be called after an offer is accepted, the buyer has submitted all funds to the contract and the closing date has passed. If the buyer hasn't submitted all funds by the closing date the buyers deposit is sent to the seller

### For sellers:
Make Offer: Allows a user to bid on a house that is for sale by entering the houseId, their offer (in Wei) and the days, after an offer is accepted, until the deal closes and funds are transferred to the seller. To send this transaction the user submits a 5000 wei deposit that is subtracted from the purchase price.

Pull Offer: Allows the user to remove there offer on a house as long as the offer hasn't been accepted.

Submit Remaining Funds: Allows the user to submit all remaining funds (purchase price – deposit). This must be done after an offer is accepted and before the closing date.


## Getting Started

Clone or download the Repo from Git

### Install Node.js if not already installed
```
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs

```

### Install Truffle if not already installed
```
npm install -g truffle
```

### Install ganache-cli if not already installed
```
npm install -g ganache-cli
```
### Compile the smart contracts
Open your terminal and 'cd' (change directory) to the appropriate folder, where you have downloaded and unzipped the repo. Compile the smart contracts using

```
> truffle compile
```

Note: If you are having issues with the scrypt folder run the following in the project directory
```
> # npm install scrypt
```

## Testing the contract
Information for the tests can be found at https://github.com/LukeAlousis/HouseSale/blob/master/testing.md. To launch the tests, in your terminal, make sure you are in the repo folder and follow the instructions below.

### Enter the Truffle development environment
```
> truffle develop
```

### Start the tests
```
truffle(develop)> test
```
You should see six tests pass.

## Running the Application
This contract has been deployed on the Rinkeby Testnet. To start the application run the following command in the terminal in the project directory 
```
npm start
```
