import { Button } from "@radix-ui/themes";

import {
  useSignAndExecuteTransactionBlock,
  useCurrentAccount,
} from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { PACKAGE_ID, SWAP_ID } from "../../constants";
import { toast } from "react-toastify";

export function RemoveAmount(props: { type: number }) {
  const { mutate: mintCoin } = useSignAndExecuteTransactionBlock();
  const account = useCurrentAccount();
  return (
    <>
      <Button
        ml={"3"}
        onClick={() => {
          const txb = new TransactionBlock();
          const [outCoin] = txb.moveCall({
            target: `${PACKAGE_ID}::swap::removeCoin${props.type}`,
            arguments: [txb.object(SWAP_ID), txb.pure("123456")],
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
        取回Coin {props.type}
      </Button>
    </>
  );
}
