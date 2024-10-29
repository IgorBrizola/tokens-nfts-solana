require("dotenv").config()
import {getExplorerLink,getKeypairFromEnvironment,} from "@solana-developers/helpers";
import {Connection,PublicKey,clusterApiUrl} from "@solana/web3.js";
import { approve, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";

const DEVNET_URL = clusterApiUrl("devnet");
const TOKEN_DECIMALS = 2;
const DELEGATE_AMOUNT = 50;
const MINOR_UNITS_PER_MAJOR_UNITS = 10 ** TOKEN_DECIMALS;

const connection = new Connection(DEVNET_URL);
const user = getKeypairFromEnvironment("SECRET_KEY");

console.log(`🔑 Loaded keypair. Public key: ${user.publicKey.toBase58()}`);

const delegatePublicKey = new PublicKey("DEFa35HjPw5NaktALDQikuT64ArMAtLzuz62zh9ywZsm");

const tokenMintAddress = new PublicKey("7T8MmKqJUxB1XbSGQxBo16ZPsm1CZu9rqaGfepBbxQ7c");

try {

    const userTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        user,
        tokenMintAddress,
        user.publicKey,
    );

    const approveTransactionSignature = await approve(
        connection,
        user,
        userTokenAccount.address,
        delegatePublicKey,
        user.publicKey,
        DELEGATE_AMOUNT * MINOR_UNITS_PER_MAJOR_UNITS,
    );

    const explorerLink = getExplorerLink(
        "transaction",
        approveTransactionSignature,
        "devnet",
    );

    console.log(`✅ Delegate approved. Transaction: ${explorerLink}`);
} catch (error) {
    console.error(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
    );
}