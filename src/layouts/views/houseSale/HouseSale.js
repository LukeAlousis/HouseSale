/* Home View without the use of drizzle components */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AccountData, ContractData, ContractForm } from 'drizzle-react-components'
import { Card, Container, Grid, Segment, Accordion, Icon, Header } from 'semantic-ui-react'

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

        <h1>HouseSale Contract</h1>
        <h2>Active Account</h2>
        <AccountData accountIndex="0" units="ether" precision="3" />
        <br/><br/>
        <p>

        </p>
        <Accordion fluid styled>
          <Accordion.Title active={this.state.activeIndex === 0} index={0} onClick={this.handleClick}>
            <Icon name='dropdown' />
            All Houses For Sale
          </Accordion.Title>
          <Accordion.Content active={this.state.activeIndex === 0}>
            <Card.Group items={this.state.allHouses} />
          </Accordion.Content>
          <Accordion.Title active={this.state.activeIndex === 1} index={1} onClick={this.handleClick}>
            <Icon name='dropdown' />
            All of my Houses
          </Accordion.Title>
          <Accordion.Content active={this.state.activeIndex === 1}>
            <Card.Group items={this.state.myHouses} />
          </Accordion.Content>
          <Accordion.Title active={this.state.activeIndex === 2} index={2} onClick={this.handleClick}>
            <Icon name='dropdown' />
            Pending offers on my Houses
          </Accordion.Title>
          <Accordion.Content active={this.state.activeIndex === 2}>
            <Card.Group items={this.state.pendingOffersOnMyHouses} />
          </Accordion.Content>
          <Accordion.Title active={this.state.activeIndex === 3} index={3} onClick={this.handleClick}>
            <Icon name='dropdown' />
            Offers I've Accepted
          </Accordion.Title>
          <Accordion.Content active={this.state.activeIndex === 3}>
            <Card.Group items={this.state.offersIAccepted} />
          </Accordion.Content>
          <Accordion.Title active={this.state.activeIndex === 4} index={4} onClick={this.handleClick}>
            <Icon name='dropdown' />
            Offers I've Made
          </Accordion.Title>
          <Accordion.Content active={this.state.activeIndex === 4}>
            <Card.Group items={this.state.myOffers} />
          </Accordion.Content>
          <Accordion.Title active={this.state.activeIndex === 5} index={5} onClick={this.handleClick}>
            <Icon name='dropdown' />
            My Offers That Have Been Accepted and Require Funding
          </Accordion.Title>
          <Accordion.Content active={this.state.activeIndex === 5}>
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
                <button>Enter</button>

              </form>
            </Segment>
          </Grid.Column>
        </Grid>


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
