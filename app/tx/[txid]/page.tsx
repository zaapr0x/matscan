"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import LiveTransactionTable from "@/components/live-transaction-table";
import Search from "@/components/search/search-form";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
interface Transaction {
  txid: string;
  sender: string;
  receiver: string;
  amount: string;
  timestamp: number;
  type: string;
}

export default function TransactionPage() {
  const { txid } = useParams() as { txid: string };
  const [data, setData] = useState<Transaction | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!txid) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/transactions/by/txid/${txid}`);
        if (!res.ok) throw new Error("Failed to fetch data");
        const transaction: Transaction = await res.json();
        setData(transaction);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong");
      }
    };

    fetchData();
  }, [txid]);

  return (
    <div className="max-w-[1000px] mx-auto px-2 lg:px-0 sm:min-h-[87.5vh] py-3">
      <Search />
      {error && <p className="text-red-500">Transaction not found!</p>}
      <TransactionDetails data={data} />
      <LiveTransactionTable/>
    </div>
  );
}

function TransactionDetails({ data }: { data: Transaction | null}) {
  const renderRow = (label: string, value: string | JSX.Element) => (
    <div className="flex justify-between border-b pb-2 p-3">
      <span>{label}</span>
      {typeof value === "string" ? <span>{value}</span> : value}
    </div>
  );

  return (
    <div className="w-full border rounded-lg mb-4">
      <div className="p-3 bg-muted rounded-t-lg border-b">
        <h3 className="text-sm font-semibold">Transaction Details</h3>
      </div>
      <div className="text-xs font-semibold">
        {data
          ? <>
              {renderRow("Transaction ID", data.txid)}
              {renderRow("Type", data.type)}
              {renderRow("From", data.sender)}
              {renderRow("To", data.receiver)}
              {renderRow("Age",`${formatDistanceToNow(data.timestamp)} ago`)}
            </>
          : <>
              {renderRow("Transaction ID", <Skeleton className="w-1/2 h-2" />)}
              {renderRow("Type", <Skeleton className="w-1/5 h-2" />)}
              {renderRow("From", <Skeleton className="w-1/6 h-2" />)}
              {renderRow("To", <Skeleton className="w-2/12 h-2" />)}
              {renderRow("Age", <Skeleton className="w-2/12 h-2" />)}
            </>
        }
      </div>
    </div>
  );
}
