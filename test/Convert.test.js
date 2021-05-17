const Token = artifacts.require('token');
const Convert = artifacts.require('convert');

require('chai')
	.use(require('chai-as-promised'))
	.should();

function tokens(n) {
	return web3.utils.toWei(n, 'ether');
}

contract('Convert', ([deployer, investor]) => {
	let token, convert;
	before(async () => {
		token = await Token.new();
		convert = await Convert.new(token.address);
		await token.transfer(convert.address, tokens('1000000'));
	});

	describe('Convert deployment', async () => {
		it('contract has a name', async () => {
			const name = await token.name();
			assert.equal(name, 'Token');
		});
	});

	describe('Convert deployment', async () => {
		it('contract has a name', async () => {
			const name = await convert.name();
			assert.equal(name, 'Convert instant exchange');
		});
	});

	it('contract has tokens', async () => {
		let balance = await token.balanceOf(convert.address);
		assert.equal(balance.toString(), tokens('1000000'));
	});

	describe('buyTokens()', async () => {
		let result;
		before(async () => {
			result = await convert.buyTokens({
				from: investor,
				value: web3.utils.toWei('1', 'ether'),
			});
		});
		it('Allows user to instantly purchase tokens for a fixed price', async () => {
			let investorBalance = await token.balanceOf(investor);
			assert.equal(investorBalance.toString(), tokens('100'));

			let convertBalance;
			convertBalance = await token.balanceOf(convert.address);
			assert.equal(convertBalance.toString(), tokens('999900'));
			convertBalance = await web3.eth.getBalance(convert.address);
			assert.equal(convertBalance.toString(), web3.utils.toWei('1', 'Ether'));

			const event = result.logs[0].args;
			assert.equal(event.account, investor);
			assert.equal(event.token, token.address);
			assert.equal(event.amount.toString(), tokens('100').toString());
			assert.equal(event.rate.toString(), '100');
		});
	});

	describe('sellTokens()', async () => {
		let result;
		before(async () => {
			await token.approve(convert.address, tokens('100'), { from: investor });
			result = await convert.sellTokens(tokens('100'), { from: investor });
		});
		it('Allows user to instantly sell tokens to "Convert" for a fixed price', async () => {
			let investorBalance = await token.balanceOf(investor);
			assert.equal(investorBalance.toString(), tokens('0'));

			let convertBalance;
			convertBalance = await token.balanceOf(convert.address);
			assert.equal(convertBalance.toString(), tokens('1000000'));
			convertBalance = await web3.eth.getBalance(convert.address);
			assert.equal(convertBalance.toString(), web3.utils.toWei('0', 'Ether'));

			const event = result.logs[0].args;
			assert.equal(event.account, investor);
			assert.equal(event.token, token.address);
			assert.equal(event.amount.toString(), tokens('100').toString());
			assert.equal(event.rate.toString(), '100');

			await convert.sellTokens(tokens('500'), { from: investor }).should.be
				.rejected;
		});
	});
});
