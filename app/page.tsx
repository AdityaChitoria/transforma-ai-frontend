"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const possibilities = [
  {
    icon: "🏛️",
    title: "Government Departments",
    description:
      "Transform complex departmental documents into clear briefings, summaries, advisories and decision-ready communication.",
    output: "→ Department Briefing",
  },
  {
    icon: "📋",
    title: "Policy & Administration",
    description:
      "Convert policies, guidelines and administrative documents into structured, accessible information for officials and stakeholders.",
    output: "→ Policy Summary",
  },
  {
    icon: "📢",
    title: "Public Communication",
    description:
      "Adapt official information into clear public notices, advisories and citizen-focused communication.",
    output: "→ Public Advisory",
  },
  {
    icon: "🚨",
    title: "Emergency & Field Operations",
    description:
      "Turn operational information into concise instructions, alerts and field-ready communication for rapid coordination.",
    output: "→ Operational Brief",
  },
];

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("transforma-theme");

    const isDark = savedTheme === "dark";

    setDarkMode(isDark);

    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    setDarkMode((current) => {
      const next = !current;

      localStorage.setItem(
        "transforma-theme",
        next ? "dark" : "light"
      );

      document.documentElement.classList.toggle("dark", next);

      return next;
    });
  };

  const theme = darkMode
    ? {
        page: "bg-[#0b0d14] text-slate-100",
        nav: "border-slate-800/80 bg-[#10131d]/85",
        card: "border-slate-800 bg-[#121621]",
        soft: "bg-[#171b27]",
        input: "border-slate-700 bg-[#171b27] text-slate-200",
        muted: "text-slate-400",
        border: "border-slate-800",
        heading: "text-white",
        preview: "bg-[#111520]",
        footer: "bg-[#0d1018]",
      }
    : {
        page: "bg-[#f7f8fc] text-[#15182b]",
        nav: "border-slate-200/70 bg-white/75",
        card: "border-slate-200 bg-white",
        soft: "bg-slate-50",
        input: "border-slate-200 bg-slate-50 text-slate-700",
        muted: "text-slate-500",
        border: "border-slate-200",
        heading: "text-[#15182b]",
        preview: "bg-white",
        footer: "bg-white",
      };

  return (
    <main
      className={`min-h-screen overflow-hidden transition-colors duration-300 ${theme.page}`}
    >
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div
          className={`absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full blur-[130px] ${
            darkMode ? "bg-violet-700/20" : "bg-violet-300/30"
          }`}
        />

        <div
          className={`absolute right-[-10%] top-[15%] h-[500px] w-[500px] rounded-full blur-[130px] ${
            darkMode ? "bg-cyan-700/15" : "bg-cyan-200/30"
          }`}
        />

        <div
          className={`absolute bottom-[-10%] left-[30%] h-[500px] w-[500px] rounded-full blur-[130px] ${
            darkMode ? "bg-purple-700/15" : "bg-purple-200/20"
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

      {/* Navbar */}
      <nav
        className={`fixed left-0 top-0 z-50 w-full border-b backdrop-blur-xl transition-colors duration-300 ${theme.nav}`}
      >
        <div className="mx-auto flex h-[76px] max-w-[1180px] items-center justify-between px-5">
          <Link
            href="/"
            className="flex items-center gap-3 text-xl font-extrabold tracking-tight"
          >
            <div className="relative h-9 w-9 overflow-hidden rounded-[11px]">
              <Image
                src="/logo.jpg"
                alt="TransForma AI"
                fill
                className="object-contain"
              />
            </div>


            TransForma <span className="text-violet-600">AI</span>
          </Link>

          <div
            className={`hidden items-center gap-8 text-sm md:flex ${theme.muted}`}
          >
            <Link
              href="/"
              className="font-semibold text-violet-600"
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
              className="transition hover:text-violet-600"
            >
              Chain Integrity
            </Link>


            <a
              href="#possibilities"
              className="transition hover:text-violet-600"
            >
              Possibilities
            </a>

            <a
              href="#how"
              className="transition hover:text-violet-600"
            >
              How It Works
            </a>

            <a
              href="#features"
              className="transition hover:text-violet-600"
            >
              Features
            </a>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
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

            {/* Mobile Menu */}
            <button
              className={`text-2xl sm:hidden ${theme.muted}`}
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-[850px] items-center pb-20 pt-36">
        <div className="mx-auto grid w-full max-w-[1180px] grid-cols-1 items-center gap-16 px-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="z-10 text-center lg:text-left">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-violet-600">
              <span className="h-2 w-2 rounded-full bg-violet-500 shadow-[0_0_10px_#8b5cf6]" />
              AI-Powered Content Transformation
            </div>

            <h1
              className={`text-5xl font-extrabold leading-[0.98] tracking-[-0.065em] sm:text-6xl lg:text-[78px] ${theme.heading}`}
            >
              Transform Content.
              <span className="block bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                Amplify Impact.
              </span>
            </h1>

            <p
              className={`mx-auto mt-7 max-w-[590px] text-lg leading-8 lg:mx-0 ${theme.muted}`}
            >
              One piece of content. Tailored for every audience, purpose,
              tone, language, style and format — powered by intelligent AI
              transformation.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              {/* Start Transforming → Investigate */}
              <Link
                href="/transform"
                className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-violet-200 transition hover:-translate-y-1"
              >
                 Start Transforming
              </Link>

              <a
                href="#how"
                className={`rounded-xl border px-6 py-4 text-sm font-semibold shadow-sm transition hover:border-violet-200 hover:bg-violet-50 ${theme.card}`}
              >
                See How It Works →
              </a>
            </div>
 
          </div>

          {/* Hero Preview */}
          <div className="relative flex min-h-[540px] items-center justify-center">
            <div className="absolute h-[430px] w-[430px] rounded-full bg-violet-300/30 blur-3xl" />

            <div
              className={`relative w-full max-w-[510px] rotate-1 rounded-[23px] border p-5 shadow-2xl backdrop-blur-xl ${theme.card}`}
            >
              <div
                className={`mb-5 flex items-center justify-between border-b pb-4 ${theme.border}`}
              >
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-300" />
                  <span className="h-2 w-2 rounded-full bg-yellow-300" />
                  <span className="h-2 w-2 rounded-full bg-green-300" />
                </div>

                <span
                  className={`text-[10px] uppercase tracking-widest ${theme.muted}`}
                >
                  Transformation Workspace
                </span>
              </div>

              <div
                className={`mb-3 rounded-2xl border p-4 ${theme.border} ${theme.soft}`}
              >
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Source Content
                </p>

                <p className={`text-sm font-bold ${theme.heading}`}>
                  Introduction to Artificial Intelligence
                </p>

                <p className={`mt-1 text-[11px] leading-5 ${theme.muted}`}>
                  Artificial Intelligence is transforming the way humans
                  interact with technology...
                </p>
              </div>

              <div className="my-3 flex items-center gap-3 text-[11px] font-bold text-violet-500">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-violet-200" />
                ✦ AI TRANSFORMATION
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-violet-200" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  ["Target Audience", "General Public"],
                  ["Objective", "Public Communication"],
                  ["Tone", "Professional"],
                  ["Language", "English"],
                  ["Detail", "Concise"],
                  ["Style", "Informative"],
                ].map(([name, value]) => (
                  <div
                    key={name}
                    className={`rounded-xl border p-3 ${theme.border} ${theme.soft}`}
                  >
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      {name}
                    </p>

                    <p
                      className={`mt-1 text-[11px] font-semibold ${theme.heading}`}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-3 rounded-xl border border-cyan-100 bg-gradient-to-br from-violet-50 to-cyan-50 p-4">
                <div className="mb-2 flex justify-between text-[11px] font-bold text-slate-700">
                  <span>Generated Output</span>
                  <span className="text-cyan-600">
                    Executive Summary
                  </span>
                </div>

                <p className="text-[11px] leading-5 text-slate-500">
                  Content transformed for a{" "}
                  <strong>general public audience</strong> using a{" "}
                  <strong>professional</strong> tone, optimized for{" "}
                  <strong>public communication</strong> in{" "}
                  <strong>English</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CHAIN INTEGRITY
      ====================================================== */}

      <section
        id="chain-integrity"
        className="relative overflow-hidden py-24"
      >
        <div className="mx-auto max-w-[1180px] px-5">
          <div
            className={`relative overflow-hidden rounded-[30px] border p-8 shadow-xl transition-colors duration-300 sm:p-12 ${
              darkMode
                ? "border-violet-800/60 bg-gradient-to-br from-[#171329] via-[#121621] to-[#102027]"
                : "border-violet-200 bg-gradient-to-br from-violet-50 via-white to-cyan-50"
            }`}
          >
            {/* Decorative background */}
            <div
              className={`pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl ${
                darkMode ? "bg-violet-700/15" : "bg-violet-300/20"
              }`}
            />

            <div
              className={`pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full blur-3xl ${
                darkMode ? "bg-cyan-700/10" : "bg-cyan-300/20"
              }`}
            />

            <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              {/* LEFT */}
              <div>
                <div
                  className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${
                    darkMode
                      ? "border-violet-800 bg-violet-950/40 text-violet-300"
                      : "border-violet-200 bg-white/80 text-violet-600"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-violet-500" />
                  Chain Integrity
                </div>

                <h2
                  className={`max-w-[650px] text-3xl font-extrabold tracking-tight sm:text-4xl ${theme.heading}`}
                >
                  Check whether your{" "}
                  <span className="bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent">
                    transformation chain is intact.
                  </span>
                </h2>

                <p
                  className={`mt-5 max-w-[620px] text-sm leading-7 sm:text-base ${theme.muted}`}
                >
                  Verify the complete transformation chain and
                  check whether any recorded transformation has
                  been altered, disconnected, or removed.
                </p>

                <p
                  className={`mt-4 max-w-[620px] text-xs leading-6 ${theme.muted}`}
                >
                  The integrity check verifies the chain recorded
                  by TransForma AI and reports the exact sequence
                  where a break is detected.
                </p>

                <Link
                  href="/blockchain"
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-violet-300"
                >
                  Check Chain Integrity
                  <span>→</span>
                </Link>
              </div>

              {/* RIGHT - VISUAL */}
              <div className="relative">
                <div
                  className={`rounded-2xl border p-5 shadow-lg ${
                    darkMode
                      ? "border-slate-700 bg-[#111520]/90"
                      : "border-violet-100 bg-white/90"
                  }`}
                >
                  <div
                    className={`flex items-center justify-between border-b pb-4 ${
                      darkMode
                        ? "border-slate-700"
                        : "border-slate-100"
                    }`}
                  >
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Integrity Check
                      </p>

                      <p
                        className={`mt-1 text-sm font-bold ${theme.heading}`}
                      >
                        Transformation Chain
                      </p>
                    </div>

                    <span className="rounded-lg bg-violet-50 px-2.5 py-1.5 text-[9px] font-bold text-violet-600">
                      VERIFY
                    </span>
                  </div>

                  <div className="mt-5 space-y-3">
                    <div
                      className={`flex items-center gap-3 rounded-xl border p-3 ${
                        darkMode
                          ? "border-slate-700 bg-[#171b27]"
                          : "border-slate-100 bg-slate-50"
                      }`}
                    >
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-violet-100 text-sm">
                        1
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-[10px] font-bold ${theme.heading}`}
                        >
                          Transformation Record
                        </p>

                        <p className="mt-0.5 text-[9px] text-slate-400">
                          Stored chain entry
                        </p>
                      </div>

                      <span className="text-emerald-500">✓</span>
                    </div>

                    <div className="flex justify-center text-violet-400">
                      ↓
                    </div>

                    <div
                      className={`flex items-center gap-3 rounded-xl border p-3 ${
                        darkMode
                          ? "border-slate-700 bg-[#171b27]"
                          : "border-slate-100 bg-slate-50"
                      }`}
                    >
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-cyan-100 text-sm">
                        2
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-[10px] font-bold ${theme.heading}`}
                        >
                          Previous Hash Link
                        </p>

                        <p className="mt-0.5 text-[9px] text-slate-400">
                          Chain connection
                        </p>
                      </div>

                      <span className="text-emerald-500">✓</span>
                    </div>

                    <div
                      className={`mt-4 rounded-xl border p-4 text-center ${
                        darkMode
                          ? "border-emerald-800/50 bg-emerald-950/20"
                          : "border-emerald-100 bg-emerald-50"
                      }`}
                    >
                      <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600">
                        Chain Status
                      </p>

                      <p className="mt-1 text-xs font-bold text-emerald-700">
                        Ready to verify
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Possibilities */}
      <section id="possibilities" className="py-28">
        <div className="mx-auto max-w-[1180px] px-5">
          <div className="mb-14 max-w-[800px]">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-violet-600">
              <span className="h-2 w-2 rounded-full bg-violet-500" />
              One Source. Many Possibilities.
            </div>

            <h2
              className={`text-4xl font-extrabold tracking-tight sm:text-5xl ${theme.heading}`}
            >
              Same content.{" "}
              <span className="bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent">
                Completely different impact.
              </span>
            </h2>

            <p className={`mt-5 text-base ${theme.muted}`}>
              Adapt one source into exactly what your audience needs — without
              starting from scratch.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {possibilities.map((item) => (
              <div
                key={item.title}
                className={`group min-h-[260px] rounded-2xl border p-6 shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100 ${theme.card} ${theme.border}`}
              >
                <div className="mb-6 grid h-11 w-11 place-items-center rounded-xl border border-violet-100 bg-violet-50 text-xl">
                  {item.icon}
                </div>

                <h3 className={`text-base font-bold ${theme.heading}`}>
                  {item.title}
                </h3>

                <p className={`mt-2 text-xs leading-6 ${theme.muted}`}>
                  {item.description}
                </p>

                <div className="mt-5 border-t border-slate-100 pt-4 text-[10px] font-bold text-violet-600">
                  {item.output}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features">
        <div
          className={`mx-auto grid max-w-[1180px] grid-cols-1 border-y sm:grid-cols-2 lg:grid-cols-4 ${theme.border}`}
        >
          {[
            ["🎯 Audience-Aware", "Content adapts to who will read it."],
            ["🌐 Multilingual", "English and Hindi (Currently)."],
            ["✦ AI-Powered", "Intelligent transformation, not simple rewriting."],
            ["⚡ Multi-Format", "Create briefs, reports, advisories, posts and more."],
          ].map(([title, description]) => (
            <div
              key={title}
              className={`border-b px-6 py-8 last:border-0 sm:[&:nth-child(even)]:border-l lg:border-b-0 lg:border-r lg:[&:nth-child(even)]:border-l-0 lg:last:border-r-0 ${theme.border}`}
            >
              <strong
                className={`block text-sm font-bold ${theme.heading}`}
              >
                {title}
              </strong>

              <span className={`mt-1 block text-[11px] ${theme.muted}`}>
                {description}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-28">
        <div className="mx-auto max-w-[1180px] px-5">
          <div className="mb-14 max-w-[700px]">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-violet-600">
              <span className="h-2 w-2 rounded-full bg-violet-500" />
              Simple Workflow
            </div>

            <h2
              className={`text-4xl font-extrabold tracking-tight sm:text-5xl ${theme.heading}`}
            >
              From source to{" "}
              <span className="bg-gradient-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent">
                impact.
              </span>
            </h2>

            <p className={`mt-5 text-base ${theme.muted}`}>
              Three simple steps. Endless possibilities.
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            {[
              [
                "01",
                "Upload",
                "Add your document, text or source content to TransForma AI.",
              ],
              [
                "02",
                "Customize",
                "Select your audience, objective, tone, language, detail, style and output.",
              ],
              [
                "03",
                "Transform",
                "Let AI generate content designed specifically for your chosen communication goal.",
              ],
            ].map(([number, title, description]) => (
              <div key={number} className="text-center">
                <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full border border-violet-200 bg-white font-extrabold text-violet-600 shadow-lg shadow-violet-100">
                  {number}
                </div>

                <h3 className={`text-lg font-bold ${theme.heading}`}>
                  {title}
                </h3>

                <p
                  className={`mx-auto mt-2 max-w-[280px] text-xs leading-6 ${theme.muted}`}
                >
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t ${theme.border} ${theme.footer}`}>
        <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-4 px-5 py-8 text-[11px] sm:flex-row">
          <div className={`font-bold ${theme.heading}`}>
            ✦ TransForma AI
          </div>

          <div className={theme.muted}>
            AI-Powered Content Transformation Platform
          </div>

          <div className={`flex gap-5 ${theme.muted}`}>
            <a href="#" className="hover:text-violet-600">
              Privacy
            </a>

            <a href="#" className="hover:text-violet-600">
              Terms
            </a>

            <a href="#" className="hover:text-violet-600">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
