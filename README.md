
# Real Estate Offering and Transaction Platform

This application allows sellers to offer houses for sale, buyers to bid on and submit funds on a house and performs the final transaction of funds once the closing date has been reached. All of this is done completely and transparently on the Ethereum blockchain.

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

Clone the Repo from Git

## Starting (Your Own Version) on TestRPC (Local Testnet)

For those with MacOS, download Ganache here: http://truffleframework.com/ganache/. This will visualize your local blockchain (so that you can see all transactions, associated 'costs' and otherwise). Ganache is the new way to interact with TestRPC without having 10 terminals open. For those of you with Windows or other OS, you should be able to find your download(s) here: https://github.com/trufflesuite/ganache/releases


Go ahead and start Ganache by opening the application on your computer. You should see something like this:
![alt text](http://truffleframework.com/images/suite/ganache/ganache-window.png)


Open your terminal and 'cd' (change directory) to the appropiate folder, where you have downloaded and unzipped the repo. Then compile and migrate your smart contracts like so (make sure that you have installed all dependencies related to truffle here: http://truffleframework.com/docs/getting_started/installation):
```
> truffle compile
> truffle migrate
```

IMPORTANT! - Make sure, before you deploy the application locally via 'npm start' in your terminal, that your MetaMask is on the 'Localhost 8545' network. Here are the steps to ensure that it is:

1. Download MetaMask if you haven't already and make an account  

2. Make sure to log out of that account, you should see the following screen:
![alt text](https://steemitimages.com/0x0/http://i.imgsafe.org/1a87d9810c.png)

3. Go to Ganache (application shown in first image of the README), you should see a mnemonic at the top of the application shown as 12 random words. Copy these words on your computer.

4. Press the "Unlock" button on MetaMask, follow the prompts and paste the 12 words into MetaMask (you are now unlocking a test network account in which you can use fake ETH to fund your transactions).

5. Go to the top left of the MetaMask application where it says 'Main Ethereum Network.' Click and you will see a drop down listing other networks. Choose the 'Localhost 8545 network. You should have a balance of 100 ETH. If you don't, make sure to click on the Account circle in the top left hand side of the application, go down to settings, and scroll down and press the button that says "Reset Account."

6. Now return to your open terminal and use the following command:
```
> npm start
```

7. A web page should open up and show the interface of your DApp (Decentralized Application). For this DApp, you should see a form, test it out and enter the details and press the submit button. You should get a prompt from MetaMask to 'sign' the transaction (authorize it). You're good to go!

## Starting (Your Own Version) on Rinkeby (Actual Testnet)

Have terminal open in the folder path of the project on your computer. Before migrating to testnet, make sure that the application's smart contracts build is up to date. To do this, do the following:

1. Go to the "build" folder of the project. It should be one of the first, outermost folders in the project
2. Open the contracts folder
3. Delete all contents of the contracts folder
4. Go to terminal window (in which you should be in the folder path of the project)
5. Use the following command:
```
> truffle compile
```

Next, go to the 'truffle.js' config file in the outermost level of the project and change the private key to your test wallet private key (rinkeby). Note, there are no real funds in the current private key's wallet and I do not suggest that you use a private key (even on rinkeby) from a wallet that has mainnet funds, unless you like losing money :)

Afterwards, go to https://infura.io/signup and get yourself an account - this will give you access to a node so that you can migrate your DApp's contracts onto various Ethereum networks. Use the Rinkeby url they send you via email, which should have your API token at the end of it, and replace line 20 in the truffle.js with the following:
```
> return new PrivateKeyProvider([Your Private Key to Test Wallet], 'https://rinkeby.infura.io/[Your API Token from Infura]')
```

Once you have changed your private key in the 'tuffle.js' config file. Open your terminal (again, which should be in the folder path of the project) and thenmigrate your smart contracts to the Rinkeby network like so (make sure that you have installed all dependencies related to truffle here: https://medium.com/@jasoons/migrating-an-ethereum-smart-contract-to-a-live-network-with-truffle-d5d35fcec327):
```
> truffle migrate --network rinkeby
```

Now return to your open terminal and use the following command:
```
> npm start
```

7. A web page should open up and show the interface of your DApp (Decentralized Application). For this DApp, you should see a form, test it out and enter the details and press the submit button. You should get a prompt from MetaMask to 'sign' the transaction (authorize it). You're good to go!

### TODO:
* Complete tx without user being charged


## Resources

* http://truffleframework.com/docs/drizzle/getting-started
* http://truffleframework.com/boxes/drizzle
