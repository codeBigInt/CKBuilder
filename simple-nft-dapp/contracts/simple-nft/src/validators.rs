pub mod nft_validator {
    use ckb_std::{ckb_constants::Source, error::SysError, high_level::{
        load_cell_data, 
        load_cell_type_hash,
        load_script
    }};
    use alloc::vec::Vec;

    const ERROR_INVALID_NFT_DATA: i8 = 1;
    const ERROR_TOO_MANY_NFT_OUTPUT: i8 = 2;
    const ERROR_DATA_CHANGED: i8 = 3;
    const ERROR_INVALID_ISSUER_DATA: i8 = 4;
    const ERROR_MAX_SUPPLY_REACHED: i8 = 5;
    const ERROR_INVALID_TOKEN_ID: i8 = 6;
    const ERROR_INVALID_TYPE_HASH: i8 = 7;
    const ERROR_ISSUER_INPUT_MISSING: i8 = 8;
    const ERROR_ISSUER_OUTPUT_MISSING: i8 = 9;
    const ERROR_INVALID_ARGS: i8 = 10;

    pub fn validate() -> Result<(), i8> {
        let script = load_script().map_err(|_| ERROR_INVALID_ARGS)?;
        let args = script.args().raw_data();

        if args.len() != 32 {
            return Err(ERROR_INVALID_ARGS);
        }

        let issue_type_script: [u8; 32] = args.as_ref().try_into().map_err(|_| ERROR_INVALID_ARGS)?;

        let nft_input = load_cell_data(0, Source::GroupInput).ok();
        let nft_output =
            load_cell_data(0, Source::GroupOutput).map_err(|_| ERROR_INVALID_NFT_DATA)?;

        //Mint Case
        //No input NFT cell, one output NFT cell
        if nft_input.is_none() {
            let token_id = validate_nft_data(&nft_output)?;
            validate_mint_with_issuer(token_id, &issue_type_script)?;
            if load_cell_data(1, Source::GroupOutput).is_ok() {
                return Err(ERROR_TOO_MANY_NFT_OUTPUT);
            }

            return Ok(());
        }

        //Transfer/update case:
        //One input NFT cell, one ouput NFT cell
        let input_data = nft_input.unwrap();
        let _token_id = validate_nft_data(&nft_output)?;

        if input_data != nft_output {
            return Err(ERROR_DATA_CHANGED);
        }

        //Prevent splitting of one NFT into multiple smaller NFT
        if load_cell_data(1, Source::GroupOutput).is_ok() {
            return Err(ERROR_TOO_MANY_NFT_OUTPUT);
        }

        Ok(())
    }

    pub fn validate_nft_data(data: &[u8]) -> Result<u32, i8> {
        if data.len() < 7 {
            return Err(ERROR_INVALID_NFT_DATA);
        }

        let token_id = u32::from_le_bytes([data[0], data[1], data[2], data[3]]);

        if token_id == 0 {
            return Err(ERROR_INVALID_NFT_DATA);
        }

        let name_len = data[4] as usize;

        if name_len == 0 {
            return Err(ERROR_INVALID_NFT_DATA);
        }

        let uri_len_index = 5 + name_len;

        if data.len() < uri_len_index + 2 {
            return Err(ERROR_INVALID_NFT_DATA);
        }

        let uri_len = u16::from_le_bytes([data[uri_len_index], data[uri_len_index + 1]]) as usize;

        if uri_len == 0 {
            return Err(ERROR_INVALID_NFT_DATA);
        }

        let expected_len = 4 + 1 + name_len + 2 + uri_len;

        if data.len() != expected_len {
            return Err(ERROR_INVALID_NFT_DATA);
        }

        Ok(token_id)
    }

    pub fn parse_nft_issuer_data(data: &[u8]) -> Result<(u32, u32), i8> {
        if data.len() != 8 {
            return Err(ERROR_INVALID_ISSUER_DATA);
        }

        let current_supply: u32 = u32::from_le_bytes([data[0], data[1], data[2], data[3]]);

        let max_supply: u32 = u32::from_le_bytes([data[4], data[5], data[6], data[7]]);

        Ok((current_supply, max_supply))
    }

    pub fn validate_mint_with_issuer(token_id: u32, issuer_type_hash: &[u8; 32]) -> Result<(), i8> {
        let issuer_input_data = find_cell_data_by_type_hash(issuer_type_hash, Source::Input)?;
        let issuer_output_data = find_cell_data_by_type_hash(issuer_type_hash, Source::Output)?;

        let (old_supply, old_max_supply) = parse_nft_issuer_data(&issuer_input_data)?;
        let (new_supply, new_max_supply) = parse_nft_issuer_data(&issuer_output_data)?;

        if old_supply >= old_max_supply {
            return Err(ERROR_MAX_SUPPLY_REACHED);
        }
        
        if token_id != old_supply + 1 {
            return Err(ERROR_INVALID_TOKEN_ID);
        }

        if new_supply != old_supply + 1 {
            return  Err(ERROR_INVALID_ISSUER_DATA);
        }

        if new_max_supply != old_max_supply {
            return Err(ERROR_INVALID_ISSUER_DATA);
        }

        Ok(())
    }

    fn find_cell_data_by_type_hash(
        expected_type_hash: &[u8; 32],
        source: Source
    ) -> Result<Vec<u8>, i8>{
        let mut index = 0;

        loop {
            match load_cell_type_hash(index, source) {
                Ok(Some(type_hash)) => {
                    if type_hash == *expected_type_hash {
                        return load_cell_data(index, source)
                        .map_err(|_| ERROR_INVALID_ISSUER_DATA);
                    }
                }
                Ok(None) => {},
                Err(SysError::IndexOutOfBound) => {
                    break;
                }
                Err(_) => {
                    return Err(ERROR_INVALID_TYPE_HASH);
                }
            }

            index += 1;
        }
        
        match source {
            Source::Input => Err(ERROR_ISSUER_INPUT_MISSING),
            Source::Output => Err(ERROR_ISSUER_OUTPUT_MISSING),
            _ => Err(ERROR_INVALID_ISSUER_DATA)
        }
    }
}
