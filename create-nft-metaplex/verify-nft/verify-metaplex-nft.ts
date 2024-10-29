require("dotenv").config();
import { findMetadataPda, mplTokenMetadata, verifyCollectionV1, } from "@metaplex-foundation/mpl-token-metadata";
import { keypairIdentity, publicKey, publicKey as UMIPublicKey, } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { getExplorerLink, getKeypairFromEnvironment } from "@solana-developers/helpers";
import { clusterApiUrl, Connection } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));

const user = await getKeypairFromEnvironment("SECRET_KEY");

console.log("Loaded user:", user.publicKey.toBase58());

const collectionAddress = publicKey("Bn79uPocescc4gwQP3ZskWa76m9sxub8saMiQAP67FkY");

const nftAddress = publicKey("FACQXhdyV2HGYggk3CN8CYyaTvfdRaXot6uktD564MDe");

const umi = createUmi(connection.rpcEndpoint).use(mplTokenMetadata());
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
umi.use(keypairIdentity(umiKeypair));

const transaction = await verifyCollectionV1(umi, {
    metadata: findMetadataPda(umi, { mint: nftAddress }),
    collectionMint: collectionAddress,
    authority: umi.identity,
});

transaction.sendAndConfirm(umi);

console.log(
    `✅ NFT ${nftAddress} verified as member of collection ${collectionAddress}! See Explorer at ${getExplorerLink(
        "address",
        nftAddress,
        "devnet"
    )}`
);

console.log("✅ Finished successfully!");