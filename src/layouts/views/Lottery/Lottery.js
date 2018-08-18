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

class Lottery extends Component {
  constructor(props, context) {
    super(props)
    /* Get contract data by accessing the contracts via 'context'. */
    this.contracts = context.drizzle.contracts

    this.state = {
      manager: '',
      players: [],
      balance: '',
      value: '',
      message: ''
    };
  }

  async componentDidMount() {
    const manager = await this.contracts.Lottery.methods.manager().call();
    const players = await this.contracts.Lottery.methods.getPlayers().call();
    const balance = await this.context.drizzle.web3.eth.getBalance(this.contracts.Lottery.options.address);

    this.setState({ manager, players, balance });
  }
  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ message: 'Waiting on transaction success...' });

    await this.contracts.Lottery.methods.enter().send({
      from: this.props.accounts[0],
      value: this.context.drizzle.web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ message: 'You have been entered!' });
  };

  onClick = async () => {

    this.setState({ message: 'Waiting on transaction sucess'});

    await this.contracts.Lottery.methods.pickWinner().send({
      from: this.props.accounts[0],
    });
    this.setState({ message: 'A winner has been picked!' });

  };

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by {this.state.manager}.
          There are currently {this.state.players.length} people entered,
          competing to win {this.context.drizzle.web3.utils.fromWei(this.state.balance, 'ether')} ether!

        </p>

        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label> Amount of ether to enter</label>
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>

        </form>

        <hr />

        <h3>{this.state.message}</h3>

        <hr />

        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick a winner!</button>

        <hr />

        {/* Below not working with metamask
        <p> Or using contract form... To enter the lottery the user must submit 1 ether</p>
        <ContractForm contract="Lottery" method="enter"  sendArgs={{ value: '1000000000000000000'}}/>
        <br/><br/>
        */}

        <hr />
        <p> Time to pick winner </p>
        <ContractForm contract="Lottery" method="pickWinner"/>
        <br/><br/>

      </div>

    );
  }

}

Lottery.contextTypes = {
  drizzle: PropTypes.object
}

export default Lottery
