// import
// main function -> hardhat doesn't need this
// caling main -> hardhat doesn't need this

// function deployFunc() {
//   console.log("hi");
// }
// module.exports.default = deployFunc;

// module.exports = async (hre) => {
// const {getNamedAccounts, deployments} = hre
// }
const { network } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  // you can specify what address to put in the args section using if statements
  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }
  // Mock contracts,
  // if a contract doesn't exist, we deploy a minimal version of it for our  local testing

  // well wat happends when we want to change chains?
  // when going for localhost or hardhat network we want to use a mock
  const args = ethUsdPriceFeedAddress;
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [args], // add price feed address from the right chain,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    //verify
    await verify(fundMe.address, [args]);
  }
  log("-----------------------------------------");
};

module.exports.tags = ["all", "fundme"];
