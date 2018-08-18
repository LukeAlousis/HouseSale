var ComplexStorage = artifacts.require("ComplexStorage");
var Lottery = artifacts.require("Lottery");


module.exports = function(deployer) {
  deployer.deploy(ComplexStorage);
  deployer.deploy(Lottery);


};
