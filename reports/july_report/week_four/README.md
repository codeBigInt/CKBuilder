# Builder Track Report - Week 4

***Name***: Elliot Lucky

***Week Ending***: 24-07-2026

## Courses Completed

- Explored the **ckb-cli UDT (sUDT) Operations Tutorial** to understand how fungible tokens are issued and managed on CKB.
    - How the Simple UDT type script (RFC25) defines only two operations, `issue` and `transfer`, and leaves everything else to lock scripts
    - How the **anyone-can-pay (ACP)** lock script lets a user receive sUDT into a cell without needing to unlock it
    - How the **cheque** lock script allows issuing or transferring sUDT to a recipient who cannot yet provide the CKB capacity for the token cell
    - How the full lifecycle works in practice: issuing sUDT to a cheque address, claiming it into an ACP cell, transferring between ACP cells, and withdrawing unclaimed cheques
- Walked through the tutorial's contract deployment flow, including building `simple_udt`, `anyone_can_pay`, and `ckb-cheque-script` from source and deploying them with the `ckb-cli deploy` subcommand and a `deployment.toml` config.
- Studied the possibilities and constraints of building **decentralized exchanges (DEXes) on CKB**, using the sUDT + lock script model as the token foundation.

## Key Learning

- Understood that CKB deliberately keeps the token standard minimal. sUDT is only a type script that enforces balance rules, and the actual user experience (receiving tokens, gifting tokens, claiming tokens) is composed from lock scripts like ACP and cheque. This separation of type and lock is very different from account-model token standards like ERC-20.
- Learned that CKB capacity is a real design constraint for token UX: every sUDT cell must be backed by CKB capacity, which is exactly why the cheque lock exists — it lets a sender front the capacity so a recipient without CKB can still receive tokens and claim them later.
- Realised that a DEX on CKB cannot simply copy the AMM contract pattern from account-model chains. Because state lives in cells, a naive shared pool cell would become a contention point where only one trade can consume it per transaction, so CKB DEX designs lean toward order-book and intent-based models where each order is its own cell that matchers can aggregate.
- Understood how the pieces I studied fit a DEX flow: sUDT provides the tradable asset, ACP cells give traders a stable receiving address for settlement, and open orders can be expressed as cells locked by an order lock script that anyone can match as long as the trade terms encoded in the cell are satisfied.
- Clarified that this exploration is directly relevant to my broader work on CKB: understanding token issuance, claiming, and settlement flows is a prerequisite for any protocol that needs to move value between users, including reputation-linked or credit-linked settlement in **Veil**.

## Practical Progress

- Worked through the scenarios in the sUDT operations tutorial end to end:
    - Issuing sUDT to a cheque address and claiming it into a newly created empty sUDT ACP cell
    - Issuing sUDT directly to an anyone-can-pay address
    - Transferring claimed sUDT between ACP cells belonging to different addresses
    - Transferring sUDT to a cheque address and exercising both the claim path and the withdraw path
- Mapped out how a CKB DEX would be assembled from the primitives I studied:
    - **Asset layer** — sUDT type script for the traded tokens
    - **Settlement layer** — anyone-can-pay cells so counterparties can receive tokens without co-signing
    - **Order layer** — order cells carrying trade intent (token pair, amount, price) unlockable by any matcher that satisfies the encoded terms
    - **Matching layer** — off-chain matchers or aggregators that collect compatible order cells into a single settlement transaction
- Documented the main open questions from the exploration to follow up on, including how existing CKB DEX implementations handle partial fills, order cancellation, and protection against front-running by matchers.

Reference: https://github.com/nervosnetwork/ckb-cli/wiki/UDT-%28sudt%29-Operations-Tutorial
