import { ccc } from "@ckb-ccc/core";

//Creates a client connected to the CKB Testnet
//This connects to a public RPC endpoint automatically

const client = new ccc.ClientPublicTestnet()

//Verify the  connection by fetching the latest block number
const tip = await client.getTip();

console.log(`Connected! Current block height: ${tip}`);


//Build a lock script to search for
//This uses the defualt SECP256K1-BLAKE160 lock with testnet args
//NB: Cells are searched for onchain using the lockscript
const lockscritpt: ccc.ScriptLike = {
  codeHash: "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
  hashType: "type",
  args: "0xe2fa82e70b062c8644b80ad7ecf6e015e5f352f6"
}

//find the cell by lock script
// NB: findCellByLock is used to find cells. It returns an asyn generator
for await (const cell of client.findCellsByLock(lockscritpt)) {
  console.log("Capacity: ", shannonsToCKB(cell.cellOutput.capacity));

  console.log("Hash type script: ", cell.cellOutput.type ?? null);
  console.log("Data length: ", cell.outputData, "bytes");
}

// Convert shannons to CKBytes for display
function shannonsToCKB(shannons: bigint): string {
  const whole = shannons / 100_000_000n;
  const frac = shannons % 100_000_000n;
  return frac === 0n
    ? `${whole} CKB`
    : `${whole}.${frac.toString().padStart(8, "0").replace(/0+$/, "")} CKB`;
}
