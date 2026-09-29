"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ChainVerificationResult = {
  chain_intact: boolean;
  total_records: number;
  broken_at_sequence: number | string | null;
  message: string;
};

export default function ChainPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] =
    useState<ChainVerificationResult | null>(null);
  const [error, setError] = useState("");

  /* =====================================================
     API
  ===================================================== */

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://transforma-ai-api.onrender.com";

  const verifyChainUrl = `${apiBaseUrl.replace(
    /\/$/,
    ""
  )}/verify-chain`;

  /* =====================================================
     THEME
  ===================================================== */

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("transforma-theme");

    const isDark = savedTheme === "dark";

    setDarkMode(isDark);

    document.documentElement.classList.toggle(
      "dark",
      isDark
    );
  }, []);

  const toggleTheme = () => {
    setDarkMode((current) => {
      const next = !current;

      localStorage.setItem(
        "transforma-theme",
        next ? "dark" : "light"
      );

      document.documentElement.classList.toggle(
        "dark",
        next
      );

      return next;
    });
  };

  /* =====================================================
     THEME STYLES
  ===================================================== */

  const theme = darkMode
    ? {
        page: "bg-[#0b0d14] text-slate-100",
        nav: "border-slate-800/80 bg-[#10131d]/85",
        card: "border-slate-800 bg-[#121621]",
        soft: "bg-[#171b27]",
        muted: "text-slate-400",
        border: "border-slate-800",
        heading: "text-white",
        footer: "bg-[#0d1018]",
      }
    : {
        page: "bg-[#f7f8fc] text-[#15182b]",
        nav: "border-slate-200/70 bg-white/75",
        card: "border-slate-200 bg-white",
        soft: "bg-slate-50",
        muted: "text-slate-500",
        border: "border-slate-200",
        heading: "text-[#15182b]",
        footer: "bg-white",
      };

  /* =====================================================
     VERIFY CHAIN
  ===================================================== */

  const checkChainIntegrity = async () => {
    setIsChecking(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        verifyChainUrl,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      let data: unknown = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        const errorMessage =
          data &&
          typeof data === "object" &&
          "detail" in data &&
          typeof (
            data as { detail?: unknown }
          ).detail === "string"
            ? (data as { detail: string }).detail
            : data &&
                typeof data === "object" &&
                "message" in data &&
                typeof (
                  data as { message?: unknown }
                ).message === "string"
              ? (data as { message: string }).message
              : "Unable to verify the transformation chain.";

        throw new Error(errorMessage);
      }

      if (
        !data ||
        typeof data !== "object"
      ) {
        throw new Error(
          "The verification server returned an invalid response."
        );
      }

      const responseData =
        data as Record<string, unknown>;

      const chainIntact =
        typeof responseData.chain_intact ===
        "boolean"
          ? responseData.chain_intact
          : false;

      const totalRecords =
        typeof responseData.total_records ===
        "number"
          ? responseData.total_records
          : 0;

      const brokenAtSequence =
        typeof responseData.broken_at_sequence ===
          "number" ||
        typeof responseData.broken_at_sequence ===
          "string"
          ? responseData.broken_at_sequence
          : null;

      const message =
        typeof responseData.message ===
        "string"
          ? responseData.message
          : chainIntact
            ? "The transformation chain is intact."
            : "The transformation chain could not be verified.";

      setResult({
        chain_intact: chainIntact,
        total_records: totalRecords,
        broken_at_sequence:
          brokenAtSequence,
        message,
      });
    } catch (err) {
      setResult(null);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to verify the transformation chain."
      );
    } finally {
      setIsChecking(false);
    }
  };

  /* =====================================================
     RESULT STATE
  ===================================================== */

  const hasNoRecords =
    result !== null &&
    result.total_records === 0;

  const chainIsIntact =
    result !== null &&
    result.total_records > 0 &&
    result.chain_intact;

  const tamperingDetected =
    result !== null &&
    result.total_records > 0 &&
    !result.chain_intact;

  return (
    <main
      className={`min-h-screen overflow-hidden transition-colors duration-300 ${theme.page}`}
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className={`absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full blur-[130px] ${
            darkMode
              ? "bg-violet-700/20"
              : "bg-violet-300/30"
          }`}
        />

        <div
          className={`absolute right-[-10%] top-[15%] h-[500px] w-[500px] rounded-full blur-[130px] ${
            darkMode
              ? "bg-cyan-700/15"
              : "bg-cyan-200/30"
          }`}
        />

        <div
          className={`absolute bottom-[-10%] left-[30%] h-[500px] w-[500px] rounded-full blur-[130px] ${
            darkMode
              ? "bg-purple-700/15"
              : "bg-purple-200/20"
          }`}
        />

        <div
          className={`absolute inset-0 ${
            darkMode ? "opacity-20" : "opacity-40"
          }`}
          style={{
            backgroundImage: darkMode
              ? "linear-gradient(rgba(139,92,246,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.06) 1px, transparent 1px)"
              : "linear-gradient(rgba(80,70,150,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(80,70,150,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav
        className={`fixed left-0 top-0 z-50 w-full border-b backdrop-blur-xl transition-colors duration-300 ${theme.nav}`}
      >
        <div className="mx-auto flex h-[76px] max-w-[1180px] items-center justify-between px-5">
          <Link
            href="/"
            className="flex items-center gap-3 text-xl font-extrabold tracking-tight"
          >
            <div className="grid h-9 w-9 place-items-center rounded-[11px] bg-gradient-to-br from-violet-600 via-indigo-500 to-cyan-400 text-white shadow-lg shadow-violet-300/40">
              ✦
            </div>

            TransForma{" "}
            <span className="text-violet-600">
              AI
            </span>
          </Link>

          <div
            className={`hidden items-center gap-8 text-sm md:flex ${theme.muted}`}
          >
            <Link
              href="/"
              className="transition hover:text-violet-600"
            >
              Home
            </Link>

            <Link
              href="/transform"
              className="transition hover:text-violet-600"
            >
              Transform
            </Link>

            <Link
              href="/verify"
              className="transition hover:text-violet-600"
            >
              Verify
            </Link>

            <Link
              href="/blockchain"
              className="font-semibold text-violet-600"
            >
              Chain Integrity
            </Link>

            <Link
              href="/#features"
              className="transition hover:text-violet-600"
            >
              Features
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className={`relative flex h-10 w-[72px] items-center rounded-full border p-1 transition ${
                darkMode
                  ? "border-slate-700 bg-slate-800"
                  : "border-slate-200 bg-slate-100"
              }`}
            >
              <span
                className={`absolute grid h-8 w-8 place-items-center rounded-full shadow-sm transition-all duration-300 ${
                  darkMode
                    ? "translate-x-7 bg-slate-700"
                    : "translate-x-0 bg-white"
                }`}
              >
                {darkMode ? "🌙" : "☀️"}
              </span>

              <span className="ml-auto mr-1 text-[9px] font-bold text-slate-400">
                {darkMode ? "DARK" : "LIGHT"}
              </span>
            </button>

            <button
              type="button"
              className={`text-2xl sm:hidden ${theme.muted}`}
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>
        </div>
      </nav>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <section className="mx-auto max-w-[1180px] px-5 pb-24 pt-36">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mx-auto max-w-[800px] text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-violet-600">
            <span className="h-2 w-2 rounded-full bg-violet-500 shadow-[0_0_10px_#8b5cf6]" />

            Chain Integrity
          </div>

          <h1
            className={`text-5xl font-extrabold leading-tight tracking-[-0.05em] sm:text-6xl ${theme.heading}`}
          >
            Check the{" "}
            <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
              transformation chain.
            </span>
          </h1>

          <p
            className={`mx-auto mt-6 max-w-[680px] text-base leading-7 ${theme.muted}`}
          >
            Verify whether the complete transformation
            chain remains intact and detect any broken
            sequence in the recorded transformations.
          </p>
        </div>

        {/* =====================================================
            CHECK CARD
        ===================================================== */}

        <div className="mx-auto mt-12 max-w-[720px]">
          <div
            className={`rounded-[28px] border p-8 text-center shadow-xl sm:p-12 ${theme.border} ${theme.card}`}
          >
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-violet-100 to-indigo-100 text-4xl">
              🔗
            </div>

            <h2
              className={`mt-6 text-2xl font-extrabold ${theme.heading}`}
            >
              Chain Integrity Check
            </h2>

            <p
              className={`mx-auto mt-3 max-w-[520px] text-sm leading-6 ${theme.muted}`}
            >
              Check all recorded transformations and
              determine whether the complete chain is
              intact.
            </p>

            <button
              type="button"
              onClick={checkChainIntegrity}
              disabled={isChecking}
              className={`mt-8 inline-flex min-w-[220px] items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-300/30 transition ${
                isChecking
                  ? "cursor-not-allowed opacity-70"
                  : "hover:-translate-y-0.5 hover:shadow-xl"
              }`}
            >
              {isChecking ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Checking...
                </>
              ) : (
                <>
                  <span>✓</span>
                  Check Chain Integrity
                </>
              )}
            </button>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-left text-sm text-red-600">
                <p className="font-bold">
                  Verification failed
                </p>

                <p className="mt-1 leading-6">
                  {error}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* =====================================================
            NO RECORDS
        ===================================================== */}

        {hasNoRecords && (
          <div className="mx-auto mt-8 max-w-[720px]">
            <div
              className={`rounded-[28px] border p-8 text-center shadow-lg ${theme.border} ${theme.card}`}
            >
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-2xl">
                ℹ️
              </div>

              <p
                className={`mt-4 text-lg font-extrabold ${theme.heading}`}
              >
                No transformations recorded yet
              </p>

              <p
                className={`mx-auto mt-2 max-w-[500px] text-sm leading-6 ${theme.muted}`}
              >
                There are currently no transformation
                records available to verify.
              </p>

              <p className="mt-4 text-xs font-semibold text-slate-400">
                {result.message}
              </p>
            </div>
          </div>
        )}

        {/* =====================================================
            CHAIN INTACT
        ===================================================== */}

        {chainIsIntact && (
          <div className="mx-auto mt-8 max-w-[720px]">
            <div className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-8 text-center shadow-xl shadow-emerald-100/50 sm:p-10">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-100 text-3xl text-emerald-600">
                ✓
              </div>

              <p className="mt-5 text-xs font-bold uppercase tracking-wider text-emerald-600">
                Verification Successful
              </p>

              <h2 className="mt-2 text-3xl font-extrabold text-emerald-700">
                Chain is intact
              </h2>

              <p className="mx-auto mt-3 max-w-[520px] text-sm leading-6 text-emerald-700/80">
                The complete transformation chain passed
                the integrity check without any detected
                break.
              </p>

              <div className="mt-7 rounded-2xl border border-emerald-200 bg-white/70 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Total Records
                </p>

                <p className="mt-2 text-3xl font-extrabold text-emerald-700">
                  {result.total_records}
                </p>

                <p className="mt-1 text-xs font-semibold text-emerald-600/70">
                  transformation{" "}
                  {result.total_records === 1
                    ? "record"
                    : "records"}{" "}
                  verified
                </p>
              </div>

              {result.message && (
                <p className="mt-5 text-xs font-medium text-emerald-600/70">
                  {result.message}
                </p>
              )}
            </div>
          </div>
        )}

        {/* =====================================================
            TAMPERING DETECTED
        ===================================================== */}

        {tamperingDetected && (
          <div className="mx-auto mt-8 max-w-[720px]">
            <div className="rounded-[28px] border border-red-200 bg-red-50 p-8 shadow-xl shadow-red-100/50 sm:p-10">
              <div className="text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-red-100 text-3xl text-red-600">
                  ⚠
                </div>

                <p className="mt-5 text-xs font-bold uppercase tracking-wider text-red-500">
                  Integrity Check Failed
                </p>

                <h2 className="mt-2 text-3xl font-extrabold text-red-700">
                  Tampering detected
                </h2>

                <p className="mx-auto mt-3 max-w-[520px] text-sm leading-6 text-red-700/80">
                  The transformation chain contains a
                  broken sequence and could not be verified
                  as intact.
                </p>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-red-200 bg-white/70 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-red-500">
                    Total Records
                  </p>

                  <p className="mt-2 text-2xl font-extrabold text-red-700">
                    {result.total_records}
                  </p>

                  <p className="mt-1 text-xs text-red-500/70">
                    records checked
                  </p>
                </div>

                <div className="rounded-2xl border border-red-200 bg-white/70 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-red-500">
                    Broken At Sequence
                  </p>

                  <p className="mt-2 break-words text-2xl font-extrabold text-red-700">
                    {result.broken_at_sequence ??
                      "Unknown"}
                  </p>

                  <p className="mt-1 text-xs text-red-500/70">
                    detected break position
                  </p>
                </div>
              </div>

              {result.message && (
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-100/70 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-red-500">
                    Details
                  </p>

                  <p className="mt-2 text-sm font-semibold leading-6 text-red-700">
                    {result.message}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer
        className={`border-t ${theme.border} ${theme.footer}`}
      >
        <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-4 px-5 py-8 text-[11px] sm:flex-row">
          <div
            className={`font-bold ${theme.heading}`}
          >
            ✦ TransForma AI
          </div>

          <div className={theme.muted}>
            Chain Integrity Verification
          </div>

          <div
            className={`flex gap-5 ${theme.muted}`}
          >
            <Link
              href="/"
              className="hover:text-violet-600"
            >
              Home
            </Link>

            <Link
              href="/verify"
              className="hover:text-violet-600"
            >
              Verify
            </Link>

            <Link
              href="/blockchain"
              className="hover:text-violet-600"
            >
              Chain
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}