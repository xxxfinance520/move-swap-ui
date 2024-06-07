import { Box, Card, Heading } from "@radix-ui/themes";
import { CoinList } from "./CoinList";

export function CoinSesh(props: { coinType: number }) {
  return (
    <Box grow={"1"} shrink={"1"}>
      <Card style={{ width: "100%" }}>
        <Heading size="4" align={"center"}>
          Coin {props.coinType}水龙头
        </Heading>
        <CoinList coinType={props.coinType} />
      </Card>
    </Box>
  );
}
