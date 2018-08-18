/* Home View without the use of drizzle components */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AccountData, ContractData, ContractForm } from 'drizzle-react-components'
//import { Button, Form, FormGroup, Input, Container, Row, Col} from 'reactstrap'
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
      housesForSale: ''
    };
  }

  async componentDidMount() {
    const housesForSale = await this.contracts.HouseSale.methods.housesForSale().call();

    this.setState({ housesForSale });
  }



  render() {
    return (
      <div>
        <h2>HouseSale Contract</h2>
        <p>
          There are currently {this.state.housesForSale} houses for sale,

        </p>
        <h3>Add House For Sale</h3>
            <ContractForm contract="HouseSale" method="addHouseForSale" labels={['House Address', 'Price', 'Deposit Fee']} />
            <br/><br/>

        <hr />

      </div>

    );
  }

}

HouseSale.contextTypes = {
  drizzle: PropTypes.object
}

export default HouseSale
