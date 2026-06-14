# Builder Track Report - Week 2

***Name***: Elliot Lucky

***Week Ending***: 12-06-2026

## Courses Completed

- Studied the Spore Protocol and its DOB (Digital Object) standard on CKB
    - How Spore cells encode content and content type using molecule encoding
    - Cluster ownership and how it acts as a collection authority
    - Spore's immutability guarantees and burn-to-destroy lifecycle
- Explored how Midnight Compact handles the public/private boundary
    - How `disclose()` moves private witness data into public transaction context
    - How `persistentCommit` commits private structs to the ledger without exposing their contents
    - How `persistentHash` produces a deterministic public key from private inputs for deduplication
- Reviewed DID (Decentralised Identity) patterns and how they map to on-chain registry designs

## Key Learning

- Understood how `persistentCommit` enables score accumulators and credit scores to be updated through ZK circuits without exposing raw values — only the commitment is visible on the Midnight ledger.
- Understood how a DID registry on Midnight can bind a user's private `veilIdHash` to a public CKB Spore DOB and CKB owner lock hash, creating a crosschain identity anchor where the link between chains is provable but the underlying score state remains private.
- Understood how a soul-bound lock script on CKB enforces non-transferability: by verifying that at least one output in a transaction carries the same lock hash, any attempt to move the DOB to a different lock is rejected at the CKB VM level.

## Practical Progress

- Built **Veil** — a crosschain credit scoring protocol that uses Midnight for private ZK score state and CKB Spore DOBs as public identity anchors:

    **Midnight Compact contract** (`packages/contract/`), deployed to Midnight preview at `115b1fb509025f6d9f7d8976101a31f28014d4b5627f518c5601ed7ef1179cc5`:
    - `Scoring` module — five circuits: `createScoreEntry`, `submitRepaymentEvent`, `submitLiquidationEvent`, `submitProtocolUsageEvent`, `submitDebtStateEvent`. Each event circuit commits updated `ScoreAccumulators` via `persistentCommit`, deduplicates events via `persistentHash`, and enforces monotonic epoch ordering.
    - `DIDRegistry` module — four circuits: `register`, `assertActive`, `rotateVerificationMethod`, `revoke`. Binds `veilIdHash` → active Spore DOB ID + CKB owner lock hash on the Midnight ledger.
    - `Admin` module — issuer and admin management with trust weights per issuer.
    - `CustomStructs` module — `CreditScore`, `ScoreAccumulators`, `Issuer`, `ScoreConfig`, `VeilDidRecord`.

    **CKB `veil_sbt_lock`** Rust script (`veil-ckb-contracts/`):
    - Soul-bound lock that prevents DOB transfer by verifying at least one output carries the same lock hash. Deployed alongside Spore DOBs to enforce identity non-transferability.

    **Backend** (`packages/backend/`):
    - Express REST API with endpoints for score entry creation, scoring event submission, challenge generation, and credit decisions.
    - Midnight proof provider, indexer connection, and MongoDB private state provider for managing contract wallet state.
    - CKB Spore DOB mint intent service that binds a user's `veilIdHash` to their CKB owner lock, and DOB signature verification for challenge-based credit decisions.
    - Asynchronous Midnight transaction queue with job polling (`GET /jobs/:jobId`).

    **UI** (`packages/apps/veil-ui/`):
    - Next.js dashboard with Midnight wallet connector and CKB wallet connector via CCC.
    - Full user flow: join Veil contract → generate Veil ID → create score entry → mint CKB identity DOB → authorize a credit decision by signing a challenge with the CKB wallet.


![veui-ui](./images/Screenshot%202026-06-11%20123217.png)
