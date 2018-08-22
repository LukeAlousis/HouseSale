//const HDWalletProvider = require("truffle-hdwallet-provider")
//const mnemonic = "[YOUR MNEMONIC]"
//to use pk and not mnemonic
var PrivateKeyProvider = require("truffle-privatekey-provider");
const privKey = "AA7F1635378B893F765A89AE8EF55C167DB503929C8E395B9A30D9B4D3068C19"

//latest deployed contract address: 0xdac2ff7c887cd14cde7e6e8411f6b40eba1f3cc1
//on rinkeby
module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: function() {
        //return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/[YOUR INFURA TOKEN HERE]")
        return new PrivateKeyProvider(privKey, 'https://rinkeby.infura.io/v3/95494cec27284b7eadfcc3804d34744d')
      },
      network_id: '4'
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 500
    }
  }
};
