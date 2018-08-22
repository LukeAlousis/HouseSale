const HouseSale = artifacts.require("./HouseSale.sol");

let houseSale

beforeEach(async () => {
  houseSale = await HouseSale.new();

});

contract('HouseSale Contract', async (accounts) => {

  it('deploys a contract', async () => {
    //let houseSale = await HouseSale.deployed();
    console.log(houseSale.address);
    assert.ok(houseSale.address);
  });


  it('only the buyer can pull their offer and get their deposit returned',
  async () => {

    //Owner puts house up for sale
    await houseSale.addHouseForSale("40 House Road", '5000000000000000000', {
      from: accounts[0]
    });
    //Get initial balance of the buyer
    const initialBalance = await web3.eth.getBalance(accounts[1]);

    //Buyer submits an offer on house Id 0 and deposits 1 eth
    await houseSale.makeOffer('0', '4000000000000000000', '1', {
      from: accounts[1],
      value: '5000'
    });
    //An account thats not the buyer tries to pull the offer and receive the
    //deposit
    let executed;

    try {
      await houseSale.pullOffer('0', {
        from: accounts[3]
      });
      executed = 'success';
    } catch (err) {
      executed = 'fail'
    }

    assert.equal('fail', executed);

    //Buyer pulls offer and should get 1 eth deposit sent back to them minus gas
    await houseSale.pullOffer('0', {
      from: accounts[1]
    });

    //Get final balcnce of the buyer
    const finalBalance = await web3.eth.getBalance(accounts[1]);

    /*Compare the difference between the starting balance and final balance of
    the buyer to confirm the difference is less than .05 eth*/
    const difference = initialBalance - finalBalance;
    assert(difference < '50000000000000000');

  });

  //Make sure only the owner of a contract can accept an offers
  it('only the owner can accept an offer', async () => {
    //Put house up for sale
    await houseSale.addHouseForSale("40 House Road", '5000000000000000000', {
      from: accounts[0]
    });
    //Get initial balance of the seller
    const initialBalance = await web3.eth.getBalance(accounts[0]);

    //Two offers submitted on house Id 0
    await houseSale.makeOffer('0', '4000000000000000000', '1', {
      from: accounts[1],
      value: '5000'
    });
    await houseSale.makeOffer('0', '4500000000000000000', '1', {
      from: accounts[2],
      value: '5000'
    });
    //Someone other than the owner tries to accept the house offer
    try {
      await houseSale.acceptOffer('0', '1', {
        from: accounts[1]
      });
      executed = 'success';
    } catch (err) {
      executed = 'fail'
    }

    assert.equal('fail', executed);

  });

  //Ensure if an offer is made and rejected the potential buyer gets their
  //deposit back
  it('can recive deposit if offer is rejected', async () => {
    await houseSale.addHouseForSale("40 House Road", '5000000000000000000', {
      from: accounts[0]
    });
    //Get initial balance of the potential buyer
    const initialBalance = await web3.eth.getBalance(accounts[1]);

    //Two offers submitted on house Id 0
    await houseSale.makeOffer('0', '4000000000000000000', '1', {
      from: accounts[1],
      value: '5000'
    });

    await houseSale.makeOffer('0', '4500000000000000000', '1', {
      from: accounts[2],
      value: '5000'
    });

    //The owner accepts second offer offerid '1' on house id '0'
    await houseSale.acceptOffer('0', '1', {
      from: accounts[0]
    });


    //Someone other than the rejected buyer tries to get the deposit back
    try {
      await houseSale.pullOffer('0', {
        from: accounts[0]
      });
      executed = 'success';
    } catch (err) {
      executed = 'fail'
    }



    assert.equal('fail', executed);

    //The rejected buyer of offerid '0' on house id '0' is returned to the
    //potential buyer
    await houseSale.pullOffer('0', {
      from: accounts[1]
    });
    //Get final balcnce of the rejected buyer
    const finalBalance = await web3.eth.getBalance(accounts[1]);

    /*Compare the difference between the starting balance and final balance of
    the buyer to confirm the difference is less than .05 eth*/
    const difference = initialBalance - finalBalance;
    assert(difference < '50000000000000000');
  });

  //Test tht runs through the contract from start to finish
  it('sends money to the seller once the deal has closed', async () => {
    //Put house up for sale
    await houseSale.addHouseForSale("40 House Road", '5000000000000000000', {
      from: accounts[0]
    });
    //Get initial balance of the seller
    const initialBalance = await web3.eth.getBalance(accounts[0]);

    //Two offers submitted on house Id 0
    await houseSale.makeOffer('0', '4000000000000000000', '1', {
      from: accounts[1],
      value: '5000'
    });
    await houseSale.makeOffer('0', '4500000000000000000', '1', {
      from: accounts[2],
      value: '5000'
    });
    //The owner accepts second offer offerid '1' on house id '0'
    await houseSale.acceptOffer('0', '1', {
      from: accounts[0]
    });
    //The buyer submits the remaining funds
    await houseSale.submitRemainingFunds('0', {
      from: accounts[2],
      value: '4499999999999995000'
    });

    //Time travel forward past the closing date
    await web3.currentProvider.send({
      jsonrpc: "2.0",
      method: "evm_increaseTime",
      params: [100000],
      id: 123
    });
    await web3.currentProvider.send({
      jsonrpc: "2.0",
      method: "evm_mine",
      id: 123
    });

    //Call closeDeal to send funds to the seller
    await houseSale.closeDeal('0', {
      from: accounts[0]
    });

    //Get final balcnce of the seller
    const finalBalance = await web3.eth.getBalance(accounts[0]);

    /*Compare the difference between the starting balance and final balance of
    the seller to confirm all funds were sucessfully sent*/
    const difference = finalBalance - initialBalance;
    assert(difference > '4000000000000000000');

  });

  //If the house contract isn't funded before the closing date the seller
  //gets the potential buyers deposit
  it('seller gets buyers deposit if contract isnt funded', async () => {
    //Put house up for sale
    await houseSale.addHouseForSale("40 House Road", '5000000000000000000', {
      from: accounts[0]
    });
    //Get initial balance of the seller
    const initialBalance = await web3.eth.getBalance(accounts[0]);

    //Two offers submitted on house Id 0
    await houseSale.makeOffer('0', '4000000000000000000', '1', {
      from: accounts[1],
      value: '5000'
    });
    await houseSale.makeOffer('0', '4500000000000000000', '1', {
      from: accounts[2],
      value: '5000'
    });
    //The owner accepts second offer offerid '1' on house id '0'
    await houseSale.acceptOffer('0', '1', {
      from: accounts[0]
    });
    //The buyer does not submit the remaining funds

    //Time travel forward past the closing date
    await web3.currentProvider.send({
      jsonrpc: "2.0",
      method: "evm_increaseTime",
      params: [100000],
      id: 123
    });
    await web3.currentProvider.send({
      jsonrpc: "2.0",
      method: "evm_mine",
      id: 123
    });

    //Call closeDeal to send funds to the seller
    await houseSale.closeDeal('0', {
      from: accounts[0]
    });
    //Get final balcnce of the seller
    const finalBalance = await web3.eth.getBalance(accounts[0]);


    /*Compare the difference between the starting balance and final balance of
    the seller to confirm the failed buyers deposit was sent*/
    const difference = initialBalance - finalBalance;
    assert(difference > '10000000000000000');
  });

});
