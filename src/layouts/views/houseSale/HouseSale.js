/* Home View without the use of drizzle components */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AccountData, ContractData, ContractForm } from 'drizzle-react-components'
import { Card, Container, Grid, Segment } from 'semantic-ui-react'

//resources
  //const sigUtil = require("eth-sig-util")
//components
import Header from '../../components/Header'
import Loadable from 'react-loading-overlay'

class HouseSale extends Component {
  constructor(props, context) {
    super(props)
    /* Get contract data by accessing the contracts via 'context'. */
    this.contracts = context.drizzle.contracts

    this.state = {
      housesForSale: '',
      offeredHouseIds: []
    };
  }


  async componentDidMount() {
    const housesForSale = await this.contracts.HouseSale.methods.housesForSale().call();
    const offeredHouseIds = await this.contracts.HouseSale.methods.getHousesForSale().call();
    //const summary = await this.contracts.HouseSale.methods.houses('0').call();
    console.log(offeredHouseIds);
    let summary;
    const items = await Promise.all(offeredHouseIds.map(async address => {
      summary = await this.contracts.HouseSale.methods.houses(address).call();
      console.log(summary);
      return {
        header: summary[0],
        description: 'HouseId' + address,
        fluid: true
      }
    }));


    this.setState({ housesForSale });
    this.setState({ offeredHouseIds });
    this.setState({ items });
    console.log(items);
    console.log(this.contracts.HouseSale.options.address);


  }


  render() {
    return (
      <Container>
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css"></link>

        <h2>HouseSale Contract</h2>
        <h2>Active Account</h2>
        <AccountData accountIndex="0" units="ether" precision="3" />
        <br/><br/>
        <p>
          There are currently {this.state.housesForSale} houses for sale,

        </p>
        <Grid columns={2} relaxed>
          <Grid.Column>
            <Segment basic>
              <h3>Add House For Sale</h3>
              <ContractForm contract="HouseSale" method="addHouseForSale" labels={['House Address', 'Price', 'Deposit Fee']} />
              <br/><br/>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment basic>
              <h3>Submit Offer</h3>
              <br/><br/>
            </Segment>
          </Grid.Column>
        </Grid>



        <hr />
        <ContractForm contract="HouseSale" method="makeOffer" labels={['House Id', 'Offer', 'Days Until Closing']} sendArgs={{value: '5000'}}/>
        <br/><br/>

        <Card.Group items={this.state.items} />

      </Container>

    );
  }

}

HouseSale.contextTypes = {
  drizzle: PropTypes.object
}

export default HouseSale
