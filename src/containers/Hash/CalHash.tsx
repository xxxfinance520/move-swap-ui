import {
  Box,
  Card,
  Heading,
  Text,
  TextFieldInput,
  Container,
  Button,
} from "@radix-ui/themes";
import { useState } from "react";
import {
  useSignAndExecuteTransactionBlock,
} from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";

import { MOD_Poseidon } from "../../constants";
import { toast } from "react-toastify";

export function CalHash() {
 
  const { mutate: callHash } = useSignAndExecuteTransactionBlock();

  const [data, setData] = useState("");
  return (
    <Box grow={"1"} shrink={"1"}>
      <Card style={{ width: "100%" }}>
        <Heading size="4" align={"center"}>
         计算hash
        </Heading>
        <Container>
          <Box mb="3">
            <Text>兑换的数量</Text>
            <TextFieldInput
              placeholder="输入兑换的数量"
              required
              onChange={(e) => {
                setData(e.target.value);
              }}
            />
          </Box>
          <Button
            ml={"3"}
            onClick={() => {
              let vecData:any[] = [20, 30, 40, 50]
              alert(data)
              const txb = new TransactionBlock();
              // txb.moveCall({
              //   target: "0x2::poseidon::poseidon_bn254",
              //   arguments: [txb.pure(vecData)],
              // });
             const [hash] = txb.moveCall({
                target: "0xdfc45fa4b6935c8709de8c76a93a05e6cb7e8bc72943d07320f725d9f50f344e::poseidon_hash::poseidon2",
                //arguments: [txb.pure(vecData)],
              });
              console.info("hash", hash)
              callHash(
                {
                  transactionBlock: txb,
                },
                {
                  onError: (err) => {
                    toast.error(err.message);
                  },
                  onSuccess: (result) => {
                    toast.success(`Digest: ${result.digest}`);
                    console.info(result)
                  },
                },
              );
            }}
          >
            计算hash
          </Button>
         
        </Container>
      </Card>
    </Box>
  );
}
