# Chronos Locker

Chronos Locker provides smart contracts for token lockup and vesting plans, designed for responsible token allocations to investors, employees, and contributors. This repository contains the EVM-compatible smart contracts for the Somnia Network.

The plans lock up ERC20 tokens and mint an ERC721 token to the recipient, representing their right to unlock those tokens over time. The vesting and unlocking schedules are linear and periodic, based on seconds, allowing for flexible frequencies (per second, day, week, etc.).

Key features include:
-   **Start Dates:** Set a start date for the unlocking/vesting process, which can be in the past or future.
-   **Cliff Dates:** Define a cliff date for when the first portion of tokens can be redeemed.
-   **Revocable Vesting Plans:** A Vesting Admin can revoke plans if a beneficiary's relationship with the organization ends (e.g., an employee leaves).
-   **Non-Revocable Lockup Plans:** Lockup plans are non-revocable but are transferable by default.
-   **Partial Redemption:** Ability to redeem a portion of the unlocked tokens, rather than the entire available amount.
-   **Plan Segmentation:** Break up lockup plans into smaller segments and recombine them, useful for secondary markets.

## Contracts Overview

The following contracts are the primary points of interaction for users:

-   **TokenVestingPlans.sol:** Vesting plans.
-   **TokenLockupPlans.sol:** Lockup plans (NFTs are transferable).
-   **TokenLockupPlans_Bound.sol:** Lockup plans (NFTs are not transferable).
-   **BatchPlanner.sol:** A utility contract for creating multiple vesting or lockup plans in a single transaction.

## Repository Navigation

All smart contracts are located in the `./contracts` folder. The core contracts are in the `./contracts/LockupPlans` and `./contracts/VestingPlans` folders. Shared logic for storage, URI administration, and other functionalities is in `./contracts/sharedContracts`.

## Testing

To run the tests, first clone the repository and install the dependencies:

```bash
npm install
npx hardhat compile
npx hardhat test
```

## Deployment

To deploy the contracts to the Somnia Network, create a `.env` file with your private key and the Somnia RPC URL. Then, run the deployment script:

```bash
npx hardhat run scripts/deploy.js --network somnia-testnet
