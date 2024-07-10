import { useState } from "react";
import server from "./server";
import { getPublicKey, hashMessage, signTxn } from "./scripts/functions";
import { toHex } from "ethereum-cryptography/utils";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  // TODO: send the signature to the server
  async function transfer(evt) {
    evt.preventDefault();

    try {
      //Incoming Data for the transfer
      let data = {
        amount: parseInt(sendAmount),
        recipient,
      };
      //sign the hashedData
      const hashedData = hashMessage(JSON.stringify(data));
      console.log("Client-side hashed data:", hashedData);

      const signatureObj = signTxn(
        hashMessage(JSON.stringify(data)),
        privateKey
      );

      const signature = JSON.stringify({
        r: signatureObj.r.toString(16),
        s: signatureObj.s.toString(16),
        recovery: signatureObj.recovery,
      });

      await server.post(
        `send`,
        {
          ...data,
          privateKey,
        },
        {
          headers: {
            signature,
          },
        }
      );
      // setBalance(balance);
      // const {
      //   data: { balance },
      // } = await server.post(`send`, {
      //   sender: address,
      //   amount: parseInt(sendAmount),
      //   recipient,
      // });
      setBalance(balance);
    } catch (ex) {
      console.error(ex);
      // alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
