//Goal Here is to generate private key and and a public key and a signature
const { secp256k1 } = require("ethereum-cryptography/secp256k1.js");
const { toHex } = require("ethereum-cryptography/utils.js");
const { keccak256 } = require("ethereum-cryptography/keccak.js");

//Private Key
const privateKey = secp256k1.utils.randomPrivateKey();
//Public Key
const publicKey = secp256k1.getPublicKey(privateKey);
//get Address
const newKey = publicKey.slice(1);
const hashedKey = keccak256(newKey);

console.log(`
--------------------------------KEYS---------------------------------

Private Key - ${toHex(privateKey)}
Public Key - ${toHex(publicKey)}
Address - 0x${toHex(hashedKey.slice(-20))}

---------------------------------------------------------------------
`);

/**
 * 
--------------------------------KEYS---------------------------------

Private Key - a9aa059975e78ff951e34ed7cb506d875a766f9341536dbb38d4d286781d23f4
Public Key - 03ca199b471c37426706bccd2ee09dea1e593fa3bef8ad73438bb93a4750ee128e
Address - 0xbb368a3689b342f1544e9417f942e29fb3411e71

---------------------------------------------------------------------

--------------------------------KEYS---------------------------------

Private Key - d0682700f6d4fde533bc626001755e88e880ba9c8e7f1a6aff8f26e6d9a62be1
Public Key - 03722b66a284617760cbf8572f1b9097304ff2776a9b77dfcaa2cf2739f0ae527e
Address - 0x5793cc24edfd6cd2cc527da4b4f56c11228a2910

---------------------------------------------------------------------

--------------------------------KEYS---------------------------------

Private Key - 925084b4b1e2e8c0527c4dc7d889ff05b5fa14bb4ed288c0a37ece9750739ba7
Public Key - 029ab9dbf227d954316f0924511f62a1f9eaf75012981153fb8fd7f68d9bc3bf59
Address - 0x3699039dd61665db1983328ffc801653a4bf3830

---------------------------------------------------------------------

 */
