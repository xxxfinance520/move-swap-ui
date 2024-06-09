import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";

import {} from "react";
import {} from "../../constants";
import { CoinStruct } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";

export function useFetchCoinBalance(coinMod: string) {
  const account = useCurrentAccount();

  if (!account) {
    return { data: [] };
  }

  // Fetch CounterNFT owned by current connected wallet
  // Only fetch the 1st one
  const { data, isLoading, isError, error, refetch } = useSuiClientQuery(
    "getCoins",
    {
      owner: account.address,
      coinType: coinMod,
    },
    { queryKey: ["Coins" + coinMod] },
  );

  return {
    data: data && data.data.length > 0 ? data?.data : [],
    isLoading,
    isError,
    error,
    refetch,
  };
}

export function useFetchCoinBalanceByAccount(coinMod: string, account: string) {
  if (!account) {
    return { data: [] };
  }
  // Fetch CounterNFT owned by current connected wallet
  // Only fetch the 1st one
  const { data, isLoading, isError, error, refetch } = useSuiClientQuery(
    "getAllCoins",
    {
      owner: account,
      //coinType: coinMod,
    },
    { queryKey: ["AccountCoins" + coinMod + account] },
  );

  return {
    data: data && data.data.length > 0 ? data?.data : [],
    isLoading,
    isError,
    error,
    refetch,
  };
}

export function useFetchGetOwnedObjects(coinMod: string, account: string) {
  // Fetch CounterNFT owned by current connected wallet
  // Only fetch the 1st one
  const { data, isLoading, isError, error, refetch } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account,
      //coinType: coinMod,
      options: {
        showType: true,
      },
    },
    { queryKey: ["OwnedObjects" + coinMod + account] },
  );

  return {
    data: data && data.data ? data?.data : [],
    isLoading,
    isError,
    error,
    refetch,
  };
}

export type CoinStructResult = {
  index: number;
  kind: "Input";
  type?: "object" | undefined;
  value?: any;
} | void;

export function mergeCoins(
  txb: TransactionBlock,
  data: CoinStruct[],
): CoinStructResult {
  const len = data?.length;
  if (len == 0) {
    return;
  }
  if (data?.length >= 2) {
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
  }
  return txb.object(data[0].coinObjectId);
}

export function useFetchGetObject(id: string) {
  // Fetch CounterNFT owned by current connected wallet
  // Only fetch the 1st one
  const { data, isLoading, isError, error, refetch } = useSuiClientQuery(
    "getObject",
    {
      id: id,
      options: {
        showContent: true,
      },
    },
    { queryKey: [id] },
  );

  return {
    data: data && data ? data.data : undefined,
    isLoading,
    isError,
    error,
    refetch,
  };
}
