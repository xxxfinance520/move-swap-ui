import { Box, Container, Heading, Button, Text } from "@radix-ui/themes";
import { useFetchCoinBalance } from "./useFetchCoinBalance";

import {
  useSignAndExecuteTransactionBlock,
  useCurrentAccount,
} from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import {
  COIN_CAP_ID,
  COIN_CAP_ID2,
  COIN_PACKAGE_ID,
  PACKAGE_ID,
} from "../../constants";
import { toast } from "react-toastify";

export type CoinListProps = {
  coinType: number;
  coinMod: string;
  fullCoinModStruct: string;
  coinModStruct: string;
  coinCapId: string;
  coinPackageId: string;
};

function fullCoinListProps(sp: { coinType: number }): CoinListProps {
  const props = {
    coinType: sp.coinType,
    coinPackageId: COIN_PACKAGE_ID,
    coinMod: "mycoin",
    coinCapId: COIN_CAP_ID,
    coinModStruct: "MYCOIN",
    fullCoinModStruct: "",
  };
  if (sp.coinType == 2) {
    props.coinPackageId = PACKAGE_ID;
    props.coinMod = "mycoin2";
    props.coinCapId = COIN_CAP_ID2;
    props.coinModStruct = "MYCOIN2";
  }
  props.fullCoinModStruct = `${props.coinPackageId}::${props.coinMod}::${props.coinModStruct}`;
  return props;
}

export function CoinList(prop: { coinType: number }) {
  const props = fullCoinListProps(prop);
  const { data, error } = useFetchCoinBalance(props.fullCoinModStruct);
  const { mutate: mintCoin } = useSignAndExecuteTransactionBlock();
  const account = useCurrentAccount();
  return (
    <Container mb={"4"}>
      <Heading size="3" mb="2">
        CoinType: {props.fullCoinModStruct}
      </Heading>

      {error && <Text>Error: {error.message}</Text>}
      <Box mb="3">
        {data.length > 0 ? (
          data.map((it) => {
            return (
              <Box key={it?.coinObjectId}>
                <Text as="div" weight="bold">
                  coinObjectId ID:
                </Text>
                <Text as="div">{it?.coinObjectId}</Text>
                <Text as="div" weight="bold">
                  Balance:
                </Text>
                <Text as="div">{it?.balance}</Text>
              </Box>
            );
          })
        ) : (
          <Text>No Coin Owned</Text>
        )}
      </Box>
      <Button
        ml={"3"}
        onClick={() => {
          const txb = new TransactionBlock();
          console.info(account?.address);
          if (data?.length > 2) {
            var sources: {
              index: number;
              kind: "Input";
              type?: "object" | undefined;
              value?: any;
            }[] = new Array(data?.length - 1);
            for (let i = 1; i < data?.length; i++) {
              sources[i - 1] = txb.object(data[i].coinObjectId);
            }
            txb.mergeCoins(txb.object(data[0].coinObjectId), sources);
            //txb.transferObjects([coin], txb.pure(account?.address));
          }
          txb.moveCall({
            target: `${props.coinPackageId}::${props.coinMod}::mint`,
            arguments: [
              txb.object(props.coinCapId),
              txb.pure(1e8),
              txb.pure(account?.address),
            ],
          });

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
        Mint Coin
      </Button>
    </Container>
  );
}
