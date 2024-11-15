const { dag4 } = require("@stardust-collective/dag4");
const jsSha256 = require("js-sha256");
const jsSha512 = require("js-sha512");
const EC = require("elliptic");
const axios = require("axios");

const curve = new EC.ec("secp256k1");

const getEncoded = (message) => {
  const coded = JSON.stringify(message);
  return coded;
};

const serialize = (msg) => {
  const coded = Buffer.from(msg, "utf8").toString("hex");
  return coded;
};

const sha256 = (hash) => {
  return jsSha256.sha256(hash);
};

const sha512 = (hash) => {
  return jsSha512.sha512(hash);
};

const sign = async (privateKey, msg) => {
  const sha512Hash = sha512(msg);

  const ecSig = curve.sign(sha512Hash, Buffer.from(privateKey, "hex")); //, {canonical: true});
  return Buffer.from(ecSig.toDER()).toString("hex");
};

const sendDataTransactionsUsingUrls = async (
  globalL0Url,
  metagraphL1DataUrl
) => {

  const walletPrivateKey = dag4.keyStore.generatePrivateKey();
  const account1 = dag4.createAccount();
  account1.loginPrivateKey(walletPrivateKey);

  account1.connect({
    networkVersion: "2.0",
    l0Url: globalL0Url,
    testnet: true,
  });

  const message = {
    captureTime: (new Date()).getTime(),
    imageURL: "https://www.test.image.jpg",
    latitude: "0.0",
    longitude: "0.0",
    rewardAddress: "DAG8gFxJVcCWvkaa1DKKRZyFDaAZTG3sFWjWF4aq" 
  };

  const encoded = getEncoded(message);
  const serializedTx = serialize(encoded);
  const hash = sha256(Buffer.from(serializedTx, "hex"));

  const signature = await sign(walletPrivateKey, hash);

  const publicKey = account1.publicKey;
  const uncompressedPublicKey =
    publicKey.length === 128 ? "04" + publicKey : publicKey;

  const body = {
    value: {
      ...message,
    },
    proofs: [
      {
        id: uncompressedPublicKey.substring(2),
        signature,
      },
    ],
  };
  try {
    console.log(`Transaction body: ${JSON.stringify(body)}`);
    const response = await axios.post(`${metagraphL1DataUrl}/data`, body);
    console.log(`Response: ${JSON.stringify(response.data)}`);
  } catch (e) {
    console.log("Error sending transaction", e);
  }
  return;
};

const sendDataTransaction = async () => {
  const globalL0Url = "http://localhost:9000"; // need replace with actual Global L0 node URL
  const metagraphL1DataUrl = "http://localhost:9400"; // need replace with actual Metagraph L1 data URL

  await sendDataTransactionsUsingUrls(globalL0Url, metagraphL1DataUrl);
};

sendDataTransaction();
