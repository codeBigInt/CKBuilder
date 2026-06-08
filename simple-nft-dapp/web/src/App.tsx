import { FormEvent, useEffect, useMemo, useState } from "react";
import { useCcc, useSigner } from "@ckb-ccc/connector-react";
import {
  buildIssuerScript,
  buildCreateIssuerTransaction,
  buildMintTransaction,
  DEFAULT_RPC_URL,
  findOwnedNfts,
  findIssuerState,
  IssuerState,
  OwnedNft,
  shortHex,
} from "./ckb";
import {
  DEFAULT_NFT_IMAGE_URI,
  DEFAULT_NFT_NAME,
  IPFS_GATEWAY_URL,
} from "./config/nft";
import {
  CheckCircle2,
  Copy,
  Database,
  ExternalLink,
  Image,
  Loader2,
  PlusCircle,
  PlugZap,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  SquareStack,
  Wallet,
} from "lucide-react";

const DEFAULT_ISSUER_ARGS = "0x7a83042ddabeb27294fe62588df7acc627d4181f";

export function App() {
  const signer = useSigner();
  const { open, disconnect, wallet } = useCcc();
  const [address, setAddress] = useState("");
  const [issuerArgs, setIssuerArgs] = useState(DEFAULT_ISSUER_ARGS);
  const [maxSupply, setMaxSupply] = useState("100");
  const [issuer, setIssuer] = useState<IssuerState>();
  const [ownedNfts, setOwnedNfts] = useState<OwnedNft[]>([]);
  const [name, setName] = useState(DEFAULT_NFT_NAME);
  const [uri, setUri] = useState(DEFAULT_NFT_IMAGE_URI);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [txHash, setTxHash] = useState("");
  const [isLoadingIssuer, setIsLoadingIssuer] = useState(false);
  const [isLoadingNfts, setIsLoadingNfts] = useState(false);
  const [isCreatingIssuer, setIsCreatingIssuer] = useState(false);
  const [isMinting, setIsMinting] = useState(false);

  const issuerScript = useMemo(() => {
    try {
      return buildIssuerScript(issuerArgs);
    } catch {
      return undefined;
    }
  }, [issuerArgs]);

  const previewImageUrl = useMemo(() => imageUriToUrl(uri), [uri]);

  useEffect(() => {
    let cancelled = false;

    async function loadAddress() {
      if (!signer) {
        setAddress("");
        return;
      }

      const nextAddress = await signer.getRecommendedAddress();
      if (!cancelled) {
        setAddress(nextAddress);
      }
    }

    loadAddress().catch((cause) => setError(errorMessage(cause)));

    return () => {
      cancelled = true;
    };
  }, [signer]);

  async function refreshIssuer() {
    if (!signer || !issuerScript) {
      setIssuer(undefined);
      return;
    }

    setIsLoadingIssuer(true);
    setError("");
    setStatus("Looking for the issuer cell on testnet...");

    try {
      const nextIssuer = await findIssuerState(signer, issuerScript);
      setIssuer(nextIssuer);
      if (nextIssuer) {
        await refreshOwnedNfts(nextIssuer.typeHash);
      } else {
        setOwnedNfts([]);
      }
      setStatus(
        nextIssuer
          ? "Issuer cell loaded."
          : "No live issuer cell found for these args.",
      );
    } catch (cause) {
      setIssuer(undefined);
      setError(errorMessage(cause));
      setStatus("");
    } finally {
      setIsLoadingIssuer(false);
    }
  }

  async function refreshOwnedNfts(typeHash = issuer?.typeHash) {
    if (!signer || !typeHash) {
      setOwnedNfts([]);
      return;
    }

    setIsLoadingNfts(true);

    try {
      setOwnedNfts(await findOwnedNfts(signer, typeHash));
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setIsLoadingNfts(false);
    }
  }

  async function mint(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!signer) {
      open();
      return;
    }

    if (!issuer) {
      await refreshIssuer();
      return;
    }

    setIsMinting(true);
    setError("");
    setTxHash("");
    setStatus("Composing mint transaction...");

    try {
      const { tx, tokenId } = await buildMintTransaction({
        signer,
        issuerState: issuer,
        name,
        uri,
      });
      setStatus(`Waiting for wallet signature for token #${tokenId}...`);
      const hash = await signer.sendTransaction(tx);
      setTxHash(hash);
      setStatus(
        `Mint transaction submitted for token #${tokenId}. Refresh owned NFTs after it is indexed.`,
      );
      await refreshIssuer();
    } catch (cause) {
      setError(errorMessage(cause));
      setStatus("");
    } finally {
      setIsMinting(false);
    }
  }

  async function createIssuer() {
    if (!signer) {
      open();
      return;
    }

    if (!issuerScript) {
      setError("Issuer type args must be valid hex.");
      return;
    }

    setIsCreatingIssuer(true);
    setError("");
    setTxHash("");
    setStatus("Composing issuer setup transaction...");

    try {
      const existingIssuer = await findIssuerState(signer, issuerScript);
      if (existingIssuer) {
        setIssuer(existingIssuer);
        setStatus("Issuer cell already exists.");
        return;
      }

      const tx = await buildCreateIssuerTransaction({
        signer,
        issuerScript,
        maxSupply: Number(maxSupply),
      });

      setStatus("Waiting for wallet signature to create issuer cell...");
      const hash = await signer.sendTransaction(tx);
      setTxHash(hash);
      setStatus("Issuer setup transaction submitted. Refresh after it is indexed.");
    } catch (cause) {
      setError(errorMessage(cause));
      setStatus("");
    } finally {
      setIsCreatingIssuer(false);
    }
  }

  return (
    <main className="shell">
      <section className="hero" aria-label="Simple NFT testnet minter">
        <div className="heroCopy">
          <div className="networkBadge">
            <Sparkles size={16} />
            <span>CKB Testnet</span>
          </div>
          <h1>Simple NFT Minter</h1>
          <p>Script-backed collectibles minted on CKB testnet.</p>
        </div>

        <div className="walletCluster">
          {address ? (
            <>
              <button
                className="walletButton connected"
                onClick={() => navigator.clipboard.writeText(address)}
                title="Copy wallet address"
              >
                <CheckCircle2 size={18} />
                <span>{shortHex(address, 14, 10)}</span>
                <Copy size={16} />
              </button>
              <button className="disconnectButton" onClick={() => disconnect()}>
                Disconnect
              </button>
            </>
          ) : (
            <button className="walletButton" onClick={() => open()}>
              <Wallet size={18} />
              <span>Connect wallet</span>
            </button>
          )}
        </div>
      </section>

      <section className="workspace">
        <aside className="panel previewPanel">
          <div className="nftPreview" aria-label="NFT preview">
            <div className="nftGlow" />
            <div className="nftFrame">
              {previewImageUrl ? (
                <img src={previewImageUrl} alt={name || "NFT preview"} />
              ) : (
                <Image size={42} />
              )}
              <span>{name || "Untitled NFT"}</span>
            </div>
          </div>

          <div className="previewMeta">
            <p className="eyebrow">Preview</p>
            <h2>{name || "Untitled NFT"}</h2>
            <p>{uri || "Metadata URI will appear here."}</p>
          </div>

          <div className="previewChecks">
            <div>
              <ShieldCheck size={18} />
              <span>Issuer-gated mint</span>
            </div>
            <div>
              <Database size={18} />
              <span>On-chain cell data</span>
            </div>
          </div>
        </aside>

        <section className="stack">
          <aside className="panel issuerPanel">
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Issuer</p>
              <h2>Mint authority</h2>
            </div>
            <button
              className="iconButton"
              onClick={refreshIssuer}
              disabled={!signer || isLoadingIssuer || !issuerScript}
              title="Refresh issuer cell"
              aria-label="Refresh issuer cell"
            >
              {isLoadingIssuer ? <Loader2 size={18} /> : <RefreshCw size={18} />}
            </button>
          </div>

          <label className="field">
            <span>Issuer type args</span>
            <input
              value={issuerArgs}
              onChange={(event) => setIssuerArgs(event.target.value)}
              placeholder="0x..."
              spellCheck={false}
            />
          </label>

          <div className="setupGrid">
            <label className="field">
              <span>Initial max supply</span>
              <input
                value={maxSupply}
                onChange={(event) => setMaxSupply(event.target.value)}
                inputMode="numeric"
                min="1"
                placeholder="100"
              />
            </label>
            <button
              className="secondaryButton"
              onClick={createIssuer}
              disabled={isCreatingIssuer || isLoadingIssuer || !!issuer}
              type="button"
            >
              {isCreatingIssuer ? <Loader2 size={18} /> : <PlusCircle size={18} />}
              <span>{issuer ? "Issuer ready" : "Create issuer"}</span>
            </button>
          </div>

          <div className="stats">
            <div>
              <span>Current supply</span>
              <strong>{issuer ? issuer.currentSupply : "-"}</strong>
            </div>
            <div>
              <span>Max supply</span>
              <strong>{issuer ? issuer.maxSupply : "-"}</strong>
            </div>
            <div>
              <span>Next token</span>
              <strong>{issuer ? issuer.currentSupply + 1 : "-"}</strong>
            </div>
          </div>

          <dl className="scriptList">
            <div>
              <dt>Wallet</dt>
              <dd>{wallet?.name || "Not connected"}</dd>
            </div>
            <div>
              <dt>RPC</dt>
              <dd>{DEFAULT_RPC_URL}</dd>
            </div>
            <div>
              <dt>Issuer type hash</dt>
              <dd>{issuer ? shortHex(issuer.typeHash) : "-"}</dd>
            </div>
            <div>
              <dt>Issuer outpoint</dt>
              <dd>
                {issuer
                  ? `${shortHex(issuer.cell.outPoint.txHash)}:${issuer.cell.outPoint.index}`
                  : "-"}
              </dd>
            </div>
          </dl>
          </aside>

          <form className="panel mintPanel" onSubmit={mint}>
          <div className="panelHeader">
            <div>
              <p className="eyebrow">Mint</p>
              <h2>NFT metadata</h2>
            </div>
            <PlugZap size={22} className="panelIcon" />
          </div>

          <label className="field">
            <span>Name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={120}
              required
            />
          </label>

          <label className="field">
            <span>Metadata URI</span>
            <input
              value={uri}
              onChange={(event) => setUri(event.target.value)}
              placeholder={DEFAULT_NFT_IMAGE_URI}
              required
            />
          </label>

          <button
            className="primaryButton"
            disabled={isMinting || isLoadingIssuer || isCreatingIssuer}
          >
            {isMinting ? <Loader2 size={18} /> : <Send size={18} />}
            <span>{signer ? "Mint NFT" : "Connect wallet"}</span>
          </button>

          {(status || error || txHash) && (
            <div className={`statusBox ${error ? "error" : ""}`}>
              {status && <p>{status}</p>}
              {error && <p>{error}</p>}
              {txHash && (
                <div className="txLine">
                  <code>{shortHex(txHash, 16, 12)}</code>
                  <button
                    type="button"
                    className="miniButton"
                    onClick={() => navigator.clipboard.writeText(txHash)}
                  >
                    <Copy size={15} />
                    <span>Copy</span>
                  </button>
                  <a
                    className="miniButton"
                    href={`https://pudge.explorer.nervos.org/transaction/${txHash}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink size={15} />
                    <span>Explorer</span>
                  </a>
                </div>
              )}
            </div>
          )}
          </form>

          <aside className="panel ownedPanel">
            <div className="panelHeader">
              <div>
                <p className="eyebrow">Wallet</p>
                <h2>Owned NFTs</h2>
              </div>
              <button
                className="iconButton"
                onClick={() => refreshOwnedNfts()}
                disabled={!signer || !issuer || isLoadingNfts}
                title="Refresh owned NFTs"
                aria-label="Refresh owned NFTs"
              >
                {isLoadingNfts ? <Loader2 size={18} /> : <RefreshCw size={18} />}
              </button>
            </div>

            {ownedNfts.length > 0 ? (
              <div className="nftList">
                {ownedNfts.map((nft) => (
                  <div className="nftRow" key={`${nft.cell.outPoint.txHash}:${nft.cell.outPoint.index}`}>
                    <div className="nftRowIcon">
                      <SquareStack size={20} />
                    </div>
                    <div>
                      <strong>#{nft.tokenId} {nft.name}</strong>
                      <span>{nft.uri}</span>
                      <code>
                        {shortHex(nft.cell.outPoint.txHash)}:
                        {nft.cell.outPoint.index.toString()}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="emptyState">
                <SquareStack size={22} />
                <span>
                  {issuer
                    ? "No NFT cells found for this wallet and issuer yet."
                    : "Load the issuer first to scan wallet NFTs."}
                </span>
              </div>
            )}
          </aside>
        </section>
      </section>
    </main>
  );
}

function errorMessage(cause: unknown) {
  if (cause instanceof Error) {
    return cause.message;
  }

  return String(cause);
}

function imageUriToUrl(uri: string) {
  const trimmed = uri.trim();

  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("ipfs://")) {
    return `${IPFS_GATEWAY_URL}/${trimmed.slice("ipfs://".length)}`;
  }

  if (/^https?:\/\//.test(trimmed)) {
    return trimmed;
  }

  return "";
}
