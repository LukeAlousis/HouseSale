//var ComplexStorage = artifacts.require("ComplexStorage");
//var Lottery = artifacts.require("Lottery");
var HouseSale = artifacts.require("HouseSale");



module.exports = function(deployer) {
  //deployer.deploy(ComplexStorage);
  //deployer.deploy(Lottery);
  deployer.deploy(HouseSale);



};
