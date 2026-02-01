import AnimatedBackground from "@/components/animated-background";
import AppFlow from "@/components/app-flow";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full text-foreground flex flex-col items-center justify-center p-4 overflow-hidden">
      <AnimatedBackground />
      <div className="z-10 w-full max-w-md">
        <AppFlow />
      </div>
    </main>
  );
}
