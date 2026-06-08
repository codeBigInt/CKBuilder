import { ccc } from "@ckb-ccc/connector-react";
import scripts from "./config/scripts.testnet.json";

type DeployedScriptName = "nft-issuer" | "simple-nft";

type DeployedScript = {
  codeHash: ccc.Hex;
  hashType: ccc.HashType;
  cellDeps: { cellDep: ccc.CellDepLike }[];
};

export type IssuerState = {
  cell: ccc.Cell;
  script: ccc.Script;
  typeHash: ccc.Hex;
  currentSupply: number;
  maxSupply: number;
};

export type OwnedNft = {
  cell: ccc.Cell;
  tokenId: number;
  name: string;
  uri: string;
};

const deployment = scripts as unknown as Record<DeployedScriptName, DeployedScript>;

export const DEFAULT_RPC_URL =
  import.meta.env.VITE_CKB_RPC_URL || "http://127.0.0.1:38114";

export function createTestnetClient(rpcUrl = DEFAULT_RPC_URL) {
  return new ccc.ClientPublicTestnet({ url: rpcUrl });
}

export function buildIssuerScript(args: string) {
  return ccc.Script.from({
    codeHash: deployment["nft-issuer"].codeHash,
    hashType: deployment["nft-issuer"].hashType,
    args: normalizeHex(args),
  });
}

export function buildNftScript(issuerTypeHash: ccc.Hex) {
  return ccc.Script.from({
    codeHash: deployment["simple-nft"].codeHash,
    hashType: deployment["simple-nft"].hashType,
    args: issuerTypeHash,
  });
}

export async function findIssuerState(
  signer: ccc.Signer,
  issuerScript: ccc.Script,
): Promise<IssuerState | undefined> {
  for await (const cell of signer.client.findCellsByType(issuerScript, true, "desc", 10)) {
    const parsed = parseIssuerData(cell.outputData);
    return {
      cell,
      script: issuerScript,
      typeHash: issuerScript.hash(),
      currentSupply: parsed.currentSupply,
      maxSupply: parsed.maxSupply,
    };
  }

  return undefined;
}

export async function buildMintTransaction({
  signer,
  issuerState,
  name,
  uri,
}: {
  signer: ccc.Signer;
  issuerState: IssuerState;
  name: string;
  uri: string;
}) {
  const nextTokenId = issuerState.currentSupply + 1;

  if (issuerState.currentSupply >= issuerState.maxSupply) {
    throw new Error("The issuer max supply has already been reached.");
  }

  const recipient = await signer.getRecommendedAddressObj();
  const nftType = buildNftScript(issuerState.typeHash);
  const tx = ccc.Transaction.from({
    cellDeps: [
      ...deployment["nft-issuer"].cellDeps.map((dep) => dep.cellDep),
      ...deployment["simple-nft"].cellDeps.map((dep) => dep.cellDep),
    ],
  });

  tx.addInput({ previousOutput: issuerState.cell.outPoint });
  tx.addOutput(
    {
      lock: issuerState.cell.cellOutput.lock,
      type: issuerState.script,
      capacity: issuerState.cell.cellOutput.capacity,
    },
    encodeIssuerData(nextTokenId, issuerState.maxSupply),
  );
  tx.addOutput(
    {
      lock: recipient.script,
      type: nftType,
    },
    encodeNftData(nextTokenId, name, uri),
  );

  await tx.completeInputsByCapacity(signer);
  await tx.completeFeeBy(signer);

  return {
    tx,
    tokenId: nextTokenId,
  };
}

export async function findOwnedNfts(
  signer: ccc.Signer,
  issuerTypeHash: ccc.Hex,
): Promise<OwnedNft[]> {
  const recipient = await signer.getRecommendedAddressObj();
  const nftType = buildNftScript(issuerTypeHash);
  const nfts: OwnedNft[] = [];

  for await (const cell of signer.client.findCellsByLock(
    recipient.script,
    nftType,
    true,
    "desc",
    50,
  )) {
    nfts.push({
      cell,
      ...parseNftData(cell.outputData),
    });
  }

  return nfts;
}

export async function buildCreateIssuerTransaction({
  signer,
  issuerScript,
  maxSupply,
}: {
  signer: ccc.Signer;
  issuerScript: ccc.Script;
  maxSupply: number;
}) {
  if (!Number.isInteger(maxSupply) || maxSupply <= 0) {
    throw new Error("Max supply must be a positive integer.");
  }

  const recipient = await signer.getRecommendedAddressObj();
  const tx = ccc.Transaction.from({
    cellDeps: deployment["nft-issuer"].cellDeps.map((dep) => dep.cellDep),
  });

  tx.addOutput(
    {
      lock: recipient.script,
      type: issuerScript,
    },
    encodeIssuerData(0, maxSupply),
  );

  await tx.completeInputsByCapacity(signer);
  await tx.completeFeeBy(signer);

  return tx;
}

export function encodeNftData(tokenId: number, name: string, uri: string) {
  const encoder = new TextEncoder();
  const nameBytes = encoder.encode(name.trim());
  const uriBytes = encoder.encode(uri.trim());

  if (tokenId <= 0 || !Number.isInteger(tokenId)) {
    throw new Error("Token ID must be a positive integer.");
  }

  if (nameBytes.length === 0 || nameBytes.length > 255) {
    throw new Error("Name must be 1 to 255 UTF-8 bytes.");
  }

  if (uriBytes.length === 0 || uriBytes.length > 65_535) {
    throw new Error("URI must be 1 to 65535 UTF-8 bytes.");
  }

  const bytes = new Uint8Array(4 + 1 + nameBytes.length + 2 + uriBytes.length);
  const view = new DataView(bytes.buffer);
  view.setUint32(0, tokenId, true);
  bytes[4] = nameBytes.length;
  bytes.set(nameBytes, 5);
  view.setUint16(5 + nameBytes.length, uriBytes.length, true);
  bytes.set(uriBytes, 7 + nameBytes.length);

  return ccc.hexFrom(bytes);
}

export function parseNftData(data: ccc.Hex) {
  const bytes = ccc.bytesFrom(data);

  if (bytes.length < 7) {
    throw new Error("NFT cell data is too short.");
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const tokenId = view.getUint32(0, true);
  const nameLen = bytes[4];
  const uriLenIndex = 5 + nameLen;

  if (tokenId === 0 || nameLen === 0 || bytes.length < uriLenIndex + 2) {
    throw new Error("NFT cell data is invalid.");
  }

  const uriLen = view.getUint16(uriLenIndex, true);
  const expectedLen = 4 + 1 + nameLen + 2 + uriLen;

  if (uriLen === 0 || bytes.length !== expectedLen) {
    throw new Error("NFT cell data length is invalid.");
  }

  const decoder = new TextDecoder();

  return {
    tokenId,
    name: decoder.decode(bytes.slice(5, uriLenIndex)),
    uri: decoder.decode(bytes.slice(uriLenIndex + 2)),
  };
}

export function parseIssuerData(data: ccc.Hex) {
  const bytes = ccc.bytesFrom(data);

  if (bytes.length !== 8) {
    throw new Error("Issuer cell data must be exactly 8 bytes.");
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  return {
    currentSupply: view.getUint32(0, true),
    maxSupply: view.getUint32(4, true),
  };
}

export function encodeIssuerData(currentSupply: number, maxSupply: number) {
  const bytes = new Uint8Array(8);
  const view = new DataView(bytes.buffer);
  view.setUint32(0, currentSupply, true);
  view.setUint32(4, maxSupply, true);
  return ccc.hexFrom(bytes);
}

export function normalizeHex(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "0x" as ccc.Hex;
  }

  return ccc.hexFrom(trimmed.startsWith("0x") ? trimmed : `0x${trimmed}`);
}

export function shortHex(value: string, front = 10, back = 8) {
  if (value.length <= front + back) {
    return value;
  }

  return `${value.slice(0, front)}...${value.slice(-back)}`;
}
