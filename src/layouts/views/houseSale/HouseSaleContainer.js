import HouseSale from './HouseSale'
import { drizzleConnect } from 'drizzle-react'

// May still need this even with data function to refresh component on updates for this contract.
//for more on what the hell this is, check out here: https://github.com/trufflesuite/drizzle
const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    HouseSale: state.contracts.HouseSale,
    drizzleStatus: state.drizzleStatus,
    web3: state.web3,
    transactionStack: state.transactionStack,
    transactions: state.transactions,
    contracts: state.contracts,
  }
}

const HouseSaleContainer = drizzleConnect(HouseSale, mapStateToProps);

export default HouseSaleContainer
