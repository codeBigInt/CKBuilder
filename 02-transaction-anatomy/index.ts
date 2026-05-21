import { ccc } from "@ckb-ccc/core";


const client = new ccc.ClientPublicTestnet();

const tipHeader = await client.getTipHeader();
console.log("Current tip block: #", Number(tipHeader.number));

console.log(`Fetching block details...`);
const block = await client.getBlockByNumber(Number(tipHeader.number));

console.log(`Fetched block details successfully`);

for (let i = 1; i < block?.transactions?.length!; i++) {
  const tx = block?.transactions[i];
  const txHash = tx?.hash();

  console.log(`Transaction: ${txHash}`);

  for (const input of tx?.inputs!) {
    console.log(`Outpoints: ${input.previousOutput.txHash}:${input.previousOutput.index}`);
    console.log(`Since: ${input.since}`);

    const prevTx = await client.getTransaction(input.previousOutput.txHash);
    const cell = prevTx?.transaction.outputs[Number(input.previousOutput.index)];

    console.log(`Capacity: ${cell?.capacity} shannons`);
  }

  for (let i = 0; i < tx?.outputs.length!; i++) {
    const output = tx?.outputs[i];
    const data = tx?.outputsData[i];

    console.log(`Output ${i}:`);
    console.log(`  Capacity: ${output?.capacity} shannons`);
    console.log(`  Lock: ${output?.lock.codeHash}`);
    console.log(`  Type: ${output?.type ? output?.type.codeHash : "none"}`);
    console.log(`  Data: ${data === "0x" ? "(empty)" : data}`);
  }

  // Sum all input capacities
  let totalInputs = 0n;
  for (const input of tx?.inputs!) {
    const prevTx = await client.getTransaction(input.previousOutput.txHash);
    const idx = Number(input.previousOutput.index);
    totalInputs += prevTx?.transaction?.outputs[idx]?.capacity!;
  }

  // Sum all output capacities
  let totalOutputs = 0n;
  for (const output of tx?.outputs!) {
    totalOutputs += output.capacity;
  }

  const fee = totalInputs - totalOutputs;
  console.log(`Fee: ${fee} shannons (${Number(fee) / 1e8} CKB)`);


}

