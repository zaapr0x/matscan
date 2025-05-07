"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

// Define a more specific type for the raw data items
interface RawChartData {
  date?: string; // In case the raw data has either 'date' or 'month'
  month?: string;
  tx_count: number;
  total_amount: string; // The amount is a string in the raw data, we parse it later
}

// Define a type for the formatted chart data
interface FormattedChartData {
  label: string;
  desktop: number;
  amount: number;
}

interface ChartProps {
  title?: string;
  endpoint: string; // e.g. "/api/transactions/daily"
}

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

// Helper function for date formatting
const formatDate = (value: string) => {
  if (/^\d{4}-\d{2}$/.test(value)) {
    const [year, month] = value.split("-");
    const date = new Date(`${year}-${month}-01`);
    return date.toLocaleDateString("id-ID", { month: "short" });
  }
  return value.slice(5); // e.g., "05-04"
};

export function Chart({ title, endpoint }: ChartProps) {
  const [data, setData] = useState<FormattedChartData[]>([]);
  const [totalTx, setTotalTx] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // New error state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error("Failed to fetch data"); // Handle non-2xx responses
        const raw: RawChartData[] = await res.json();

        const formatted = raw.map(({ date, month, tx_count, total_amount }) => ({
          label: date || month || '', // Provide a default value for label
          desktop: tx_count,
          amount: parseFloat(total_amount),
        })).slice().reverse();

        const today = new Date();
        const currentDate = today.toISOString().split("T")[0]; // "2025-05-05"
        const currentMonth = today.toISOString().slice(0, 7); // "2025-05"

        const targetItem = raw.find(
          (item) =>
            item.date === currentDate || item.month === currentMonth
        );

        setTotalTx(targetItem?.tx_count || 0);
        setTotalAmount(parseFloat(targetItem?.total_amount || "0"));

        setData(formatted);
      } catch (err) {
        console.error("Error fetching chart data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return (
    <Card className="h-[310px] md:h-[250px] flex flex-col px-2 py-2">
      <CardHeader className="px-2 py-2">
        <CardTitle className="text-md">{title}</CardTitle>
        <CardDescription className="text-sm space-y-1">
          {isLoading ? (
            <>
              <Skeleton className="w-32 h-4" />
              <Skeleton className="w-32 h-4" />
            </>
          ) : error ? (
            <p className="text-red-500">{error}</p> // Display error message if there's an issue
          ) : (
            <>
              <p>Transaction: {totalTx.toLocaleString()}</p>
              <p>Mats In/Out: {totalAmount.toLocaleString()}</p>
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-2 w-full h-fit border rounded-sm">
        {data.length === 0 ? (
          <Skeleton className="w-full h-full rounded-md" />
        ) : (
          <ChartContainer config={chartConfig} className="w-full h-[180px] md:h-[125px]">
            <BarChart data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={formatDate} // Use helper function for date formatting
              />
              <Tooltip
                cursor={false}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length > 0) {
                    const tx = payload[0].payload.desktop;
                    const amount = payload[0].payload.amount;

                    const isMonthly = /^\d{4}-\d{2}$/.test(label);
                    const labelFormatted = isMonthly
                      ? new Date(label + "-01").toLocaleDateString("id-ID", {
                          month: "long",
                          year: "numeric",
                        })
                      : label;

                    return (
                      <div className="bg-background p-2 rounded shadow text-xs space-y-1">
                        <div className="font-medium">{labelFormatted}</div>
                        <div>Transaction: {tx.toLocaleString()}</div>
                        <div>Total Mats: {amount.toLocaleString()}</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="desktop" fill="var(--color-desktop)" radius={3} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
