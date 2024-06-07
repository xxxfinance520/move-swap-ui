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
  useCurrentAccount,
} from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { useFetchCoinBalance, mergeCoins } from "../Coin/useFetchCoinBalance";
import { SWAP_ID, COIN_PACKAGE_ID, PACKAGE_ID } from "../../constants";
import { toast } from "react-toastify";

export function SwapSesh() {
  const { data: data1 } = useFetchCoinBalance(
    `${COIN_PACKAGE_ID}::mycoin::MYCOIN`,
  );
  const { data: data2 } = useFetchCoinBalance(
    `${PACKAGE_ID}::mycoin2::MYCOIN2`,
  );
  const { mutate: mintCoin } = useSignAndExecuteTransactionBlock();
  const account = useCurrentAccount();
  const [swapAmount, setSwapAmount] = useState(0);
  return (
    <Box grow={"1"} shrink={"1"}>
      <Card style={{ width: "100%" }}>
        <Heading size="4" align={"center"}>
          兑换(所有用户可操作)
        </Heading>
        <Container>
          <Box mb="3">
            <Text>兑换的数量</Text>
            <TextFieldInput
              placeholder="输入兑换的数量"
              required
              onChange={(e) => {
                setSwapAmount(Number(e.target.value));
              }}
            />
          </Box>
          <Button
            ml={"3"}
            onClick={() => {
              const txb = new TransactionBlock();
              const inCoin = mergeCoins(txb, data2);
              if (inCoin == undefined) {
                return;
              }
              const [houseStakeCoin] = txb.splitCoins(inCoin, [
                swapAmount * 1e6,
              ]);
              const [coin] = txb.moveCall({
                target: `${PACKAGE_ID}::swap::swap2`,
                arguments: [txb.object(SWAP_ID), houseStakeCoin],
              });
              txb.transferObjects([coin], txb.pure(account?.address));
              mintCoin(
                {
                  transactionBlock: txb,
                },
                {
                  onError: (err) => {
                    toast.error(err.message);
                  },
                  onSuccess: (result) => {
                    toast.success(`Digest: ${result.digest}`);
                  },
                },
              );
            }}
          >
            Con2 To Coin1
          </Button>
          <Button
            ml={"3"}
            onClick={() => {
              const txb = new TransactionBlock();
              console.info(account?.address);
              const inCoin = mergeCoins(txb, data1);
              if (inCoin == undefined) {
                return;
              }
              const [houseStakeCoin] = txb.splitCoins(inCoin, [
                swapAmount * 1e6,
              ]);
              const [coin] = txb.moveCall({
                target: `${PACKAGE_ID}::swap::swap1`,
                arguments: [txb.object(SWAP_ID), houseStakeCoin],
              });
              txb.transferObjects([coin], txb.pure(account?.address));
              mintCoin(
                {
                  transactionBlock: txb,
                },
                {
                  onError: (err) => {
                    toast.error(err.message);
                  },
                  onSuccess: (result) => {
                    toast.success(`Digest: ${result.digest}`);
                  },
                },
              );
            }}
          >
            Con1 To Coin2
          </Button>
        </Container>
      </Card>
    </Box>
  );
}
