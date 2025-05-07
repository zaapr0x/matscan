"use client";
import Link from "next/link";
import Image from "next/image";
import { Loader2,ScanText } from "lucide-react";


export default function SearchResults({
  txResults,
  usernameResults,
  loading,
}: {
  txResults: any[];
  usernameResults: string[];
  loading: boolean;
}) {
  if (loading) {
    return (
        <div className="text-center py-2 flex items-center justify-center">
        <Loader2 className="animate-spin w-4 h-4 text-white" />
      </div>
    );
  }

  if (txResults.length === 0 && usernameResults.length === 0) return null;

  return (
    <ul>
        {txResults.map((tx) => (
          <li key={tx.id} className="py-2 border-b last:border-0 flex items-center">
          
            <Link
              href={`/transaction/${tx.txid}`}
              className="w-full h-full hover:bg-secondary/50 px-3 py-2 rounded-md flex items-center"
            >  <ScanText className="mr-2 w-4" />
              {tx.txid}
            </Link>
          </li>
        ))}
        {usernameResults.map((username) => (
          <li key={username} className="py-2 border-b last:border-0 flex items-center">
            
            <Link
              href={`/users/${username}`}
              className="w-full h-full hover:bg-secondary/50 px-3 py-2 rounded-md flex items-center"
            >
                <Image
              src={`https://api.dicebear.com/9.x/notionists-neutral/png?seed=${username}`}
              alt={username}
              width={20}
              height={20}
              className="mr-2 rounded-full"
            />
              <strong>{username}</strong>
            </Link>
          </li>
        ))}
      </ul>
  );
}
