"use client";

import { useEffect, useState } from "react";
import UserTransactionTable from "@/components/user-transaction-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";
import Search from "@/components/search/search-form";

// Define the type for the Transaction object
interface Transaction {
  username: string;
  balance: number;
  created_at: string;
  transaction_count: number;
}

// Fetch user data from the API
const getTransaction = async (username: string): Promise<Transaction | null> => {
  try {
    const res = await fetch(`/api/users/${username}`);
    if (!res.ok) {
      throw new Error("Transaction not found");
    }
    const data: Transaction = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return null;
  }
};

// Main Transaction Page Component
export default function TransactionPage() {
  const { username } = useParams() as { username: string };
  const [transactionData, setTransactionData] = useState<Transaction | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Use useEffect to fetch the transaction data
  useEffect(() => {
    const fetchTransactionData = async () => {
      const data = await getTransaction(username);
      if (!data) {
        setError("User not found");
      } else {
        setTransactionData(data);
      }
    };

    fetchTransactionData();
  }, [username]);

  // Handle error
  if (error) {
    return (
      <div className="max-w-[1000px] mx-auto px-2 lg:px-0 sm:min-h-[87.5vh]">
        <h3 className="text-red-500">{error}</h3>
      </div>
    );
  }

  // Render skeleton loader while data is loading
  const renderSkeletonInfo = () => (
    <div className="w-full my-4 rounded-lg border text-sm">
      <h3 className="border-b px-3 py-3 bg-muted rounded-t-md">
        <Skeleton className="w-1/4 h-4" />
      </h3>
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          key={idx}
          className="border-b flex items-center justify-between gap-1 py-1"
        >
          <div className="flex items-center gap-1 px-3 py-2 w-1/3">
            <Skeleton className="w-full h-4" />
          </div>
          <div className="flex items-center gap-1 px-3 w-2/3">
            <Skeleton className="w-full h-4" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-[1000px] mx-auto px-2 lg:px-0 sm:min-h-[87.5vh] py-3">
      <Search />
      {transactionData ? (
        <div className="w-full my-4 rounded-lg border text-sm">
          <h3 className="border-b px-3 py-3 bg-muted rounded-t-md">
            User Info
          </h3>
          {([
            ["Username", transactionData.username],
            [
              "Balance",
              <span className="mats-point inline-flex">
                {transactionData.balance.toLocaleString()}
              </span>,
            ],
            [
              "Transaction Count",
              transactionData.transaction_count.toString(),
            ],
            [
              "Joined",
              new Date(transactionData.created_at).toLocaleString(),
            ],
          ] as [string, string | JSX.Element][]).map(([label, value]) => (
            <div
              key={label}
              className="border-b flex items-center justify-between gap-1 py-1 font-semibold"
            >
              <div className="flex items-center gap-1 px-3 py-2">
                <span className="text-xs font-semibold">{label}</span>
              </div>
              <div className="flex items-center gap-1 px-3">
                <span className="text-xs">{value}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        renderSkeletonInfo()
      )}

      <UserTransactionTable username={username} />
    </div>
  );
}
