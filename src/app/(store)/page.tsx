import { SignIn } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#121212] flex flex-col items-center justify-center p-4">
      <SignIn routing="hash" />
    </main>
  );
}