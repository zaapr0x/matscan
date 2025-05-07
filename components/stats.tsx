"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import Image from "next/image";
import { useEffect, useState } from "react";

export function Stats() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalTx, setTotalTx] = useState(0);
  const [totalMats, setTotalMats] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();
        const stats = data[0];

        setTotalUsers(stats.total_users || 0);
        setTotalTx(stats.total_transactions || 0);
        setTotalMats(parseFloat(stats.total_mats) || 0);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Card className="h-[310px] md:h-[250px] flex flex-col px-2 py-2">
      <CardHeader className="pb-2 px-2 py-2">
        <CardTitle className="text-md">Stats</CardTitle>
        <CardDescription className="text-sm space-y-1">
          {isLoading ? (
            <>
              <Skeleton className="w-32 h-4" />
              <Skeleton className="w-32 h-4" />
            </>
          ) : (
            <>
              <p>Total Transaction: {totalTx.toLocaleString()}</p>
              <p>Total Users: {totalUsers.toLocaleString()}</p>
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-2 w-full h-fit border rounded-sm ">
        {isLoading ? (
          <Skeleton className="w-full h-full rounded-md" />
        ) : (
          <div className="w-full h-full justify-center flex items-center gap-2 mx-auto">
            <div className="text-center">
              <div className="flex items-center gap-2">
                <Image src="/mats.png" alt="mats" width={20} height={20} />
                <h3 className="text-3xl font-bold">
                  {totalMats.toLocaleString()}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">Total Mats In/Out</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
