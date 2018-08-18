import Lottery from './Lottery'
import { drizzleConnect } from 'drizzle-react'

// May still need this even with data function to refresh component on updates for this contract.
//for more on what the hell this is, check out here: https://github.com/trufflesuite/drizzle
const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    ComplexStorage: state.contracts.Lottery,
    drizzleStatus: state.drizzleStatus,
    web3: state.web3,
    transactionStack: state.transactionStack,
    transactions: state.transactions,
    contracts: state.contracts
  }
}

const LotteryContainer = drizzleConnect(Lottery, mapStateToProps);

export default LotteryContainer
