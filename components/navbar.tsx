import { GithubIcon, Code ,ChartNoAxesColumn} from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import SiteLogo from "./ui/site-logo";
import { Leaderboard } from "./leaderboard/leaderboard";
export function Navbar() {
  return (
    <nav className="w-full border-b h-12 sticky top-0 z-50 bg-background">
      <div className="mx-auto max-w-[1000px] h-full flex items-center justify-between md:gap-2 ">
        <div className="flex items-center sm:gap-5 gap-2.5">
          <div className="flex items-center gap-6">
            <div className="flex px-3">
             <Link href="/">
             <SiteLogo
                width={24}
                height={24}
                className="flex items-center gap-3"
              >
                <span className="text-md font-bold">matscan</span>
              </SiteLogo>
             </Link>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:gap-3 ml-1">
          <div className="flex">
            <Link
              href="https://github.com/zaapr0x/matscan"
              className={buttonVariants({
                variant: "ghost",
                size: "icon",
              })}
            >
              <GithubIcon className="h-[1.1rem] w-[1.1rem]" />
            </Link>
            <Link
              href="/docs/getting-started/matscan-docs"
              className={buttonVariants({
                variant: "ghost",
                size: "icon",
              })}
            >
              <Code className="h-[1.1rem] w-[1.1rem]" />
            </Link>
            <Leaderboard>
            <Button
              variant="ghost"
              size="sm"
              className="px-3"
            ><ChartNoAxesColumn className="h-[1.1rem] w-[1.1rem]"/></Button>
            </Leaderboard>
          </div>
        </div>
      </div>
    </nav>
  );
}
