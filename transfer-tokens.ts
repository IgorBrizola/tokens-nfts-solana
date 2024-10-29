require("dotenv").config();
import {getExplorerLink,getKeypairFromEnvironment,} from "@solana-developers/helpers";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
const connection = new Connection(clusterApiUrl("devnet"));

const sender = getKeypairFromEnvironment("SECRET_KEY");

console.log(
    `🔑 Loaded our keypair securely, using an env file! Our public key is: ${sender.publicKey.toBase58()}`,
);

const recipient = new PublicKey("DEFa35HjPw5NaktALDQikuT64ArMAtLzuz62zh9ywZsm");

const tokenMintAccount = new PublicKey("7T8MmKqJUxB1XbSGQxBo16ZPsm1CZu9rqaGfepBbxQ7c");

const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);

console.log(`💸 Attempting to send 1 token to ${recipient.toBase58()}...`);

const sourceTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    sender,
    tokenMintAccount,
    sender.publicKey,
);

const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    sender,
    tokenMintAccount,
    recipient,
);

const signature = await transfer(
    connection,
    sender,
    sourceTokenAccount.address,
    destinationTokenAccount.address,
    sender,
    1 * MINOR_UNITS_PER_MAJOR_UNITS,
);

const explorerLink = getExplorerLink("transaction", signature, "devnet");

console.log(`✅ Transaction confirmed, explorer link is: ${explorerLink}`);