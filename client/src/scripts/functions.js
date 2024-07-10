import { keccak256 } from "ethereum-cryptography/keccak";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { utf8ToBytes } from "ethereum-cryptography/utils";

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

const verifySignature = async () => {};

export { getPublicKey, getAddress, hashMessage, signTxn, verifySignature };
