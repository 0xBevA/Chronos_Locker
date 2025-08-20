const { ethers, run } = require('hardhat');
const { setTimeout } = require('timers/promises');
const fs = require('fs');

async function deployNFTContract(artifact, args, uriBase, stream) {
  const Contract = await ethers.getContractFactory(artifact);
  const contract = await Contract.deploy(...args);
  await contract.deployed();
  const output = `new ${artifact} contract deployed to ${contract.address}\n`;
  console.log(output.trim());
  stream.write(output);
  let uri = `${uriBase}${contract.address.toLowerCase()}/`;
  const tx = await contract.updateBaseURI(uri);
  // await setTimeout(10000)
  // await run("verify:verify", {
  //   address: contract.address,
  //   constructorArguments: args,
  // });
  return {
    address: contract.address,
    args: args,
  };
}

async function deployPeriphery(stream, tokenLockers) {
  const wallets = await ethers.getSigners();
  const wallet = wallets[0]; // Use the primary deployer wallet
  const donationAddress = wallet.address;
  const Planner = await ethers.getContractFactory('BatchPlanner');
  const planner = await Planner.deploy();
  await planner.deployed();
  let output = `new planner deployed to ${planner.address}\n`;
  console.log(output.trim());
  stream.write(output);
  const Claimer = await ethers.getContractFactory('ClaimCampaigns');
  const claimer = await Claimer.connect(wallet).deploy(donationAddress, tokenLockers);
  await claimer.deployed();
  output = `new claimer deployed to ${claimer.address}\n`;
  console.log(output.trim());
  stream.write(output);
  await setTimeout(10000);
  await run('verify:verify', {
    address: claimer.address,
    constructorArguments: [donationAddress, tokenLockers],
  });
  await run('verify:verify', {
    address: planner.address,
  });
}

async function verify(address, args) {
  await run('verify:verify', {
    address: address,
    constructorArguments: args,
  });
}

async function deployAll(artifacts, args, uri, network) {
  const stream = fs.createWriteStream('deployed-contracts.txt', { flags: 'w' });
  const verifyArgs = [];
  const lockerAddresses = [];
  const uriBase = `${uri}${network}`;
  for (let i = 0; i < artifacts.length; i++) {
    let v = await deployNFTContract(artifacts[i], args[i], uriBase, stream);
    verifyArgs.push(v);
    lockerAddresses.push(v.address);
  }
  await deployPeriphery(stream, lockerAddresses);
  for (let i = 0; i < verifyArgs.length; i++) {
    await verify(verifyArgs[i].address, verifyArgs[i].args);
  }
  stream.end();
  console.log('Deployed contract addresses saved to deployed-contracts.txt');
}

const artifacts = [
  'TokenVestingPlans',
  'VotingTokenVestingPlans',
  'TokenLockupPlans',
  'VotingTokenLockupPlans',
  'TokenLockupPlans_Bound',
  'VotingTokenLockupPlans_Bound',
];
const args = [
  ['TokenVestingPlans', 'TVP'],
  ['VotingTokenVestingPlans', 'VTVP'],
  ['TokenLockupPlans', 'TLP'],
  ['VotingTokenLockupPlans', 'VTLP'],
  ['Bound-TokenLockupPlans', 'B-TLP'],
  ['Bound-VotingTokenLockupPlans', 'B-VTLP'],
];
const uri = 'https://example.org/';
const network = 'somnia-testnet/';

deployAll(artifacts, args, uri, network);

async function updateBaseURI(artifact, address, uriBase) {
  const Contract = await ethers.getContractFactory(artifact);
  const contract = Contract.attach(address);
  let uri = `${uriBase}${address.toLowerCase()}/`;
  await contract.updateBaseURI(uri);
}

// updateBaseURI('TokenLockupPlans_Bound', '0x06B6D0AbD9dfC7F04F478B089FD89d4107723264', 'https://example.org/');
