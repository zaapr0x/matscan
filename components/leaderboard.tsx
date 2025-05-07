"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

const invoices = [
  {
    txid: "a1f4c91d2b3c4d5e6f789012",
    from: "alice",
    to: "bob",
    amount: "500",
    type: "Claimed Points",
  },
  {
    txid: "b2e8c82d3a4f5a6b7c891234",
    from: "charlie",
    to: "dave",
    amount: "750",
    type: "Tip",
  },
  {
    txid: "c3d7b93e4f5a6b7c8d902345",
    from: "eve",
    to: "frank",
    amount: "300",
    type: "Magic Embed Give",
  },
  {
    txid: "d4c6a04f5c6b7d8e9fa12345",
    from: "george",
    to: "harry",
    amount: "1200",
    type: "Claimed Points",
  },
  {
    txid: "e5b591605b7d8e9f0ab23456",
    from: "ivy",
    to: "john",
    amount: "850",
    type: "Tip",
  },
  {
    txid: "f6a480716a8e9f0a1bc34567",
    from: "karen",
    to: "leo",
    amount: "900",
    type: "Claimed Points",
  },
  {
    txid: "01b37082798f0a1b2cd45678",
    from: "mia",
    to: "nina",
    amount: "1000",
    type: "Magic Embed Give",
  },
  {
    txid: "12a2619388a0b1c2de567890",
    from: "oliver",
    to: "paul",
    amount: "650",
    type: "Tip",
  },
  {
    txid: "239152a497b1c2d3ef678901",
    from: "quincy",
    to: "rachel",
    amount: "1100",
    type: "Claimed Points",
  },
  {
    txid: "348043b5a6c2d3e4f0890123",
    from: "steve",
    to: "tina",
    amount: "980",
    type: "Magic Embed Give",
  },
];

export function Leaderboard() {
  // Filter out only "Tip" transactions
  const tipperInvoices = invoices.filter((invoice) => invoice.type === "Tip");

  return (
    <Card className="h-[250px] flex flex-col px-2 py-2">
      <CardHeader className="pb-2 px-2 py-2">
        <CardTitle className="text-md">Tipper Leaderboard</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-2 w-full h-fit border rounded-sm">
        <Table className="w-full whitespace-nowrap border-t">
          <TableHeader>
            <TableRow className="bg-muted text-xs font-semibold">
              <TableHead className="font-semibold">Username</TableHead>
              <TableHead className="font-semibold">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-background text-xs">
            {tipperInvoices.map((invoice) => (
              <TableRow key={invoice.txid}>
                <TableCell className="text-left font-semibold">{invoice.from}</TableCell>
                <TableCell className="text-left font-semibold">{invoice.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
