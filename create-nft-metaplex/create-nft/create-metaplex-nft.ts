require("dotenv").config();
import { createNft, mplTokenMetadata} from "@metaplex-foundation/mpl-token-metadata";
import { createGenericFile,generateSigner, keypairIdentity, percentAmount, publicKey as UMIPublicKey,} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import {getExplorerLink,getKeypairFromEnvironment} from "@solana-developers/helpers";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import { promises as fs } from "fs";
import * as path from "path";


const connection = new Connection(clusterApiUrl("devnet"));

const user = await getKeypairFromEnvironment("SECRET_KEY");

console.log("Loaded user:", user.publicKey.toBase58());

const umi = createUmi(connection);

const umiKeypair = umi.eddsa.createKeypairFromSecretKey(user.secretKey);

umi
    .use(keypairIdentity(umiKeypair))
    .use(mplTokenMetadata())
    .use(irysUploader());

const collectionNftAddress = UMIPublicKey("Bn79uPocescc4gwQP3ZskWa76m9sxub8saMiQAP67FkY");

const NFTImagePath = path.resolve(__dirname, "create-nft-metaplex/img/nft.png");

const buffer = await fs.readFile(NFTImagePath);
let file = createGenericFile(buffer, NFTImagePath, {
    contentType: "image/png",
});

const [image] = await umi.uploader.upload([file]);
console.log("image uri:", image);

const uri = await umi.uploader.uploadJson({
    name: "IG NFT",
    symbol: "IG",
    description: "IG NFT Description",
    image,
});
console.log("NFT offchain metadata URI:", uri);

const mint = generateSigner(umi);

await createNft(umi, {
    mint,
    name: "My NFT",
    symbol: "MN",
    uri,
    updateAuthority: umi.identity.publicKey,
    sellerFeeBasisPoints: percentAmount(0),
    collection: {
        key: collectionNftAddress,
        verified: false,
    },
}).sendAndConfirm(umi, { send: { commitment: "finalized" } });

let explorerLink = getExplorerLink("address", mint.publicKey, "devnet");
console.log(`Token Mint:  ${explorerLink}`);