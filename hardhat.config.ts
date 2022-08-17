import "@nomicfoundation/hardhat-toolbox";

module.exports = {
  solidity: "0.8.9",
  networks: {
    rinkeby: {
      url: 'YOUR_INFURA_URL',
      accounts: ['ADDRESS_PRIVATE_KEY']
    }
  }
};