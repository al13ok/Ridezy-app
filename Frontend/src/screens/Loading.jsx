import { LogoMark } from "../components/ui";

function Loading() {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-5 bg-white">
      <div className="relative">
        <span className="absolute inset-0 animate-radar rounded-2xl bg-brand-400/40" />
        <LogoMark className="relative h-14 w-14" />
      </div>
      <div className="h-1 w-24 overflow-hidden rounded-full bg-ink-100">
        <div className="h-full w-2/5 animate-progress rounded-full bg-brand-500" />
      </div>
    </div>
  );
}

export default Loading;
