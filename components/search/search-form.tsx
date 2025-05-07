"use client";
import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import supabase from "@/lib/supabase";
import SearchResults from "@/components/search/search-result";

export default function SearchForm() {
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [txResults, setTxResults] = useState<any[]>([]);
  const [usernameResults, setUsernameResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Close results if clicking outside the search container
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce search query and fetch results
  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim() === "") {
        setTxResults([]);
        setUsernameResults([]);
        return;
      }

      setLoading(true);

      // Fetch matching transactions
      const { data: txMatches, error: txError } = await supabase
        .from("transactions")
        .select("*")
        .ilike("txid", `%${query}%`)
        .limit(5);

      setTxResults(txMatches || []);

      // Fetch matching usernames
      const { data: userMatches, error: userError } = await supabase
        .from("users")
        .select("username")
        .ilike("username", `%${query}%`)
        .limit(5);

      const usernames = userMatches?.map((u) => u.username) || [];
      setUsernameResults(usernames);

      setLoading(false);
    };

    const timeout = setTimeout(fetchResults, 300); // debounce
    return () => clearTimeout(timeout);
  }, [query]);


  return (
    <div
      ref={containerRef}
      className="relative border rounded-md w-full h-10 bg-muted mb-3"
    >
      <input
        type="text"
        placeholder="Search..."
        value={query}
        className="w-full h-full px-3 bg-muted rounded-md text-sm focus:outline-none"
        onChange={(e) => {
          setQuery(e.target.value);
          setShowResults(true);
        }}
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2">
        <Search className="w-4 h-4" />
      </div>

      {showResults && query && (
        <div
          id="search-results"
          className="absolute w-full bg-background border rounded-md px-3 left-0 top-11 z-10 text-xs font-semibold"
        >
          <SearchResults
            txResults={txResults}
            usernameResults={usernameResults}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
}
