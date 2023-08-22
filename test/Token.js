const { expect } = require ('chai');
const { ethers } = require ('hardhat');
const tokens = (n) => {
	return ethers.utils.parseUnits(n.toString(), 'ether')
}
describe('Token', () => {
	let token,
		accounts,
		deployer,
		receiver
	
	beforeEach(async () => {
		const Token = await ethers.getContractFactory('Token')
		token = await Token.deploy('Dapp University', 'DAPP', 1000000)

		accounts = await ethers.getSigners()
		emptyAddress = '0x0000000000000000000000000000000000000000'
		deployer = accounts[0]
		receiver = accounts[1]
		exchange = accounts[2]
	})
	
	describe('Deployment', () => {
		const name = 'Dapp University'
		const symbol = 'DAPP'
		const totalSupply = tokens('1000000')
		it('has correct name', async () => {
			expect(await token.name()).to.equal(name)
		})
		it('has correct symbol', async () => {
			expect(await token.symbol()).to.equal(symbol)
		})
		it('has correct decimals', async () => {
			expect(await token.decimals()).to.equal('18')
		})
		it('has correct total supply', async () => {
			expect(await token.totalSupply()).to.equal(totalSupply)
		})
		it('assigns total supply to deployer', async () => {
			expect(await token.balanceOf(deployer.address)).to.equal(totalSupply)
		})
	})
	
	describe('Sending Token', () => {
		let amount,
		 	transaction,
		 	result,
		 	event
	 	describe("Success", () => {
	 		beforeEach(async () =>{
				amount = tokens(100)
				transaction = await token.connect(deployer).transfer(receiver.address, amount)
				result = await transaction.wait()
			})
			it('transfers token balances', async () => {	
				expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900))
				expect(await token.balanceOf(receiver.address)).to.equal(amount)
			})
			it('emits a transfer event', async () => {
				event = result.events[0]
				expect(event.event).to.equal("Transfer")
				expect(event.args['from']).to.equal(deployer.address)
				expect(event.args['to']).to.equal(receiver.address)
				expect(event.args['value']).to.equal(amount)
			})
	 	})
	 	describe('Failure', () => {
			it('rejects insufficient balances', async () => {
				const invalidAmount = tokens(100000000)
				await expect(token.connect(deployer).transfer(receiver.address, invalidAmount)).to.be.reverted
			})
			it('rejects invalid recipent', async () => {
				await expect(token.connect(deployer).transfer(emptyAddress, amount)).to.be.reverted
			})
	 	})
	})

	describe('Approving Tokens', () => {
		let amount,
		 	transaction,
		 	result,
		 	event
		beforeEach(async () => {
			amount = tokens(100)
			transaction = await token.connect(deployer).approve(exchange.address, amount)
			result = await transaction.wait()
		})
		describe('Success', () => {
			it('allocates an allowance for delegated token spending', async () => {
				expect(await token.allowance(deployer.address, exchange.address)).to.equal(amount)
			})
			it('emits and approval event', async () => {
				event = result.events[0]
				expect(event.event).to.equal("Approval")
				expect(event.args['owner']).to.equal(deployer.address)
				expect(event.args['spender']).to.equal(exchange.address)
				expect(event.args['value']).to.equal(amount)
			})
		})
		describe('Failure', () => {
			it('rejects invalid spender', async () => {
				await expect(token.connect(deployer).approve(emptyAddress, amount)).to.be.reverted
			})
		})
	})
})