const { keccak256 } = require("ethereum-cryptography/keccak");
const { secp256k1, ecdsaRecover } = require("ethereum-cryptography/secp256k1");
const { sha256 } = require("ethereum-cryptography/sha256");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");

// Get Public Key from Private Key
const getPublicKey = (privateKey) => {
  return secp256k1.getPublicKey(privateKey);
};

// Get Address From Public Key
const getAddress = (publicKey) => {
  const bytes = publicKey.slice(1);
  const hashedKey = keccak256(bytes);
  return hashedKey.slice(-20);
};

// Hash message
const hashMessage = (message) => {
  const msgbytes = utf8ToBytes(message);
  return keccak256(msgbytes);
};

const signTxn = (hashedMessage, privateKey) => {
  return secp256k1.sign(hashedMessage, privateKey);
};

const verifySignature = (publicKey, signature, messageHash) => {
  return secp256k1.verify(signature, messageHash, toHex(publicKey));
};

//recover public key takes in the stringify signature and the messageHash
const recoverPublicKey = (signature, messageHash) => {
  const { r, s, recovery } = JSON.parse(signature);
  const signatureBuffer = Buffer.concat([
    Buffer.from(r, "hex"),
    Buffer.from(s, "hex"),
  ]);
  const publicKeyBuffer = ecdsaRecover(signatureBuffer, recovery, messageHash);
  return publicKeyBuffer;
};

module.exports = {
  getPublicKey,
  getAddress,
  hashMessage,
  signTxn,
  verifySignature,
  recoverPublicKey,
};
