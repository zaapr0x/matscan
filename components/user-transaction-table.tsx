"use client";

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "./ui/skeleton";

interface Transaction {
  txid: string;
  sender: string;
  receiver: string;
  amount: string;
  timestamp: number;
  type?: string;
  title: string;
}

interface Props {
  username: string;
}

const UserTransactionTable: React.FC<Props> = ({ username }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState({ start: 1, end: 10 });

  const fetchTransactions = useCallback(async (username: string, start: number, end: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/transactions/${username}/${start}/${end}?sort=new`);
      const data: Transaction[] = await res.json();
      setTransactions((prev) => [...prev, ...data]);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions(username, range.start, range.end);
  }, [username, range.start, range.end, fetchTransactions]);

  const handleViewMore = () => {
    const nextStart = range.end + 1;
    const nextEnd = nextStart + 9;
    setRange({ start: nextStart, end: nextEnd });
  };

  const renderSkeletonRows = () => (
    Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={index} className="animate-pulse">
        {Array.from({ length: 6 }).map((__, cellIdx) => (
          <TableCell key={cellIdx}>
            <Skeleton className="w-full h-2" />
          </TableCell>
        ))}
      </TableRow>
    ))
  );

  return (
    <div className="w-full bg-muted my-4 rounded-lg border text-xs">
      <div className="flex items-center gap-1 px-3 py-3">
      
        <span className="ml-2 text-xs font-semibold">{username}'s Latest Transactions</span>
      </div>
      <Table className="w-full whitespace-nowrap border-t" id="live-transactions">
        <TableHeader>
          <TableRow className="bg-muted text-xs font-semibold">
            <TableHead>Txid</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && transactions.length === 0
            ? renderSkeletonRows()
            : transactions.length === 0
              ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No transactions available.
                  </TableCell>
                </TableRow>
              )
              : transactions.map((tx) => (
                <TableRow key={tx.txid} className="text-xs font-semibold">
                  <TableCell>
                    <Link href={`/tx/${tx.txid}`}>{tx.txid}</Link>
                  </TableCell>
                  <TableCell>{tx.sender}</TableCell>
                  <TableCell>{tx.receiver}</TableCell>
                  <TableCell>{tx.amount}</TableCell>
                  <TableCell>{formatDistanceToNow(new Date(tx.timestamp))} ago</TableCell>
                  <TableCell>{tx.type || tx.title}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
      <div className="w-full flex items-center justify-between px-3 py-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full border"
          onClick={handleViewMore}
          disabled={loading}
        >
          {loading ? "Loading..." : "View More"}
        </Button>
      </div>
    </div>
  );
};

export default UserTransactionTable;
