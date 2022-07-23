import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import InputForm from "./form";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "../utils/constant";

export default function Home() {
  // Component state
  const [currentAccount, setCurrentAccount] = useState("");
  const [memos, setMemos] = useState([]);

  useEffect(() => {
    let buyMeACoffee;
    isWalletConnected();
    getMemos();

    // Create an event handler function for when someone sends
    // us a new memo.
    const onNewMemo = (from, timestamp, name, message) => {
      console.log("Memo received: ", from, timestamp, name, message);
      setMemos((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message,
          name,
        },
      ]);
    };

    const { ethereum } = window;

    // Listen for new memo events.
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      buyMeACoffee = new ethers.Contract(contractAddress, contractABI, signer);

      buyMeACoffee.on("NewMemo", onNewMemo);
    }

    return () => {
      if (buyMeACoffee) {
        buyMeACoffee.off("NewMemo", onNewMemo);
      }
    };
  }, []);

  // Wallet connection logic
  const isWalletConnected = async () => {
    try {
      const { ethereum } = window;
      const accounts = await ethereum.request({ method: "eth_accounts" });
      console.log("accounts: ", accounts);
      if (accounts.length > 0) {
        const account = accounts[0];
        setCurrentAccount(account);
        console.log("wallet is connected! " + account);
      } else {
        console.log("make sure MetaMask is connected");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("please install MetaMask");
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const getMemos = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log("fetching memos from the blockchain..");
        const memos = await buyMeACoffee.getMemos();
        console.log("fetched!");
        setMemos(memos);
      } else {
        console.log("Metamask is not connected");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Buy Haris A Coffee</title>
        <meta name="description" content="tipping app" />
      </Head>

      <main className={styles.main}>
        {!currentAccount ? (
          <div>
            <h1 className={styles.title}>
              <a href="#">Buy Haris A Coffee</a>
            </h1>
            <p className={styles.description}>
              <button className={styles.btn} onClick={connectWallet}>
                Connect Your Wallet
              </button>
            </p>
          </div>
        ) : (
          <div className={styles.mainPage}>
            <InputForm setCurrentAccount={setCurrentAccount} />
            <div className={styles.grid}>
              {memos && memos.length
                ? memos.map((memo) => {
                    return (
                      <a href="#" className={styles.card}>
                        <h2>{memo.name} &rarr;</h2>
                        <p>{memo.message}</p>
                        {/* <p>{memo.timestamp}</p> */}
                      </a>
                    );
                  })
                : null}
            </div>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/MHarisAshfaq"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className={styles.logo}>
            Created by @Haris for Alchemy's Road to Web3!
          </span>
        </a>
      </footer>
    </div>
  );
}
