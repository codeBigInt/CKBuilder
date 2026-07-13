# Builder Track Report - Week 2

***Name***: Elliot Lucky

***Week Ending***: 10-07-2026

## Courses Completed

- Continued participating in the **Gone in 60seconds Fiber Network Infrastructure Hackathon** and worked with my team to complete **fiber-dev-kit**.
- Deepened my understanding of Fiber Network infrastructure through the practical process of building and testing a developer-focused toolkit.
    - How developers interact with Fiber nodes and supporting services
    - Why configuration, repeatable setup, and useful documentation are important for infrastructure adoption
    - How developer tooling can reduce the barrier to building payment applications on Fiber and CKB
- Completed the rebuild of Veil Credit Scoring Protocol into **Veil Reputation Protocol**.
- Reviewed how the new reputation-focused design can support more use cases than the previous credit-scoring-only architecture.

## Key Learning

- Understood that developer infrastructure should hide unnecessary setup complexity while still giving builders enough control to inspect, configure, and extend the system.
- Learned that a useful dev kit is more than a collection of scripts. It needs a clear developer journey from environment setup to running the infrastructure and testing a working interaction.
- Improved my ability to build collaboratively under pressure by keeping tasks scoped, communicating progress, and helping the team move from an idea to a usable hackathon submission.
- Confirmed that the rebuild from Veil Credit Scoring Protocol to Veil Reputation Protocol gives the project a stronger direction. Creditworthiness becomes one reputation use case instead of the entire protocol.
- Understood that privacy-preserving reputation should allow users to prove specific claims about their behaviour without exposing every event, interaction, or score that contributed to the result.

## Practical Progress

- Completed my participation in the **Gone in 60seconds Fiber Network Infrastructure Hackathon**, where my team built **fiber-dev-kit**.
- Contributed to the development and refinement of the toolkit, helping turn Fiber infrastructure setup into a more approachable workflow for developers building on CKB.
- Worked with the team to test the project, resolve integration and setup issues, improve the developer flow, and prepare the final hackathon submission.
- Completed the rebuild and repositioning of **Veil Reputation Protocol**, previously known as Veil Credit Scoring Protocol.
- Expanded Veil beyond a single credit score so that it can represent different reputation signals while preserving the privacy-first architecture developed in the earlier version.
- Refined the new protocol direction around:
    - privacy-preserving reputation records and updates
    - identity-linked reputation without publicly exposing sensitive activity
    - support for reputation events from multiple protocols and use cases
    - selective reputation proofs for applications that need to make trust-based decisions
- The rebuild now presents Veil as a broader reputation layer where credit history, repayment behaviour, protocol usage, and other trust signals can be proven without revealing the user's full private history.


Github Link: https://github.com/scisamir/fiber-dev-kit
NPM Packages:
--
https://www.npmjs.com/package/@fiber-dev-kit/core
https://www.npmjs.com/package/@fiber-dev-kit/test-client
https://www.npmjs.com/package/@fiber-dev-kit/inspector