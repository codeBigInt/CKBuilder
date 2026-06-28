// use chrono::{Duration, Utc};
// use thiserror::Error;

// #[derive(Debug, Error)]
// enum PassError {
//     #[error("expired pass: {0}")]
//     Expired(i64),
//     #[error("insufficient funds: {0}")]
//     InsufficientFunds(i32),
//     #[error("pass read error")]
//     ReadError,
// }

// #[derive(Debug)]
// struct SubwayPass {
//     balance: i32,
//     name: String,
//     expiry: i64,
// }

// impl SubwayPass {
//     fn new(balance: i32, name: String, expiry: i64) -> Self {
//         Self {
//             balance,
//             name,
//             expiry,
//         }
//     }
// }

// fn swipe_pass(pass: &mut SubwayPass) -> Result<&mut SubwayPass, PassError> {
//     if pass.name == "Elliot" {
//         Ok(pass)
//     } else {
//         Err(PassError::ReadError)
//     }
// }

// fn use_pass(pass: &mut SubwayPass, cost: i32) -> Result<(), PassError> {
//     if Utc::now().timestamp() > pass.expiry {
//         Err(PassError::Expired(pass.expiry))
//     } else {
//         if pass.balance <= cost {
//             Err(PassError::InsufficientFunds(cost))
//         } else {
//             pass.balance = pass.balance - cost;
//             Ok(())
//         }
//     }
// }

// fn main() {
//     let mut my_sub_pass = SubwayPass::new(
//         200,
//         "Elliot".to_string(),
//         (Utc::now() + Duration::weeks(52)).timestamp(),
//     );

//     let cost = 3;

//     let swipe_result = swipe_pass(&mut my_sub_pass).and_then(|pass| use_pass(pass, cost));
//     match swipe_result {
//         Ok(_) => println!("Pass used successfully: {:?}", my_sub_pass),
//         Err(err) => println!("Error: {:?}", err),
//     }
// }



