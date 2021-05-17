// Take Smart Contracts and deploy them to Blockchain
const Convert = artifacts.require('Convert');
const Token = artifacts.require('Token');

module.exports = async function(deployer) {
	await deployer.deploy(Token);
	const token = await Token.deployed();

	await deployer.deploy(Convert, token.address);
	const convert = await Convert.deployed();

	await token.transfer(convert.address, '1000000000000000000000000');
};
