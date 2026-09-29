"use client";
import Image from "next/image";
import Link from "next/link";
import {
  ChangeEvent,
  DragEvent,
  useEffect,
  useState,
} from "react";

type VerificationStatus =
  | "idle"
  | "verifying"
  | "verified"
  | "failed";

type SelectedFile = {
  file: File;
  id: string;
};

type VerificationResult = {
  verdict: string;
  message: string;
  transformation_id?: string;
  timestamp?: string;
  user_id?: string | null;
  input_hash?: string;
  output_hash?: string;
};

export default function VerifyPage() {
  /*
   * =========================================================
   * THEME
   * =========================================================
   */

  const [darkMode, setDarkMode] = useState(false);

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

  /*
   * =========================================================
   * FILE STATE
   * =========================================================
   */

  const [inputFile, setInputFile] =
    useState<SelectedFile | null>(null);

  const [outputFile, setOutputFile] =
    useState<SelectedFile | null>(null);

  const [inputDragActive, setInputDragActive] =
    useState(false);

  const [outputDragActive, setOutputDragActive] =
    useState(false);

  const [status, setStatus] =
    useState<VerificationStatus>("idle");

  const [verificationResult, setVerificationResult] =
    useState<VerificationResult | null>(null);

  /*
   * =========================================================
   * THEME CLASSES
   * =========================================================
   */

  const theme = darkMode
    ? {
        page:
          "bg-[#0b0d14] text-slate-100",

        nav:
          "border-slate-800/80 bg-[#10131d]/85",

        card:
          "border-slate-800 bg-[#121621]",

        soft:
          "bg-[#171b27]",

        input:
          "border-slate-700 bg-[#171b27] text-slate-200",

        muted:
          "text-slate-400",

        border:
          "border-slate-800",

        heading:
          "text-white",

        preview:
          "bg-[#111520]",

        footer:
          "bg-[#0d1018]",
      }
    : {
        page:
          "bg-[#f7f8fc] text-[#15182b]",

        nav:
          "border-slate-200/70 bg-white/75",

        card:
          "border-slate-200 bg-white",

        soft:
          "bg-slate-50",

        input:
          "border-slate-200 bg-slate-50 text-slate-700",

        muted:
          "text-slate-500",

        border:
          "border-slate-200",

        heading:
          "text-[#15182b]",

        preview:
          "bg-white",

        footer:
          "bg-white",
      };

  /*
   * =========================================================
   * FILE HELPERS
   * =========================================================
   */

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(
      1
    )} MB`;
  };

  const createSelectedFile = (
    file: File
  ): SelectedFile => ({
    file,
    id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
  });

  /*
   * =========================================================
   * FILE VALIDATION
   * =========================================================
   */

  const acceptedExtensions = [
    ".pdf",
    ".doc",
    ".docx",
    ".txt",
    ".jpg",
    ".jpeg",
    ".png",
    ".pptx",
  ];

  const isSupportedFile = (file: File) => {
    const name = file.name.toLowerCase();

    return acceptedExtensions.some(
      (extension) =>
        name.endsWith(extension)
    );
  };

  /*
   * =========================================================
   * INPUT FILE
   * =========================================================
   */

  const selectInputFile = (file: File) => {
    if (!isSupportedFile(file)) {
      alert(
        "Unsupported file format.\n\nAllowed formats:\nPDF, DOC, DOCX, TXT, JPG, JPEG, PNG, PPTX."
      );

      return;
    }

    setInputFile(createSelectedFile(file));

    setStatus("idle");
    setVerificationResult(null);
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      selectInputFile(file);
    }

    event.target.value = "";
  };

  const handleInputDrop = (
    event: DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();

    setInputDragActive(false);

    const file =
      event.dataTransfer.files?.[0];

    if (file) {
      selectInputFile(file);
    }
  };

  /*
   * =========================================================
   * OUTPUT FILE
   * =========================================================
   */

  const selectOutputFile = (file: File) => {
    if (!isSupportedFile(file)) {
      alert(
        "Unsupported file format.\n\nAllowed formats:\nPDF, DOC, DOCX, TXT, JPG, JPEG, PNG, PPTX."
      );

      return;
    }

    setOutputFile(
      createSelectedFile(file)
    );

    setStatus("idle");
    setVerificationResult(null);
  };

  const handleOutputChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      selectOutputFile(file);
    }

    event.target.value = "";
  };

  const handleOutputDrop = (
    event: DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();

    setOutputDragActive(false);

    const file =
      event.dataTransfer.files?.[0];

    if (file) {
      selectOutputFile(file);
    }
  };

  /*
   * =========================================================
   * REMOVE FILES
   * =========================================================
   */

  const removeInputFile = () => {
    setInputFile(null);
    setStatus("idle");
    setVerificationResult(null);
  };

  const removeOutputFile = () => {
    setOutputFile(null);
    setStatus("idle");
    setVerificationResult(null);
  };

  /*
   * =========================================================
   * VERIFY
   * =========================================================
   */

  const handleVerify = async () => {
    if (!inputFile || !outputFile) {
      return;
    }

    setStatus("verifying");
    setVerificationResult(null);

    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "http://127.0.0.1:8000";

    const formData = new FormData();

    formData.append("input_file", inputFile.file);
    formData.append("output_file", outputFile.file);

    try {
      const response = await fetch(
        `${apiBaseUrl.replace(/\/$/, "")}/verify`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.detail ||
            result?.message ||
            "Verification request failed."
        );
      }

      setVerificationResult(result);

      setStatus(
        result?.verdict ===
          "output_was_generated_by_input"
          ? "verified"
          : "failed"
      );
    } catch (error) {
      console.error(
        "[browser] Verification error:",
        error
      );

      setVerificationResult({
        verdict: "request_failed",
        message:
          error instanceof Error
            ? error.message
            : "Unable to connect to the verification server.",
      });

        setStatus("failed");
    }
  };

  /*
   * =========================================================
   * RESULT RESET
   * =========================================================
   */

  const startNewVerification = () => {
    setInputFile(null);
    setOutputFile(null);
    setStatus("idle");
    setVerificationResult(null);
  };

  /*
   * =========================================================
   * FILE UPLOAD COMPONENT
   * =========================================================
   */

  const renderUploadBox = (
    type: "input" | "output"
  ) => {
    const isInput = type === "input";

    const selectedFile = isInput
      ? inputFile
      : outputFile;

    const dragActive = isInput
      ? inputDragActive
      : outputDragActive;

    const setDragActive = isInput
      ? setInputDragActive
      : setOutputDragActive;

    const handleChange = isInput
      ? handleInputChange
      : handleOutputChange;

    const handleDrop = isInput
      ? handleInputDrop
      : handleOutputDrop;

    const removeFile = isInput
      ? removeInputFile
      : removeOutputFile;

    return (
      <div>
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-violet-100 to-cyan-100 text-sm">
              {isInput ? "📄" : "✦"}
            </div>

            <div>
              <h2
                className={`text-sm font-bold ${theme.heading}`}
              >
                {isInput
                  ? "Input File"
                  : "Output File"}
              </h2>

              <p
                className={`mt-0.5 text-[10px] ${theme.muted}`}
              >
                {isInput
                  ? "The original source submitted to the platform."
                  : "The transformed file provided by the platform."}
              </p>
            </div>
          </div>
        </div>

        <div
          onDragEnter={(event) => {
            event.preventDefault();

            if (!selectedFile) {
              setDragActive(true);
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();

            if (!selectedFile) {
              setDragActive(true);
            }
          }}
          onDragLeave={(event) => {
            event.preventDefault();

            setDragActive(false);
          }}
          onDrop={handleDrop}
          className={`rounded-2xl border-2 border-dashed p-6 text-center transition ${
            dragActive
              ? "border-violet-500 bg-violet-50 dark:bg-violet-950/20"
              : `${theme.border} ${theme.soft}`
          }`}
        >
          <input
            id={`${type}-file`}
            type="file"
            accept={acceptedExtensions.join(",")}
            className="hidden"
            onChange={handleChange}
          />

          {!selectedFile ? (
            <label
              htmlFor={`${type}-file`}
              className="block cursor-pointer"
            >
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-100 to-cyan-100 text-2xl">
                {isInput ? "↑" : "↓"}
              </div>

              <h3
                className={`mt-4 text-sm font-bold ${theme.heading}`}
              >
                {isInput
                  ? "Drop your input file here"
                  : "Drop your output file here"}
              </h3>

              <p
                className={`mt-2 text-xs ${theme.muted}`}
              >
                or click to browse
              </p>

              <p className="mt-3 text-[9px] font-medium text-slate-400">
                PDF · DOC · DOCX · TXT · JPG ·
                JPEG · PNG · PPTX
              </p>
            </label>
          ) : (
            <div className="flex items-center justify-between gap-3 text-left">
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-100 to-cyan-100 text-lg">
                  📄
                </div>

                <div className="min-w-0">
                  <p
                    className={`truncate text-xs font-bold ${theme.heading}`}
                  >
                    {selectedFile.file.name}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-400">
                    {formatFileSize(
                      selectedFile.file.size
                    )}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={removeFile}
                className="shrink-0 rounded-lg px-2.5 py-2 text-[10px] font-semibold text-slate-400 transition hover:bg-red-50 hover:text-red-500"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <main
      className={`min-h-screen overflow-hidden transition-colors duration-300 ${theme.page}`}
    >
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 -z-10">
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
            darkMode
              ? "opacity-20"
              : "opacity-40"
          }`}
          style={{
            backgroundImage:
              darkMode
                ? "linear-gradient(rgba(139,92,246,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.06) 1px, transparent 1px)"
                : "linear-gradient(rgba(80,70,150,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(80,70,150,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* =====================================================
          NAVBAR
      ====================================================== */}

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
              className="font-semibold text-violet-600"
            >
              Verify
            </Link>

            <Link
              href="/blockchain"
              className="transition hover:text-violet-600"
            >
              Chain Integrity
            </Link>

            <Link
              href="/#possibilities"
              className="transition hover:text-violet-600"
            >
              Possibilities
            </Link>

            <Link
              href="/#how"
              className="transition hover:text-violet-600"
            >
              How It Works
            </Link>

            <Link
              href="/#features"
              className="transition hover:text-violet-600"
            >
              Features
            </Link>
          </div>

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
        </div>
      </nav>

      {/* =====================================================
          HEADER
      ====================================================== */}

      <section className="pb-10 pt-32">
        <div className="mx-auto max-w-[1180px] px-5">
          <div className="mx-auto max-w-[800px] text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-violet-600">
              <span className="h-2 w-2 rounded-full bg-violet-500 shadow-[0_0_10px_#8b5cf6]" />

              Content Verification
            </div>

            <h1
              className={`text-4xl font-extrabold tracking-tight sm:text-6xl ${theme.heading}`}
            >
              Verify your{" "}
              <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                content.
              </span>
            </h1>

            <p
              className={`mx-auto mt-5 max-w-[650px] text-base leading-7 ${theme.muted}`}
            >
              Check whether your input file was previously
              used on TransForma AI, whether the output
              belongs to the platform record, and whether
              the output has been altered.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN VERIFICATION AREA
      ====================================================== */}

      <section className="pb-24">
        <div className="mx-auto max-w-[1180px] px-5">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">

            {/* =================================================
                UPLOAD CARD
            ================================================== */}

            <div
              className={`rounded-[26px] border p-6 shadow-xl shadow-slate-200/20 sm:p-7 ${theme.card} ${theme.border}`}
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-violet-600">
                  Verification Input
                </p>

                <h2
                  className={`mt-2 text-2xl font-extrabold ${theme.heading}`}
                >
                  Submit both files
                </h2>

                <p
                  className={`mt-2 text-sm leading-6 ${theme.muted}`}
                >
                  Provide the original input and the output
                  file you received from the platform.
                </p>
              </div>

              <div className="mt-7 grid gap-5">
                {renderUploadBox("input")}
                {renderUploadBox("output")}
              </div>

              {/* VERIFY BUTTON */}

              <button
                type="button"
                onClick={handleVerify}
                disabled={
                  !inputFile ||
                  !outputFile ||
                  status === "verifying"
                }
                className="mt-7 w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 py-4 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-violet-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status === "verifying"
                  ? "✦ Verifying..."
                  : "🔐 Verify Content"}
              </button>

              <p
                className={`mt-3 text-center text-[10px] ${theme.muted}`}
              >
                Both input and output files are required
                to perform verification.
              </p>
            </div>

            {/* =================================================
                RESULT CARD
            ================================================== */}

            <div
              className={`rounded-[26px] border p-6 shadow-xl shadow-slate-200/20 sm:p-7 ${theme.card} ${theme.border}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Verification Status
                  </p>

                  <h2
                    className={`mt-2 text-2xl font-extrabold ${theme.heading}`}
                  >
                    Verification Result
                  </h2>
                </div>

                <span
                  className={`rounded-lg px-3 py-1.5 text-[9px] font-bold ${
                    status === "verified"
                      ? "bg-emerald-50 text-emerald-600"
                      : status === "failed"
                      ? "bg-red-50 text-red-600"
                      : status === "verifying"
                      ? "bg-violet-50 text-violet-600"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {status === "verified"
                    ? "VERIFIED"
                    : status === "failed"
                    ? "FAILED"
                    : status === "verifying"
                    ? "CHECKING"
                    : "WAITING"}
                </span>
              </div>

              {/* =================================================
                  IDLE
              ================================================== */}

              {status === "idle" && (
                <div className="flex min-h-[430px] flex-col items-center justify-center text-center">
                  <div className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-violet-100 to-cyan-100 text-3xl">
                    🔐
                  </div>

                  <h3
                    className={`mt-6 text-lg font-bold ${theme.heading}`}
                  >
                    Ready to verify
                  </h3>

                  <p
                    className={`mt-2 max-w-[380px] text-xs leading-6 ${theme.muted}`}
                  >
                    Upload both files on the left and start
                    the verification process.
                  </p>

                  <div
                    className={`mt-7 w-full max-w-[400px] rounded-xl border p-4 text-left ${theme.border} ${theme.soft}`}
                  >
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Backend verification
                    </p>

                    <div className="mt-3 space-y-3">
                      {[
                        "Check the input hash against platform records",
                        "Check the output hash against generated outputs",
                        "Return the verification verdict",
                        "Return transformation metadata when matched",
                      ].map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-3"
                        >
                          <span className="text-violet-500">
                            ✓
                          </span>

                          <span
                            className={`text-xs ${theme.muted}`}
                          >
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================
                  VERIFYING
              ================================================== */}

              {status === "verifying" && (
                <div className="flex min-h-[430px] flex-col items-center justify-center text-center">
                  <div className="relative grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-violet-100 to-cyan-100">
                    <div className="absolute inset-0 animate-ping rounded-3xl bg-violet-300/30" />
                    <span className="relative text-3xl">🔐</span>
                  </div>

                  <h3
                    className={`mt-6 text-lg font-bold ${theme.heading}`}
                  >
                    Verifying files
                  </h3>

                  <p
                    className={`mt-2 max-w-[380px] text-xs leading-6 ${theme.muted}`}
                  >
                    Processing both files and checking their hashes against the platform record.
                  </p>

                  <div className="mt-7 w-full max-w-[350px]">
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-violet-600 to-cyan-500" />
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================
                  VERIFIED / FAILED RESULT
              ================================================== */}

              {(status === "verified" || status === "failed") && verificationResult && (
                <div className="mt-7 space-y-5">
                  <div
                    className={`rounded-2xl border p-6 text-center ${
                      status === "verified"
                        ? "border-emerald-100 bg-emerald-50"
                        : "border-red-100 bg-red-50"
                    }`}
                  >
                    <div
                      className={`mx-auto grid h-16 w-16 place-items-center rounded-full text-2xl ${
                        status === "verified"
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {status === "verified" ? "✓" : "×"}
                    </div>

                    <p
                      className={`mt-4 text-[10px] font-bold uppercase tracking-widest ${
                        status === "verified"
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {status === "verified"
                        ? "Verification successful"
                        : "Verification failed"}
                    </p>

                    <h3
                      className={`mt-2 text-xl font-extrabold ${theme.heading}`}
                    >
                      {verificationResult.verdict}
                    </h3>

                    <p className={`mt-2 text-xs leading-6 ${theme.muted}`}>
                      {verificationResult.message}
                    </p>
                  </div>

                  <div
                    className={`rounded-2xl border p-5 ${theme.border} ${theme.soft}`}
                  >
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Verification Data
                    </p>

                    <div className="mt-4 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <span className={`text-xs ${theme.muted}`}>
                          Verdict
                        </span>
                        <span className={`text-right text-xs font-bold ${theme.heading}`}>
                          {verificationResult.verdict}
                        </span>
                      </div>

                      {verificationResult.transformation_id && (
                        <div className="flex items-start justify-between gap-4">
                          <span className={`text-xs ${theme.muted}`}>
                            Transformation ID
                          </span>
                          <span className={`max-w-[60%] break-all text-right font-mono text-xs font-bold ${theme.heading}`}>
                            {verificationResult.transformation_id}
                          </span>
                        </div>
                      )}

                      {verificationResult.timestamp && (
                        <div className="flex items-start justify-between gap-4">
                          <span className={`text-xs ${theme.muted}`}>
                            Generated At
                          </span>
                          <span className={`text-right text-xs font-semibold ${theme.heading}`}>
                            {new Date(verificationResult.timestamp).toLocaleString()}
                          </span>
                        </div>
                      )}

                      {verificationResult.user_id && (
                        <div className="flex items-start justify-between gap-4">
                          <span className={`text-xs ${theme.muted}`}>
                            User ID
                          </span>
                          <span className={`max-w-[60%] break-all text-right text-xs font-semibold ${theme.heading}`}>
                            {verificationResult.user_id}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {(verificationResult.input_hash || verificationResult.output_hash) && (
                    <div
                      className={`rounded-2xl border p-5 ${theme.border} ${theme.soft}`}
                    >
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Content Hashes
                      </p>

                      <div className="mt-4 space-y-4">
                        {verificationResult.input_hash && (
                          <div>
                            <p className={`text-xs font-semibold ${theme.heading}`}>
                              Input Hash
                            </p>
                            <p className="mt-1 break-all font-mono text-[10px] leading-5 text-slate-500">
                              {verificationResult.input_hash}
                            </p>
                          </div>
                        )}

                        {verificationResult.output_hash && (
                          <div>
                            <p className={`text-xs font-semibold ${theme.heading}`}>
                              Output Hash
                            </p>
                            <p className="mt-1 break-all font-mono text-[10px] leading-5 text-slate-500">
                              {verificationResult.output_hash}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={startNewVerification}
                    className="w-full rounded-xl border border-violet-200 py-3 text-xs font-bold text-violet-600 transition hover:bg-violet-50"
                  >
                    Verify Another File
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* =================================================
              HOW VERIFICATION WORKS
          ================================================== */}

          <div className="mt-8">
            <div
              className={`rounded-[26px] border p-6 sm:p-7 ${theme.card} ${theme.border}`}
            >
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-violet-600">
                  Verification Process
                </p>

                <h2
                  className={`mt-2 text-2xl font-extrabold ${theme.heading}`}
                >
                  How verification works
                </h2>

                <p
                  className={`mx-auto mt-2 max-w-[650px] text-sm ${theme.muted}`}
                >
                  TransForma checks the relationship between
                  your original input, the platform output,
                  and the recorded verification history.
                </p>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-4">
                {[
                  [
                    "01",
                    "Submit",
                    "Upload the original input and the output file.",
                  ],
                  [
                    "02",
                    "Identify",
                    "Check whether both files exist in platform records.",
                  ],
                  [
                    "03",
                    "Compare",
                    "Compare the submitted output with the recorded platform output.",
                  ],
                  [
                    "04",
                    "Verify",
                    "Return the verdict and available transformation metadata.",
                  ],
                ].map(
                  ([number, title, description]) => (
                    <div
                      key={number}
                      className={`rounded-2xl border p-5 text-center ${theme.border} ${theme.soft}`}
                    >
                      <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-500 text-xs font-bold text-white">
                        {number}
                      </div>

                      <h3
                        className={`mt-4 text-sm font-bold ${theme.heading}`}
                      >
                        {title}
                      </h3>

                      <p
                        className={`mt-2 text-[11px] leading-5 ${theme.muted}`}
                      >
                        {description}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}

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
            AI-Powered Content Transformation Platform
          </div>

          <div
            className={`flex gap-5 ${theme.muted}`}
          >
            <Link
              href="/#features"
              className="transition hover:text-violet-600"
            >
              Features
            </Link>

            <Link
              href="/#how"
              className="transition hover:text-violet-600"
            >
              How It Works
            </Link>

            <Link
              href="/verify"
              className="font-semibold text-violet-600"
            >
              Verify
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
