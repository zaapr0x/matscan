import Search from "@/components/search/search-form";
import LiveTransactionTable from "@/components/live-transaction-table";
import { Chart } from "@/components/chart";

import { Stats } from "@/components/stats";
export default function Home() {
  return (
    <div className="max-w-[1000px] mx-auto px-2 lg:px-0 sm:min-h-[87.5vh] py-3">
      <Search/>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Chart
          title="Daily Transaction"
          endpoint="/api/transactions/daily"
        />
        <Chart
          title="Monthly Transaction"
          endpoint="/api/transactions/monthly"
        />
        <Stats />
      </div>

      <LiveTransactionTable />
    </div>
  );
}
