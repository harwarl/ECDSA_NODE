import server from "./server";
import { getPublicKey, getAddress } from "./scripts/functions.js";
import { toHex } from "ethereum-cryptography/utils";

function Wallet({
  address,
  balance,
  setBalance,
  setAddress,
  setPrivateKey,
  privateKey,
}) {
  async function onChange(evt) {
    let clear = false;
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    if (privateKey) {
      let publicKey = Uint8Array;
      try {
        publicKey = getPublicKey(privateKey);
      } catch (error) {
        alert("Invalid Private Key -", error.message);
      }
      if (publicKey) {
        let address = "";
        try {
          address = toHex(getAddress(publicKey));
          setAddress(address);
        } catch (error) {
          console.log({ error });
          alert("Invalid Public Key -", error.message);
        }
        setAddress(address);
        if (address) {
          const { data } = await server.get(`balance/0x${address}`);
          console.log({ balance: data.balance });
          setBalance(data.balance);
        } else {
          clear = true;
        }
      } else {
        clear = true;
      }
    } else {
      clear = true;
    }
    if (clear) {
      setAddress("");
      setPrivateKey("");
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Private Key</h1>
      <label>
        Private Key
        <input
          placeholder="Type in your private key"
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>
      <p>Address: 0x{address}</p>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
