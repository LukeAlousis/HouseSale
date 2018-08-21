/* Home View without the use of drizzle components */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AccountData, ContractData, ContractForm } from 'drizzle-react-components'
import { Card, Container, Grid, Segment, Accordion, Icon, Header, Message } from 'semantic-ui-react'

//resources
  //const sigUtil = require("eth-sig-util")
//components
import Loadable from 'react-loading-overlay'

class HouseSale extends Component {
  constructor(props, context) {
    super(props)
    /* Get contract data by accessing the contracts via 'context'. */
    this.contracts = context.drizzle.contracts

    this.state = {
      //housesForSale: '',
      offeredHouseIds: [],
      activeIndex: 0,
      value: '',
      id: ''
    };
  }


  async componentDidMount() {
  //  const housesForSale = await this.contracts.HouseSale.methods.housesForSale().call();
    const offeredHouseIds = await this.contracts.HouseSale.methods.getHousesForSale().call();
    const myHouseIds = await this.contracts.HouseSale.methods.getMyHousesId().call();
    const myOfferIds = await this.contracts.HouseSale.methods.getMyOffersId().call();
    const myAcceptedOfferIds = await this.contracts.HouseSale.methods.getMyAcceptedOffersId().call();
    const offersOnMyHousesIds = await this.contracts.HouseSale.methods.getOffersIdsOnMyHouses().call();
    const offersIAcceptedIds = await this.contracts.HouseSale.methods.getOffersIAcceptedId().call();
    const readyToCloseIds = await this.contracts.HouseSale.methods.getReadyToCloseId().call();






    //Get all houses for sale
    const allHouses = await Promise.all(offeredHouseIds.map(async address => {
      let summary = await this.contracts.HouseSale.methods.houses(address).call();
      console.log(summary);
      if (summary[12] == 1) {
        summary[12] = 'For Sale';
      } else if (summary[12] == 0) {
        summary[12] = 'Sold';
      } else if (summary[12] == 2) {
        summary[12] = 'Offer Accepted';
      } else if (summary[12] == 3) {
        summary[12] = 'Ready to Close';
      } else if (summary[12] == 4) {
        summary[12] = 'Failed to close, buyers deposit sent to seller';
      }

      return {
        header: 'House Id: ' + address + '  -  ' + summary[0],
        description: 'House Id: ' + address
                      + ', Price: ' + summary[2] + ' wei'
                      + ', State: ' + summary[12]
      }
    }));

    //Get my houses for sale
    const myHouses = await Promise.all(myHouseIds.map(async address => {
      let summary = await this.contracts.HouseSale.methods.houses(address).call();
      console.log(summary);
      if (summary[12] == 1) {
        summary[12] = 'For Sale';
        summary[10] = 0;
        summary[7] = 'null';
      } else if (summary[12] == 0) {
        summary[12] = 'Sold';
      } else if (summary[12] == 2) {
        summary[12] = 'Offer Accepted, waiting for remaining funds to be submitted';
      } else if (summary[12] == 3) {
        summary[12] = 'Ready to close after closing date';
      } else if (summary[12] == 4) {
        summary[12] = 'Failed to close, buyers deposit sent to seller';
      } else if (summary[12] == 5) {
        summary[12] = 'Removed';
      }

      return {
        header: summary[0],
        description: 'House Id: ' + address
                      + ', Price: ' + summary[2] + " wei"
                      + ', State: ' + summary[12]
                      + ', Buyer: ' + summary[10]
                      + ', Closing Date: ' + new Date(summary[7]*1000)
      }
    }));

    //Get all houses that are ready to close
    const housesReadyToClose = await Promise.all(readyToCloseIds.map(async address => {
      let summary = await this.contracts.HouseSale.methods.houses(address).call();
      console.log(summary);
      if (summary[12] == 1) {
        summary[12] = 'For Sale';
      } else if (summary[12] == 0) {
        summary[12] = 'Sold';
      } else if (summary[12] == 2) {
        summary[12] = 'Offer Accepted';
      } else if (summary[12] == 3) {
        summary[12] = 'Ready to close after closing date';
      } else if (summary[12] == 4) {
        summary[12] = 'Failed to Close';
      } else if (summary[12] == 5) {
        summary[12] = 'Removed';
      }

      return {
        header: summary[0],
        description: 'House Id: ' + address
                      + ', Price: ' + summary[2] + " wei"
                      + ', State: ' + summary[12]
                      + ', Buyer: ' + summary[10]
                      + ', Closing Date: ' + new Date(summary[7]*1000)
      }
    }));
    // Get all pending offers on my houses
    const pendingOffersOnMyHouses = await Promise.all(offersOnMyHousesIds.map(async address => {
      let summary = await this.contracts.HouseSale.methods.offers(address).call();
      console.log(summary);
      if (summary[9] == 1) {
        summary[9] = 'Accepted, waiting for remaining funds to be submitted';
      } else if (summary[9] == 0) {
        summary[9] = 'Submitted, waiting to be accepted';
        summary[5] = 'null';
      } else if (summary[9] == 2) {
        summary[9] = 'Ready to close after closing date';
      } else if (summary[9] == 3) {
        summary[9] = 'Offer has been pulled';
      }

      return {
        header: 'Offer Id: ' + address,
        description: 'Made on house Id: ' + summary[0]
                      + ', Offer Price: ' + summary[1] + ' wei'
                      + ', Days Until Closing: ' + summary[2]
                      + ', Offer State: ' + summary[9]
                      + ', Closing Date: ' + new Date(summary[5]*1000)

      }
    }));
    //List of my offers
    const myOffers = await Promise.all(myOfferIds.map(async address => {
      let summary = await this.contracts.HouseSale.methods.offers(address).call();
      console.log(summary);
      if (summary[9] == 1) {
        summary[9] = 'Accepted, need to submit remaining funds';
      } else if (summary[9] == 0) {
        summary[9] = 'Submitted, waiting to be accepted';
        summary[5] = 'null';
      } else if (summary[9] == 2) {
        summary[9] = 'Ready to close after closing date';
      } else if (summary[9] == 3) {
        summary[9] = 'Offer pulled';
      }

      return {
        header: 'Offer Id: ' + address,
        description: 'Made on house Id: ' + summary[0]
                      + ', Offer Price: ' + summary[1] + " wei"
                      + ', Days until closing: ' + summary[2]
                      + ', Offer State: ' + summary[9]
                      + ', Closing Date: ' + new Date(summary[5]*1000)

      }
    }));

    //List of my accepted offers
    const myAcceptedOffers = await Promise.all(myAcceptedOfferIds.map(async address => {
      let summary = await this.contracts.HouseSale.methods.offers(address).call();
      console.log(summary);
      if (summary[9] == 1) {
        summary[9] = 'Accepted, need to submit remaining funds';
      } else if (summary[9] == 0) {
        summary[9] = 'Submitted, waiting to be accepted';
      } else if (summary[9] == 2) {
        summary[9] = 'Ready to close after closing date';
      } else if (summary[9] == 3) {
        summary[9] = 'Offer pulled';
      }

      return {
        header: 'Offer Id: ' + address,
        description: 'Made on house Id: ' + summary[0]
                      + ', Offer Price: ' + summary[1] + " wei"
                      + ', Remaining Balance ' + summary[6]
                      + ', Closing Date: ' + new Date(summary[5]*1000)
                      + ', Offer State: ' + summary[9]
      }
    }));

    //List of my offers I've accepted
    const offersIAccepted = await Promise.all(offersIAcceptedIds.map(async address => {
      let summary = await this.contracts.HouseSale.methods.offers(address).call();
      console.log(summary);
      if (summary[9] == 1) {
        summary[9] = 'Accepted, waiting for remaining funds to be submitted';
      } else if (summary[9] == 0) {
        summary[9] = 'Submitted';
      } else if (summary[9] == 2) {
        summary[9] = 'Ready to close after closing date';
      } else if (summary[9] == 3) {
        summary[9] = 'Offer pulled';
      }

      return {
        header: 'Offer Id: ' + address,
        description: 'Made on house Id: ' + summary[0]
                      + ', Offer Price: ' + summary[1] + " wei"
                      + ', Remaining Balance ' + summary[6]
                      + ', Closing Date: ' + new Date(summary[5]*1000)
                      + ', Offer State: ' + summary[9]
      }
    }));

    //Set the app state
    //this.setState({ housesForSale });
    this.setState({ offeredHouseIds });
    this.setState({ allHouses });
    this.setState({ myHouses });
    this.setState({ myOffers });
    this.setState({ myAcceptedOffers });
    this.setState({ pendingOffersOnMyHouses });
    this.setState({ offersIAccepted });


    console.log(allHouses);
    console.log(this.contracts.HouseSale.options.address);

  }

  //Accordian Settings
  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })

  }

  onSubmit = async (event) => {
    event.preventDefault();
    console.log(this.state.id);
    console.log(this.state.value);

    await this.contracts.HouseSale.methods.submitRemainingFunds(this.state.id).send({
      from: this.props.accounts[0],
      value: this.state.value,
    });

  };


  //Add house for sale using ether
  //MAke offer on a house using ether
  //Submit remaining funds using ether

  render() {
    return (
      <Container>
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css"></link>

        <h1>Real Estate Offering and Transaction Platform</h1>
        <p> This application allows sellers to offer houses for sale, buyers to bid on and submit funds on a house and performs the final transaction of funds once the closing date has been reached. All of this is done completely and transparently on the Ethereum blockchain.</p>
        <br />
        <p><strong>Important Note:</strong> This contract uses a closing date to determine when the buyer must submit offers and deal can be closed. This closing date can be used as a <strong>rough estimate only</strong> as timestamps can be manipulated by the miner. It is recommended to submit funds well before the closing date.</p>
        <br />
        <Message warning>
          <Message.Header>Please refresh this page after any transaction has been confirmed</Message.Header>
          <p>To get updated houses and offers this page must be refreshed </p>
        </Message>

        <hr />
        <h3>Active Account</h3>
        <AccountData accountIndex="0" units="ether" precision="3" />
        <br />
        <Accordion fluid styled>
          <Accordion.Title active={this.state.activeIndex === 0} index={0} onClick={this.handleClick}>
            <Icon name='dropdown' />
            All Houses For Sale
          </Accordion.Title>
          <Accordion.Content active={this.state.activeIndex === 0}>
            <p>Here you can see all of the houses that are for sale in this contract. To add a house, use the Add House For Sale function below. To put in an offer for a house, record the <strong>House Id</strong> and enter it with your offer price into the <strong>Make Offer</strong> function below.</p>
            <br />
            <Card.Group items={this.state.allHouses} />
          </Accordion.Content>
          <Accordion.Title active={this.state.activeIndex === 1} index={1} onClick={this.handleClick}>
            <Icon name='dropdown' />
            All of my Houses
          </Accordion.Title>
          <Accordion.Content active={this.state.activeIndex === 1}>
            <p>Here you can see all of the houses you have put up for sale, including your houes that have accepted offers, that are ready to close, that have closed or that have been removed. </p>
            <br />
            <Card.Group items={this.state.myHouses} />
          </Accordion.Content>
          <Accordion.Title active={this.state.activeIndex === 2} index={2} onClick={this.handleClick}>
            <Icon name='dropdown' />
            Pending offers on my Houses
          </Accordion.Title>
          <Accordion.Content active={this.state.activeIndex === 2}>
            <p>Here you can see all offers that have been made on your houses <strong>if</strong> the offer hasn't been accepted. To accept an offer, record the <strong>House Id and Offer Id</strong> and enter them into the Accept Offer function below.</p>
            <br />
            <Card.Group items={this.state.pendingOffersOnMyHouses} />
          </Accordion.Content>
          <Accordion.Title active={this.state.activeIndex === 3} index={3} onClick={this.handleClick}>
            <Icon name='dropdown' />
            Offers I've Accepted
          </Accordion.Title>
          <Accordion.Content active={this.state.activeIndex === 3}>
            <p>Here you can see the offers you've accepted. Once an offer has been accepted the buyer has until the closing date to submit all remaining funds to the contract. Once all funds have been submitted and the closing date has passed, the Close Deal function below can be called to transfer the funds automatically to your wallet.</p>
            <br />
            <Card.Group items={this.state.offersIAccepted} />
          </Accordion.Content>
          <Accordion.Title active={this.state.activeIndex === 4} index={4} onClick={this.handleClick}>
            <Icon name='dropdown' />
            Offers I've Made
          </Accordion.Title>
          <Accordion.Content active={this.state.activeIndex === 4}>
            <p>Here you can see the offers you've made on any house as well as the offer's state. This shows if the offer is pending, if it has been accepted and requires funds to be sent, if all funds have been sent and the deal is ready to close, or if the offer has been pulled.</p>
            <br />
            <Card.Group items={this.state.myOffers} />
          </Accordion.Content>
          <Accordion.Title active={this.state.activeIndex === 5} index={5} onClick={this.handleClick}>
            <Icon name='dropdown' />
            My Offers That Have Been Accepted and Require Funding
          </Accordion.Title>
          <Accordion.Content active={this.state.activeIndex === 5}>
            <p>This is an important one! Once your offer has been accepted you have until the closing date to submit all funds to the contract otherwise your deposit will be sent to the seller. To submit the remaining funds, record the <strong>House Id and Remaining Balance ammount</strong> and enter them into the Submit Remaining Funds function below. Once funds are submitted and the closing date has passed the Close Deal function can be called to transfer all funds to the seler and transfer the home ownership to you (**Transferring ownership is not yet a feature**).</p>
            <br />
            <Card.Group items={this.state.myAcceptedOffers} />
          </Accordion.Content>
        </Accordion>



        <hr />
        <Header as='h2' icon textAlign='center'>For Sellers</Header>
        <Grid columns={4} relaxed>
          <Grid.Column>
            <Segment basic>
              <h3>Add House For Sale</h3>
              <ContractForm contract="HouseSale" method="addHouseForSale" labels={['House Address', 'Price (in wei)']} />
              <br/><br/>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment basic>
              <h3>Take Down House</h3>
              <ContractForm contract="HouseSale" method="takeDownHouse" labels={['House Id']} />
              <br/><br/>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment basic>
              <h3>Accept Offer</h3>
              <ContractForm contract="HouseSale" method="acceptOffer" labels={['House Id', 'Offer Id']} />
              <br/><br/>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment basic>
              <h3>Close Deal</h3>
              <ContractForm contract="HouseSale" method="closeDeal" labels={['House Id']} />
              <br/><br/>
            </Segment>
          </Grid.Column>
        </Grid>
        <p>
          <strong>Add House For Sale:</strong> Allows sellers to put a house up for sale by entering the house address and price. <br />
          <strong>Take Down House:</strong> Allows sellers to remove a house for sale as long as they haven't accepted an offer. <br />
          <strong>Accept Offer:</strong> Allows the seller to accept an offer made on their house. <br />
          <strong>Close Deal:</strong> When called, this function transfers the buyers funds to the seller. This can only be called after an offer is accepted, the buyer has submitted all funds to the contract and the closing date has passed. If the buyer hasn't submitted all funds by the closing date the buyers deposit is sent to the seller <br />
        </p>
        <hr />
        <Header as='h2' icon textAlign='center'>For Buyers</Header>
        <Grid columns={3} relaxed>
          <Grid.Column>
            <Segment basic>
              <h3>Make Offer</h3>
              <p>Requires 5000 wei deposit </p>
              <ContractForm contract="HouseSale" method="makeOffer" labels={['House Id', 'Offer (in wei)', 'Days Until Closing']} sendArgs={{value: '5000'}}/>
              <br/><br/>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment basic>
              <h3>Pull Offer</h3>
              <ContractForm contract="HouseSale" method="pullOffer" labels={['Offer Id']} />
              <br/><br/>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment basic>
              <form onSubmit={this.onSubmit}>
                <h3>Submit remaining funds</h3>
                <div>
                  <label> House Id</label>
                  <input
                    value={this.state.id}
                    onChange={event => this.setState({ id: event.target.value })}
                  />
                </div>
                <div>
                  <label> Amount of ether to enter</label>
                  <input
                    value={this.state.value}
                    onChange={event => this.setState({ value: event.target.value })}
                  />
                </div>
                <button>Submit</button>

              </form>
            </Segment>
          </Grid.Column>
        </Grid>
        <p>
          <strong>Make Offer:</strong> Allows a user to bid on a house that is for sale by entering the <strong>houseId</strong>, their offer (in Wei) and the days, after an offer is accepted, until the deal closes and funds are transferred to the seller. To send this transaction the user submits a 5000 wei deposit that is subtracted from the purchase price.  <br />
          <strong>Pull Offer:</strong> Allows the user to remove there offer on a house as long as the offer hasn't been accepted <br />
          <strong>Submit Remaining Funds:</strong> Allows the user to submit all remaining funds (purchase price - deposit). This must be done after an offer is accepted and <strong> before the closing date.</strong> <br />
        </p>

        <hr />
        <Header as='h2' icon textAlign='center'>For Contract Owner</Header>
        <Grid columns={2} relaxed>
          <Grid.Column>
            <Segment basic>
              <h3>Pause the contract</h3>
              <ContractForm contract="HouseSale" method="pause" />
              <br/><br/>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment basic>
              <h3>Unpause the contract</h3>
              <ContractForm contract="HouseSale" method="unpause" />
              <br/><br/>
            </Segment>
          </Grid.Column>
        </Grid>






      </Container>

    );
  }

}

HouseSale.contextTypes = {
  drizzle: PropTypes.object
}

export default HouseSale
