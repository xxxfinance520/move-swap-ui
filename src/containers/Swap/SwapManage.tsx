import {
  Box,
  Card,
  Heading,
  Text,
  TextFieldInput,
  Container,
} from "@radix-ui/themes";
import { useState } from "react";
import {
  useFetchCoinBalance,
  useFetchGetObject,
} from "../Coin/useFetchCoinBalance";
import {} from "@mysten/sui.js/client";
import { SWAP_ID, COIN_PACKAGE_ID, PACKAGE_ID } from "../../constants";
//import { CreateSwap } from "./CreateSwap";
import { AddAmount } from "./AddAmount";
import { RemoveAmount } from "./RemoveAmount";
export function SwapManage() {
  const { data: data1 } = useFetchCoinBalance(
    `${COIN_PACKAGE_ID}::mycoin::MYCOIN`,
  );
  const { data: data2 } = useFetchCoinBalance(
    `${PACKAGE_ID}::mycoin2::MYCOIN2`,
  );
  const { data: poolObject } = useFetchGetObject(SWAP_ID);
  const content = poolObject ? poolObject.content : undefined;
  const { fields: poolField } =
    content && content.dataType == "moveObject" && content.fields
      ? content
      : { fields: { balance1: 0, balance2: 0 } };
  const [swapAmount, setSwapAmount] = useState(0);
  return (
    <Box grow={"1"} shrink={"1"}>
      <Card style={{ width: "100%" }}>
        <Heading size="4" align={"center"}>
          兑换池管理(仅管理员可操作)
        </Heading>
        <Container>
          <Box mb="3">
            <Box>
              <Text as="div" weight="bold">
                Pool Balance Of Coin1 : {(poolField as any)?.balance1 / 1e6}
              </Text>
              <Text as="div" weight="bold">
                Pool Balance Of Coin2: {(poolField as any)?.balance2 / 1e6}
              </Text>
            </Box>
          </Box>
          <Box mb="3">
            <Text>数量</Text>
            <TextFieldInput
              placeholder="数量"
              required
              onChange={(e) => {
                setSwapAmount(Number(e.target.value));
              }}
            />
          </Box>
          <AddAmount type={1} amount={swapAmount} coinData={data1} />
          <AddAmount type={2} amount={swapAmount} coinData={data2} />
          <RemoveAmount type={1} />
          <RemoveAmount type={2} />
        </Container>
      </Card>
    </Box>
  );
}
