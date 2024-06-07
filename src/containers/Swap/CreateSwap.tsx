import { Button } from "@radix-ui/themes";

import { useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { mergeCoins } from "../Coin/useFetchCoinBalance";
import { PACKAGE_ID } from "../../constants";
import { CoinStruct } from "@mysten/sui.js/client";
import { toast } from "react-toastify";

export function CreateSwap(props: {
  type: number;
  amount: number;
  coinData: CoinStruct[];
}) {
  const { mutate: mintCoin } = useSignAndExecuteTransactionBlock();
  return (
    <>
      <Button
        ml={"3"}
        onClick={() => {
          const txb = new TransactionBlock();
          const inCoin = mergeCoins(txb, props.coinData);
          if (inCoin == undefined) {
            return;
          }
          const [houseStakeCoin] = txb.splitCoins(inCoin, [props.amount * 1e6]);
          txb.moveCall({
            target: `${PACKAGE_ID}::swap::create${props.type}`,
            arguments: [houseStakeCoin],
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
        创建交换池 {props.type}
      </Button>
    </>
  );
}
