import { mintTo } from "@solana/spl-token";
require("dotenv").config();
import {getExplorerLink,getKeypairFromEnvironment,} from "@solana-developers/helpers";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
const connection = new Connection(clusterApiUrl("devnet"));

const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);

const user = getKeypairFromEnvironment("SECRET_KEY");

const tokenMintAccount = new PublicKey("7T8MmKqJUxB1XbSGQxBo16ZPsm1CZu9rqaGfepBbxQ7c");

const recipientAssociatedTokenAccount = new PublicKey(
    "HBBktVoKrCJJqPBQX2Aczn9JakCZYra6uRkpmW6W7tSw",
);

const transactionSignature = await mintTo(
    connection,
    user,
    tokenMintAccount,
    recipientAssociatedTokenAccount,
    user,
    100 * MINOR_UNITS_PER_MAJOR_UNITS,
);

const link = getExplorerLink("transaction", transactionSignature, "devnet");

console.log(`✅ Success! Mint Token Transaction: ${link}`);