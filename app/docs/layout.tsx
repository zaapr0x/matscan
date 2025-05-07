
export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="max-w-[1000px] mx-auto px-2 lg:px-0 sm:min-h-[87.5vh]">{children}</div>
  );
}
