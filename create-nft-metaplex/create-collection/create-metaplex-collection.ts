require("dotenv").config();
import {createNft,mplTokenMetadata,} from "@metaplex-foundation/mpl-token-metadata";
import { createGenericFile,generateSigner,keypairIdentity,percentAmount,} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import {getExplorerLink,getKeypairFromEnvironment} from "@solana-developers/helpers";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import { promises as fs } from "fs";
import * as path from "path";

const connection = new Connection(clusterApiUrl("devnet"));

const umi = createUmi(connection);

const user = await getKeypairFromEnvironment("SECRET_KEY");
console.log("Loaded user:", user.publicKey.toBase58());

const umiKeypair = umi.eddsa.createKeypairFromSecretKey(user.secretKey);

umi
    .use(keypairIdentity(umiKeypair))
    .use(mplTokenMetadata())
    .use(irysUploader());

const collectionImagePath = path.resolve(__dirname, "collection.png");

const buffer = await fs.readFile(collectionImagePath);

let file = createGenericFile(buffer, collectionImagePath, {
    contentType: "image/png",
});

const [image] = await umi.uploader.upload([file]);
console.log("image uri:", image);

const uri = await umi.uploader.uploadJson({
    name: "Solana Future Collection",
    symbol: "SF",
    description: "SF is isane!",
    image,
});
console.log("Collection offchain metadata URI:", uri);

const collectionMint = generateSigner(umi);

await createNft(umi, {
    mint: collectionMint,
    name: "Solana Future Collection",
    uri,
    updateAuthority: umi.identity.publicKey,
    sellerFeeBasisPoints: percentAmount(0),
    isCollection: true,
}).sendAndConfirm(umi, { send: { commitment: "finalized" } });

let explorerLink = getExplorerLink(
    "address",
    collectionMint.publicKey,
    "devnet",
);
console.log(`Collection NFT:  ${explorerLink}`);
console.log(`Collection NFT address is:`, collectionMint.publicKey);
console.log("✅ Finished successfully!");