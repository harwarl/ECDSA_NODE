const express = require("express");
const app = express();
const cors = require("cors");
const {
  hashMessage,
  verifySignature,
  getAddress,
  getPublicKey,
} = require("./scripts/functions.js");
const { toHex } = require("ethereum-cryptography/utils");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0xbb368a3689b342f1544e9417f942e29fb3411e71": 100,
  "0x5793cc24edfd6cd2cc527da4b4f56c11228a2910": 50,
  "0x3699039dd61665db1983328ffc801653a4bf3830": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  // const { sender, recipient, amount } = req.body;
  const { amount, recipient, privateKey } = req.body;
  const { signature } = req.headers;
  const { r, s, recovery } = JSON.parse(signature);
  const signatureBuffer = {
    r: BigInt(`0x${r}`),
    s: BigInt(`0x${s}`),
    recovery: Number(recovery),
  };

  const hashedData = hashMessage(JSON.stringify({ amount, recipient }));

  const isValid = verifySignature(
    getPublicKey(privateKey),
    signatureBuffer,
    hashedData
  );

  if (isValid) {
    const sender = `0x${toHex(getAddress(getPublicKey(privateKey)))}`;
    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      return res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      return res.send({ balance: balances[sender] });
    }
  } else {
    return res.status(400).send({ message: "Invalid Signature" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
