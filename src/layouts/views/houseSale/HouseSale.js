/* Home View without the use of drizzle components */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AccountData, ContractData, ContractForm } from 'drizzle-react-components'
import { Card } from 'semantic-ui-react'
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

  /*static async getInitialProps() {
    const offeredHouseIds = await this.contracts.HouseSale.methods.getHousesForSale().call();
    console.log(offeredHouseIds);
    return { offeredHouseIds };
  }*/

  async componentDidMount() {
    const housesForSale = await this.contracts.HouseSale.methods.housesForSale().call();
    const offeredHouseIds = await this.contracts.HouseSale.methods.getHousesForSale().call();
    console.log(offeredHouseIds);
    const items = offeredHouseIds.map(address => {
      return {
        header: address,
        description: <a>View Campaign</a>,
        fluid: true
      }
    });
    console.log(items);
    //return <Card.Group items={items} />;


    this.setState({ housesForSale });
    this.setState({ offeredHouseIds });
    this.setState({ items });


  }

  async renderCampaigns() {
    const offeredHouseIds2 = await this.contracts.HouseSale.methods.getHousesForSale().call();
    console.log(offeredHouseIds2);
    const items2 = offeredHouseIds2.map(address => {
      return {
        header: address,
        description: <a>View Campaign</a>,
        fluid: true
      }
    });
    console.log(items2);

  }

  render() {
    return (
      <div>
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css"></link>

        <h2>HouseSale Contract</h2>
        <p>
          There are currently {this.state.housesForSale} houses for sale,

        </p>
        <h3>Add House For Sale</h3>
            <ContractForm contract="HouseSale" method="addHouseForSale" labels={['House Address', 'Price', 'Deposit Fee']} />
            <br/><br/>

        <hr />
        <Card.Group items={this.state.items} />

      </div>

    );
  }

}

HouseSale.contextTypes = {
  drizzle: PropTypes.object
}

export default HouseSale
