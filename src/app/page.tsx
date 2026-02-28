import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Logo from "@/components/logo";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <header className="flex h-16 items-center justify-between border-b px-6">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8" />
          <span className="text-xl font-bold tracking-tight">ProductAxis</span>
        </div>
        <nav className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost">Sign In</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/chat">
              <Button variant="ghost">Chat</Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </nav>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-5xl font-extrabold tracking-tighter sm:text-6xl md:text-7xl">
            Automate your workflow with <span className="text-primary">ProductAxis</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
            The next-generation AI assistant for developers and product teams. 
            Generate code, analyze tasks, and streamline your production cycle.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <SignedIn>
              <Link href="/chat">
                <Button size="lg" className="h-12 px-8 text-base">
                  Go to Chat
                </Button>
              </Link>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button size="lg" className="h-12 px-8 text-base">
                  Get Started
                </Button>
              </SignInButton>
            </SignedOut>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
              <a href="https://github.com/idoko" target="_blank" rel="noopener noreferrer">
                View on GitHub
              </a>
            </Button>
          </div>
        </div>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ProductAxis. All rights reserved.
      </footer>
    </div>
  );
}
