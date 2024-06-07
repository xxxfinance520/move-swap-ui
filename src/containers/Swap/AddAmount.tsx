import { Button } from "@radix-ui/themes";

import { useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { mergeCoins } from "../Coin/useFetchCoinBalance";
import { PACKAGE_ID, SWAP_ID } from "../../constants";
import { CoinStruct } from "@mysten/sui.js/client";
import { toast } from "react-toastify";

export function AddAmount(props: {
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
            target: `${PACKAGE_ID}::swap::addCoin${props.type}`,
            arguments: [txb.object(SWAP_ID), houseStakeCoin],
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
        添加Coin {props.type}
      </Button>
    </>
  );
}
