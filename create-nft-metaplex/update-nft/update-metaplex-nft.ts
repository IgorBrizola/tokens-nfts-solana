require("dotenv").config();
import {fetchDigitalAsset,fetchMetadataFromSeeds,mplTokenMetadata,updateV1,} from "@metaplex-foundation/mpl-token-metadata";
import {getExplorerLink,getKeypairFromEnvironment,getKeypairFromFile,} from "@solana-developers/helpers";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { keypairIdentity, publicKey } from "@metaplex-foundation/umi";
import { Connection, clusterApiUrl } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));

const user = await getKeypairFromEnvironment("SECRET_KEY");

console.log("Loaded user:", user.publicKey.toBase58());

const umi = createUmi(connection.rpcEndpoint).use(mplTokenMetadata());
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
umi.use(keypairIdentity(umiKeypair));

const nftAddress = publicKey("FACQXhdyV2HGYggk3CN8CYyaTvfdRaXot6uktD564MDe");

const initialMetadata = await fetchMetadataFromSeeds(umi, {
    mint: nftAddress,
});
const transaction = await updateV1(umi, {
    mint: nftAddress,
    data: {
        ...initialMetadata,
        name: "Updated Asset",
        symbol: "Updated",
    },
});

await transaction.sendAndConfirm(umi);

const createdNft = await fetchDigitalAsset(umi, nftAddress);

console.log(
    `🆕 NFT updated with new metadata: ${getExplorerLink(
        "address",
        createdNft.mint.publicKey,
        "devnet"
    )}`
);

console.log("✅ Finished successfully!");