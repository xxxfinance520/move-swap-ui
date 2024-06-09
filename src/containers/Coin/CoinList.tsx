import { Box, Container, Heading, Button, Text } from "@radix-ui/themes";
import {
  useFetchCoinBalance,
  useFetchGetOwnedObjects,
} from "./useFetchCoinBalance";

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
  FAUCET_ID,
  FAUCET_PACKAGE_ID,
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
  const { data: faucetData } = useFetchGetOwnedObjects(
    props.fullCoinModStruct,
    FAUCET_ID,
  );
  const objType = `0x2::coin::Coin<${props.fullCoinModStruct}>`;
  const vFaucetData: string[] = [];
  if (faucetData && faucetData.length > 0) {
    for (let i = 0; i < faucetData.length; i++) {
      let obj = faucetData[i].data;
      if (obj?.type == objType) vFaucetData.push(obj?.objectId);
    }
  }
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
                <Text as="div">{Number(it?.balance) / 1e6}</Text>
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
          txb.moveCall({
            target: `${props.coinPackageId}::${props.coinMod}::mint`,
            arguments: [
              txb.object(props.coinCapId),
              txb.pure(1e8),
              txb.pure(FAUCET_ID),
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
        Mint Coin到水龙头
      </Button>
      <Button
        ml={"3"}
        onClick={() => {
          const txb = new TransactionBlock();
          const argt1 = `${props.fullCoinModStruct}`;
          //const argt1 = `0x2::coin:Coin<0x2::sui::SUI>`;

          if (vFaucetData?.length == 0) {
            return;
          }

          for (let i = 0; i < vFaucetData.length; i++) {
            txb.moveCall({
              target: `${FAUCET_PACKAGE_ID}::faucet::accept_payment`,
              arguments: [txb.object(FAUCET_ID), txb.object(vFaucetData[i])],
              typeArguments: [argt1],
            });
          }
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
        水龙头填充资金
      </Button>
      <Button
        ml={"3"}
        onClick={() => {
          const txb = new TransactionBlock();
          const argt1 = `${props.fullCoinModStruct}`;
          const outCoin = txb.moveCall({
            target: `${FAUCET_PACKAGE_ID}::faucet::withdraw`,
            arguments: [txb.object(FAUCET_ID), txb.pure(10e6)],
            typeArguments: [argt1],
          });

          txb.transferObjects([outCoin], txb.pure(account?.address));
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
        领取10个
      </Button>
    </Container>
  );
}
