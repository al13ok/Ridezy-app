import { Zap } from "lucide-react";
import Spinner from "./Spinner";

// one tap login with the demo account (see utils/demo.js)
function DemoLogin({ label, onClick, loading }) {
  return (
    <div className="mt-4">
      <div className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-widest text-ink-300">
        <span className="h-px flex-1 bg-ink-200" /> or <span className="h-px flex-1 bg-ink-200" />
      </div>
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="group flex w-full items-center gap-3 rounded-2xl border-2 border-brand-200 bg-brand-50 p-3 text-left transition hover:border-brand-400 hover:bg-brand-100/60 active:scale-[0.99] disabled:opacity-60"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white shadow-brand">
          {loading ? <Spinner /> : <Zap size={20} fill="currentColor" />}
        </span>
        <span className="flex-1">
          <span className="block text-sm font-bold text-ink-900">{label}</span>
          <span className="block text-xs text-ink-500">One tap · no signup or email verification</span>
        </span>
      </button>
    </div>
  );
}

export default DemoLogin;
