"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LeaderboardProps {
  children: React.ReactNode;
}

interface LeaderboardEntry {
  username: string;
  total: number;
}

export function Leaderboard({ children }: LeaderboardProps) {
  const [tipperData, setTipperData] = useState<LeaderboardEntry[]>([]);
  const [receipmentData, setReceipmentData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // Function to fetch leaderboard data
  const fetchLeaderboardData = async (type: "tipper" | "receipment") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leaderboard/${type}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch ${type} leaderboard`);
      }
      const data = await res.json();
      // Map API response to LeaderboardEntry format
      const mappedData: LeaderboardEntry[] = data.map((entry: any) => ({
        username: type === "tipper" ? entry.sender : entry.receiver,
        total: entry.total_amount,
      }));
      return mappedData;
    } catch (error) {
      console.error(`Error fetching ${type} leaderboard:`, error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data for both tabs on mount
    const loadData = async () => {
      const tipper = await fetchLeaderboardData("tipper");
      const receipment = await fetchLeaderboardData("receipment");
      setTipperData(tipper);
      setReceipmentData(receipment);
    };
    loadData();
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[90%] md:max-w-[600px] mx-auto px-3 py-4 overflow-hidden rounded-lg">
        <DialogHeader>
          <DialogTitle>Leaderboard</DialogTitle>
          <DialogDescription>
            View the top tippers and recipients based on total tips.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="Tipper" className="w-full py-3">
          <TabsList className="grid w-full h-auto grid-cols-2 bg-muted p-1 rounded-full mb-4">
            <TabsTrigger
              value="Tipper"
              className="rounded-full text-sm data-[state=active]:bg-background data-[state=active]:text-foreground border-none"
            >
              Tipper
            </TabsTrigger>
            <TabsTrigger
              value="Receipment"
              className="rounded-full text-sm data-[state=active]:bg-background data-[state=active]:text-foreground border-none"
            >
              Receipment
            </TabsTrigger>
          </TabsList>
          <TabsContent value="Tipper">
            <Table className="w-full text-sm border rounded-md overflow-hidden">
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead className="font-semibold">Username</TableHead>
                  <TableHead className="text-right font-semibold">
                    Total Tip Sent
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                )}
                {!loading && tipperData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
                {!loading &&
                  tipperData.map((entry) => (
                    <TableRow key={entry.username}>
                      <TableCell className="font-medium">
                        {entry.username}
                      </TableCell>
                      <TableCell className="text-right">
                        {entry.total.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="Receipment">
            <Table className="w-full text-sm border rounded-md overflow-hidden">
              <TableHeader>
                <TableRow className="bg-muted">
                  <TableHead className="font-semibold">Username</TableHead>
                  <TableHead className="text-right font-semibold">
                    Total Tip Received
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                )}
                {!loading && receipmentData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
                {!loading &&
                  receipmentData.map((entry) => (
                    <TableRow key={entry.username}>
                      <TableCell className="font-medium">
                        {entry.username}
                      </TableCell>
                      <TableCell className="text-right">
                        {entry.total.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
