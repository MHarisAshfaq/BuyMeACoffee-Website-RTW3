import React, { useState } from "react";
import {
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  FormText,
} from "reactstrap";
import { ethers } from "ethers";
import styles from "../styles/Home.module.css";
import { contractAddress, contractABI } from "../utils/constant";

const InputForm = ({ setCurrentAccount }) => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const onMessageChange = (event) => {
    setMessage(event.target.value);
  };
  const buyCoffee = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        const coffeeTxn = await buyMeACoffee.buyCoffee(
          name ? name : "anon",
          message ? message : "Enjoy your coffee!",
          { value: ethers.utils.parseEther("0.001") }
        );

        await coffeeTxn.wait();

        console.log("mined ", coffeeTxn.hash);

        console.log("coffee purchased!");

        // Clear the form fields.
        setName("");
        setMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const disconnectWallet = async () => {
    console.log("disconnectWallet");
    try {
      const { ethereum } = window;
      if (ethereum.isConnected) {
        await ethereum.request({
          method: "eth_requestAccounts",
          params: [{ eth_accounts: {} }],
        });
        setCurrentAccount("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.title}>
        <a href="#">Buy Haris A Coffee</a>
      </h1>

      <Form className={styles.form}>
        <FormGroup row>
          <Label for="name" sm={2}>
            Name
          </Label>
          <Col sm={10}>
            <Input
              id="name"
              name="name"
              placeholder="name"
              type="text"
              value={name}
              onChange={(e) => onNameChange(e)}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="message" sm={2}>
            Message
          </Label>
          <Col sm={10}>
            <Input
              id="message"
              name="message"
              type="textarea"
              value={message}
              onChange={(e) => onMessageChange(e)}
            />
          </Col>
        </FormGroup>
        <FormGroup check row>
          <Col>
            <Button className={styles.btnAction} onClick={buyCoffee}>
              Send
            </Button>
            <Button className={styles.btnAction} onClick={disconnectWallet}>
              Disconnect
            </Button>
          </Col>
          <FormText>Send 1 Coffee for 0.01ETH</FormText>
        </FormGroup>
      </Form>
    </div>
  );
};

export default InputForm;
