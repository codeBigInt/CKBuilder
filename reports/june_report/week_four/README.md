# Builder Track Report - Week 4

***Name***: Elliot Lucky

***Week Ending***: 26-06-2026

## Courses Completed

- Continued delving into the `ckb-auth` codebase to understand how Midnight authentication could be added to CKB wallet verification flows.
    - Reviewed how `ckb-auth` separates auth algorithm selection from the lock script that consumes it
    - Studied how signature verification data is passed through witnesses
    - Looked at how hashing-based wallet identities are represented and verified in CKB lock scripts
    - Compared that model with Midnight's privacy-first account model and shielded note flow
- Revisited the architecture of Veil Credit Scoring Protocol and rebuilt the initial v1 design into a clearer v2 architecture.
    - Midnight private state and score updates
    - CKB identity anchors through Spore DOBs
    - Soul-bound identity enforcement on CKB
    - Backend coordination between proof generation, scoring events, and credit decisions
    - User-facing wallet and reputation flow

## Key Learning

- Understood that integrating Midnight directly into `ckb-auth` is not as simple as adding another hashing or signature algorithm. Most `ckb-auth` integrations are built around proving control of a key or hash-derived wallet identity, while Midnight's shielded-note model is designed around privacy-preserving state transitions.
- Identified a major barrier: Midnight removes the interaction model from plain hash-based wallets and moves it toward ZK-based and privacy-preserving wallets. That means a CKB lock script cannot treat a Midnight account like a normal public key wallet without losing the privacy assumptions that make Midnight useful.
- Learned that supporting Midnight-style authentication would likely require a different proof boundary: instead of only verifying a raw signature or hashed identity, the CKB side may need to verify a proof, commitment, or public signal that represents authorization without exposing shielded wallet details.
- Clarified why this matters for Veil: the protocol needs a reputation identity that can be publicly useful on CKB while keeping credit history, score updates, and sensitive user behavior private on Midnight.
- Understood that Veil's v2 architecture needs to separate public identity, private reputation computation, and credit decision authorization more cleanly than the v1 prototype.

## Practical Progress

- Continued reading through the `ckb-auth` implementation and mapped where a Midnight authentication path would need to connect:
    - auth entry point
    - algorithm identifier handling
    - witness parsing
    - public verification material
    - lock script authorization result
- Documented the key blocker for Midnight support: Midnight shielded notes and ZK wallet behavior do not fit neatly into a normal CKB hash/signature wallet verification flow.
- Rebuilt Veil's v1 architecture into a new v2 architecture focused on a stronger separation of responsibilities:
    - **Midnight layer** — manages private reputation state, score accumulators, and ZK-based score updates.
    - **CKB layer** — provides public identity anchors through Spore DOBs and soul-bound ownership enforcement.
    - **Backend layer** — coordinates proofs, indexing, scoring events, challenge generation, and credit decision requests.
    - **Application layer** — gives users a smoother wallet and reputation experience without exposing private credit data.
- Refined the relevance of Veil Reputation Protocol: v2 positions Veil as a privacy-preserving reputation system where users can prove creditworthiness or protocol behavior without publicly leaking their full transaction or repayment history.
- Updated the public project direction around the new v2 architecture in the Veil repository:
    - [codeBigInt/veil-credit-scoring](https://github.com/codeBigInt/veil-credit-scoring)

