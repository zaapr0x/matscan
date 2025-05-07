"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import useSocket from "@/lib/websocket";
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


const LiveTransactionTable = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState({ start: 0, end: 10 });
  const [lastRowCache, setLastRowCache] = useState<Transaction | null>(null);

  const fetchTransactions = useCallback(async (start: number, end: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/transactions/by/range/${start}/${end}?sort=new`);
      const data: Transaction[] = await res.json();
      setTransactions((prev) => [...prev, ...data]);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleNewTransaction = (transaction: Transaction) => {
    // Simpan last transaction (jika ada) sebelum dihapus
    if (transactions.length > 0) {
      const last = transactions[transactions.length - 1];
      setLastRowCache(last);
      setTransactions((prev) => [transaction, ...prev.slice(0, -1)]);
    } else {
      setTransactions((prev) => [transaction, ...prev]);
    }
  };

  const handleViewMore = () => {
    const nextStart = range.start + 10;
    const nextEnd = range.end + 10;
  
    if (lastRowCache) {
      setTransactions((prev) => [...prev, lastRowCache]);
      setLastRowCache(null);
    }
  
    setRange({ start: nextStart, end: nextEnd });
    fetchTransactions(nextStart, nextEnd);
  };
  

  const socketUrl = `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`;
  useSocket(socketUrl, handleNewTransaction);

  useEffect(() => {
    fetchTransactions(range.start, range.end);
  }, []);

  const renderSkeletonRows = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={index} className="animate-pulse">
        {Array.from({ length: 6 }).map((__, cellIdx) => (
          <TableCell key={cellIdx}>
             <Skeleton className="w-full h-2" />
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <div className="w-full bg-muted my-4 rounded-lg border text-xs">
      <div className="flex items-center gap-1 px-3 py-3">
        <div className="w-3 h-3 rounded-full bg-accent animate-pulse"></div>
        <span className="ml-2 text-sm">Live Transaction</span>
      </div>
      <Table className="w-full whitespace-nowrap border-t" id="live-transactions">
        <TableHeader>
          <TableRow className="bg-muted text-xs font-semibold">
            <TableHead className="font-semibold">Txid</TableHead>
            <TableHead className="font-semibold">From</TableHead>
            <TableHead className="font-semibold">To</TableHead>
            <TableHead className="font-semibold">Amount</TableHead>
            <TableHead className="font-semibold">Age</TableHead>
            <TableHead className="font-semibold">Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-background text-xs">
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
                <TableRow key={tx.txid} className="fade-in">
                  <TableCell className="text-left font-semibold">
                    <Link href={`/tx/${tx.txid}`}>{tx.txid}</Link>
                  </TableCell>
                  {tx.sender === "system" ? <TableCell className="text-left font-semibold">MatsFi</TableCell> : <TableCell className="text-left font-semibold"><Link href={`/users/${tx.sender}`}>{tx.sender}</Link></TableCell>}
                  {tx.receiver === "system" ? <TableCell className="text-left font-semibold">MatsFi</TableCell> : <TableCell className="text-left font-semibold"><Link href={`/users/${tx.receiver}`}>{tx.receiver}</Link></TableCell>}
                  <TableCell className="text-left font-semibold"><span className="mats-point inline-flex">{tx.amount}</span></TableCell>
                  <TableCell className="text-left font-semibold">
                    {formatDistanceToNow(new Date(tx.timestamp))} ago
                  </TableCell>
                  <TableCell className="text-left font-semibold">
                    {tx.type || tx.title}
                  </TableCell>
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

export default LiveTransactionTable;
