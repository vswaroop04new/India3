import { Polybase } from "@polybase/client";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import crypto from "crypto";
import axios from "axios";
import { ethers } from "ethers";

dotenv.config();

const router = express.Router();

const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "manager",
        type: "address",
      },
    ],
    name: "addRegMan",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "rm_check",
        type: "address",
      },
    ],
    name: "getManagerStatus",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const contractAddress = "0x228cff58a93607d12afecc61e18353a17674f9ce";

const provider = new ethers.providers.JsonRpcProvider(
  "https://eth-goerli.g.alchemy.com/v2/VETlCJVRsg0x1fuFN8xeJnW_uT9BY2iu"
);

const privateKey = process.env.PRIVATE_KEY || ""; // the private key of the account to use
const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(contractAddress, abi, wallet);

const db = new Polybase({
  defaultNamespace:
    "pk/0x41b5b5b941be1a0090db22319afda206d9f6ecb06a1e3de2187588f276ac097c7d6c5cce5bb5f69c61254ca82a712c4428b03efc6d48c99aa99d2afbe1371258/India-3",
});

const collectionReference = db.collection("User");

const listRecords = async (req: Request, res: Response) => {
  try {
    const records = await collectionReference.get();
    records.data.forEach(function (obj: any) {
      console.log(obj.data.demohash);
      console.log(obj.data.id);
    });
    res.status(201).json({
      success: true,
      response: records,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

async function addAndHash(adhaarNum: string, pin: string): Promise<string> {
  const result = parseInt(adhaarNum) + parseInt(pin);
  const sha256Hash = crypto
    .createHash("sha256")
    .update(result.toString())
    .digest("hex");
  const bytes32Hash = Buffer.from(sha256Hash, "hex");
  return "0x" + bytes32Hash.toString("hex");
}

async function concatenateAndHash(
  name: string,
  city: string,
  dob: string
): Promise<string> {
  const concatenatedString = name + city + dob;
  const sha256Hash = crypto
    .createHash("sha256")
    .update(concatenatedString)
    .digest("hex");
  const bytes32Hash = Buffer.from(sha256Hash, "hex");
  return "0x" + bytes32Hash.toString("hex");
}

const addTodb = async (req: Request, res: Response) => {
  const { address, adhaarNum, pin, name, city, dob } = req.body;
  contract
    .getManagerStatus(address)
    .then(async (isManager: boolean) => {
      if (isManager) {
        const id = await addAndHash(adhaarNum, pin);
        const demohash = await concatenateAndHash(name, city, dob);
        const response = await db.collection("User").create([id, demohash]);
        res.status(201).json({
          success: true,
          response: response,
          id: id,
          demohash: demohash,
        });
      } else {
        res.status(401).json({
          success: false,
          error: "You are not a registered manager",
        });
      }
    })
    .catch((error: any) => {
      res.status(500).json({
        success: false,
        error: error.message,
        message: "May be You are not a registered manager",
      });
    });
};

const Verify = async (req: Request, res: Response) => {
  try {
    const { adhaarNum, pin, name, city, dob, sender } = req.body;
    const idtocheck = await addAndHash(adhaarNum, pin);
    const demohashtocheck = await concatenateAndHash(name, city, dob);
    const query = `
      {uidVerifies(first: 10) {sender Upin hash }}
    `;
    const apiUrl =
      "https://api.thegraph.com/subgraphs/name/r4j4t-singh/india3-v5";
    axios
      .post(apiUrl, { query })
      .then(async (response) => {
        const data = response.data.data.uidVerifies;
        let found = false;
        data.forEach(async (item: any) => {
          if (
            item.sender === sender &&
            !found &&
            item.hash === demohashtocheck &&
            item.Upin === idtocheck
          ) {
            found = true;
            const records = await collectionReference.get();
            records.data.forEach(function (obj: any) {
              if (
                obj.data.id === idtocheck &&
                obj.data.demohash === demohashtocheck
              ) {
                res.json({
                  success: true,
                  data: "Verified",
                });
              }
            });
          }
        });
      })
      .catch((error: any) => {
        console.error(error);
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

const addTodb2 = async (req: Request, res: Response) => {
  const { address, adhaarNum, pin, name, city, dob } = req.body;
  contract
    .getManagerStatus(address)
    .then(async (isManager: boolean) => {
      if (isManager) {
        const id = await addAndHash(adhaarNum, pin);
        const demohash = await concatenateAndHash(name, city, dob);
        const response = await db.collection("Pan").create([id, demohash]);
        res.status(201).json({
          success: true,
          response: response,
          id: id,
          demohash: demohash,
        });
      } else {
        res.status(401).json({
          success: false,
          error: "You are not a registered manager",
        });
      }
    })
    .catch((error: any) => {
      res.status(500).json({
        success: false,
        error: error.message,
        message: "May be You are not a registered manager",
      });
    });
};

const Verify2 = async (req: Request, res: Response) => {
  try {
    const { adhaarNum, pin, name, city, dob, sender } = req.body;
    const idtocheck = await addAndHash(adhaarNum, pin);
    const demohashtocheck = await concatenateAndHash(name, city, dob);
    const query = `
      {uidVerifies(first: 10) {sender Upin hash }}
    `;
    const apiUrl =
      "https://api.thegraph.com/subgraphs/name/r4j4t-singh/india3-v4";
    axios
      .post(apiUrl, { query })
      .then(async (response) => {
        const data = response.data.data.uidVerifies;
        let found = false;
        data.forEach(async (item: any) => {
          if (
            item.sender === sender &&
            !found &&
            item.hash === demohashtocheck &&
            item.Upin === idtocheck
          ) {
            found = true;
            const records = await collectionReference.get();
            records.data.forEach(function (obj: any) {
              if (
                obj.data.id === idtocheck &&
                obj.data.demohash === demohashtocheck
              ) {
                res.json({
                  success: true,
                  data: "Verified",
                });
              }
            });
          }
        });
      })
      .catch((error: any) => {
        console.error(error);
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

router.route("/upload").post(addTodb);
router.route("/verify").post(Verify);
router.route("/upload2").post(addTodb2);
router.route("/verify2").post(Verify2);
router.route("/getdetails").get(listRecords);

export default router;
