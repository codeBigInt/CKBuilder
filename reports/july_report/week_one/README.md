# Builder Track Report - Week 1

***Name***: Elliot Lucky

***Week Ending***: 03-07-2026

## Courses Completed

- Participated in the **Gone in 60seconds Fiber Network Infrastructure Hackathon** with my team.
- Studied the Fiber Network architecture and how it brings payment channel functionality to the CKB ecosystem.
    - How off-chain payment channels allow users to make faster transactions without recording every payment directly on-chain
    - How channel opening, funding, payment routing, and settlement fit together
    - How Fiber uses CKB as the settlement and security layer for off-chain payments
- Explored the current developer experience around running Fiber nodes and building applications that interact with the network.
- Revisited the direction of Veil Credit Scoring Protocol and started restructuring the project into **Veil Reputation Protocol**.

## Key Learning

- Understood that infrastructure is only useful to developers when the setup process is clear and repeatable. Running a node, configuring the environment, connecting to RPC services, and testing payment flows should not require every developer to rediscover the same steps.
- Gained a better understanding of how Fiber improves payment scalability on CKB by keeping repeated interactions off-chain while still allowing final settlement on CKB.
- Learned the importance of working closely with a team during a time-limited hackathon. We had to quickly divide responsibilities, communicate blockers, and keep the project focused on something developers could actually use.
- Clarified that Veil should not be limited to traditional credit scoring. Reputation can also represent repayment behaviour, protocol usage, contribution history, and other forms of trust while still preserving sensitive user data.

## Practical Progress

- Worked with my team to begin building **fiber-dev-kit**, a developer kit focused on making Fiber Network infrastructure easier to set up, understand, and use during the Gone in 60seconds hackathon.
- Helped shape the developer experience around the project so that builders can spend less time dealing with infrastructure setup and more time experimenting with Fiber-powered applications.
- Contributed to the hackathon workflow through technical research, implementation discussions, testing, and coordination with the team under the short delivery timeline.
- Began rebuilding Veil Credit Scoring Protocol as **Veil Reputation Protocol**, with a broader focus on privacy-preserving reputation instead of only producing a credit score.
- Started reorganising the protocol direction around clearer responsibilities:
    - private reputation data and computation
    - public identity and verification
    - reputation events from different protocols
    - selective proof of reputation without exposing a user's complete history

Github Link: https://github.com/scisamir/fiber-dev-kit