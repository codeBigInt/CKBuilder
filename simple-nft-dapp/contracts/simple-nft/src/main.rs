#![cfg_attr(not(any(feature = "library", test)), no_std)]
#![cfg_attr(not(test), no_main)]

#[cfg(any(feature = "library", test))]
extern crate alloc;

#[cfg(not(any(feature = "library", test)))]
ckb_std::entry!(program_entry);

#[cfg(not(any(feature = "library", test)))]
ckb_std::default_alloc!(16384, 1258306, 64);

mod validators;
use validators::nft_validator;

pub fn program_entry() -> i8 {
    match nft_validator::validate() {
        Ok(_) => 0,
        Err(err) => err,
    }
}