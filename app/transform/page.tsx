"use client";

import Link from "next/link";
import {
  ChangeEvent,
  DragEvent,
  useEffect,
  useRef,
  useState,
} from "react";

const fieldOptions = {
  "Target Audience": [
    "School Student",
    "College Student",
    "Professional",
    "Department Head",
    "General Public",
    "Security Organisation",
    "Local Organisation",
    "Government Official",
    "Researcher",
    "Media / Journalist",
    "Creator",
    "Teacher / Educator",
    "Policy Maker",
    "NGO / Civil Society",
  ],

  "Communication Objective": [
    "Educate",
    "Briefing",
    "Awareness",
    "Reporting",
    "Public Communication",
    "Persuasion",
    "Instruction",
    "Information Sharing",
    "Policy Communication",
    "Decision Support",
    "Announcement",
    "Emergency Communication",
  ],

  Tone: [
    "Formal",
    "Professional",
    "Simple",
    "Technical",
    "Friendly",
    "Authoritative",
    "Neutral",
    "Persuasive",
    "Urgent",
    "Informative",
    "Conversational",
  ],

  Language: [
    "English",
    "Hindi",
    "Bengali",
    "Telugu",
    "Marathi",
    "Tamil",
    "Gujarati",
    "Kannada",
    "Malayalam",
    "Punjabi",
    "Odia",
    "Assamese",
    "Urdu",
    "Kashmiri",
    "Konkani",
    "Maithili",
    "Nepali",
    "Sanskrit",
    "Sindhi",
    "French",
    "German",
    "Spanish",
    "Arabic",
    "Chinese",
    "Japanese",
  ],

  "Level of Detail": [
    "Concise",
    "Moderate",
    "Detailed",
    "Comprehensive",
  ],

  "Content Style": [
    "Informative",
    "Educational",
    "Executive",
    "Public Information",
    "Technical",
    "Policy",
    "News / Media",
    "Conversational",
    "Instructional",
    "Analytical",
  ],

  "Output Type": [
    "Executive Summary",
    "Press Release",
    "Advisory",
    "Social Media Post",
    "Presentation",
    "Study Notes",
    "Briefing Note",
    "Report",
    "Email",
    "Speech",
    "Public Notice",
    "FAQ",
    "Infographic Content",
    "Policy Summary",
    "Meeting Minutes",
    "Newsletter",
    "Article",
  ],

  "Output Format": [
    "PDF",
    "DOCX",
    "PNG",
  ],
};

const initialParameters = {
  "Target Audience": "General Public",
  "Communication Objective": "Public Communication",
  Tone: "Professional",
  Language: "English",
  "Level of Detail": "Concise",
  "Content Style": "Informative",
  "Output Type": "Executive Summary",
  "Output Format": "PDF",
};

type ParameterName = keyof typeof fieldOptions;

type UploadedFile = {
  file: File;
  id: string;
};

export default function TransformPage() {
  /*
   * THEME
   * Uses the exact same localStorage key as the homepage.
   */
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


  /*
   * TRANSFORMATION SETTINGS
   */
  const [selected, setSelected] =
    useState<Record<ParameterName, string>>(initialParameters);
  useEffect(() => {
    const savedSettings = sessionStorage.getItem(
      "transforma-settings"
    );

    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);

        setSelected({
          ...initialParameters,
          ...parsedSettings,
        });
      } catch {
        sessionStorage.removeItem("transforma-settings");
      }
    }
  }, []);


  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [sourceText, setSourceText] = useState("");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateParameter = (
    name: ParameterName,
    value: string
  ) => {
    setSelected((current) => {
      const updated = {
        ...current,
        [name]: value,
      };

      sessionStorage.setItem(
        "transforma-settings",
        JSON.stringify(updated)
      );

      return updated;
    });

    setHasGenerated(false);
  };


  /*
   * FILE UPLOAD
   */
  const addFiles = (files: FileList | File[]) => {
    const acceptedExtensions = [
      ".pdf",
      ".doc",
      ".docx",
      ".txt",
      ".md",
      ".csv",
      ".rtf",
      ".png",
      ".jpeg",
      ".webp",
      ".jpg",
    ];

    const incomingFiles = Array.from(files).filter((file) => {
      const lowerName = file.name.toLowerCase();

      return acceptedExtensions.some((extension) =>
        lowerName.endsWith(extension)
      );
    });

    const mappedFiles: UploadedFile[] = incomingFiles.map((file) => ({
      file,
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
    }));

    setUploadedFiles((current) => [
      ...current,
      ...mappedFiles,
    ]);

    setHasGenerated(false);
  };

  const handleFileInput = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      addFiles(event.target.files);
    }

    event.target.value = "";
  };

  const handleDrop = (
    event: DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    setDragActive(false);

    if (event.dataTransfer.files) {
      addFiles(event.dataTransfer.files);
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles((current) =>
      current.filter((item) => item.id !== id)
    );

    setSourceText("");
    setHasGenerated(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  /*
   * TRANSFORM
   *
   * This is still a frontend simulation.
   * Later you can replace this with your API call.
   */

 const handleTransform = async () => {
  if (!uploadedFiles.length && !sourceText.trim()) {
    return;
  }

  setIsTransforming(true);
  setHasGenerated(false);

  try {
    const formData = new FormData();

    formData.append("source_text", sourceText);

    uploadedFiles.forEach((item) => {
      formData.append("files", item.file);
    });

    formData.append(
      "additional_instructions",
      additionalInstructions
    );

    formData.append(
      "audience",
      selected["Target Audience"]
    );

    formData.append(
      "objective",
      selected["Communication Objective"]
    );

    formData.append(
      "tone",
      selected["Tone"]
    );

    formData.append(
      "language",
      selected["Language"]
    );

    formData.append(
      "detail_level",
      selected["Level of Detail"]
    );

    formData.append(
      "content_style",
      selected["Content Style"]
    );

    formData.append(
      "output_type",
      selected["Output Type"]
    );

    formData.append(
      "output_format",
      selected["Output Format"]
    );

    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "https://transforma-ai-api.onrender.com";

    const response = await fetch(
      `${apiBaseUrl.replace(/\/$/, "")}/transform`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        errorBody || `Transformation failed (${response.status}).`
      );
    }

    const blob = await response.blob();

    const downloadUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `transformed_content.${selected[
      "Output Format"
    ].toLowerCase()}`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(downloadUrl);

    setHasGenerated(true);
  } catch (error) {
    console.error("Transformation error:", error);
    alert(
      error instanceof Error
        ? error.message
        : "Transformation failed. Please try again."
    );
  } finally {
    setIsTransforming(false);
  }
};

  /*
   * SAME THEME SYSTEM AS HOMEPAGE
   */
  const theme = darkMode
    ? {
      page: "bg-[#0b0d14] text-slate-100",
      nav: "border-slate-800/80 bg-[#10131d]/85",
      card: "border-slate-800 bg-[#121621]",
      soft: "bg-[#171b27]",
      input:
        "border-slate-700 bg-[#171b27] text-slate-200",
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
      input:
        "border-slate-200 bg-slate-50 text-slate-700",
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
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 -z-10">
        <div
          className={`absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full blur-[130px] ${darkMode
            ? "bg-violet-700/20"
            : "bg-violet-300/30"
            }`}
        />

        <div
          className={`absolute right-[-10%] top-[15%] h-[500px] w-[500px] rounded-full blur-[130px] ${darkMode
            ? "bg-cyan-700/15"
            : "bg-cyan-200/30"
            }`}
        />

        <div
          className={`absolute bottom-[-10%] left-[30%] h-[500px] w-[500px] rounded-full blur-[130px] ${darkMode
            ? "bg-purple-700/15"
            : "bg-purple-200/20"
            }`}
        />

        <div
          className={`absolute inset-0 ${darkMode ? "opacity-20" : "opacity-40"
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
====================================================== */}

      <nav
        className={`fixed left-0 top-0 z-50 w-full border-b backdrop-blur-xl transition-colors duration-300 ${theme.nav}`}
      >
        <div className="mx-auto flex h-[76px] max-w-[1180px] items-center justify-between px-5">
          {/* Logo */}

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

          {/* Desktop Navigation */}

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
              className="font-semibold text-violet-600"
            >
              Transform
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

          {/* Right side */}

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className={`relative flex h-10 w-[72px] items-center rounded-full border p-1 transition ${darkMode
                ? "border-slate-700 bg-slate-800"
                : "border-slate-200 bg-slate-100"
                }`}
            >
              <span
                className={`absolute grid h-8 w-8 place-items-center rounded-full shadow-sm transition-all duration-300 ${darkMode
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
        </div>
      </nav>


      {/* =====================================================
          HEADER
      ====================================================== */}

      <section className="pb-10 pt-32">
        <div className="mx-auto max-w-[1180px] px-5">
          <div className="max-w-[800px]">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-violet-600">
              <span className="h-2 w-2 rounded-full bg-violet-500 shadow-[0_0_10px_#8b5cf6]" />
              Transformation Workspace
            </div>

            <h1
              className={`text-4xl font-extrabold tracking-tight sm:text-6xl ${theme.heading}`}
            >
              Transform your content{" "}
              <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                your way.
              </span>
            </h1>

            <p
              className={`mt-5 max-w-[720px] text-base leading-7 ${theme.muted}`}
            >
              Upload your source material, define your audience and
              communication goals, then generate content tailored to
              exactly how you want to communicate.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN WORKSPACE
      ====================================================== */}

      <section className="pb-24">
        <div className="mx-auto max-w-[1180px] px-5">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">

            {/* =================================================
                LEFT SIDE
            ================================================== */}

            <div
              className={`rounded-[26px] border p-6 shadow-xl shadow-slate-200/20 sm:p-7 ${theme.card} ${theme.border}`}
            >
              {/* Source heading */}

              <div>
                <h2
                  className={`text-lg font-bold ${theme.heading}`}
                >
                  1. Add your source content
                </h2>

                <p
                  className={`mt-1 text-sm ${theme.muted}`}
                >
                  Upload a document or paste your content below.
                </p>
              </div>

              {/* Upload */}

              <div
                onDragEnter={(event) => {
                  event.preventDefault();
                  setDragActive(true);
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={(event) => {
                  event.preventDefault();
                  setDragActive(false);
                }}
                onDrop={handleDrop}
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className={`mt-6 cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition ${dragActive
                  ? "border-violet-500 bg-violet-50 dark:bg-violet-950/20"
                  : `${theme.border} ${theme.soft} hover:border-violet-300`
                  }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.md,.csv,.rtf,.png,.jpg,.jpeg,.webp"
                  className="hidden"
                  onChange={handleFileInput}
                />

                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-100 to-cyan-100 text-2xl">
                  ↑
                </div>

                <h3
                  className={`mt-4 text-sm font-bold ${theme.heading}`}
                >
                  Drop your files here
                </h3>

                <p
                  className={`mt-2 text-xs ${theme.muted}`}
                >
                  or click to browse from your device
                </p>

                <p className="mt-3 text-[10px] font-medium text-slate-400">
                  PDF · DOC · DOCX · TXT · MD · CSV · RTF
                </p>
              </div>

              {/* Uploaded Files */}

              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {uploadedFiles.map(
                    ({ file, id }) => (
                      <div
                        key={id}
                        className={`flex items-center justify-between rounded-xl border p-3 ${theme.border} ${theme.soft}`}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-violet-100 text-sm">
                            📄
                          </div>

                          <div className="min-w-0">
                            <p
                              className={`truncate text-xs font-semibold ${theme.heading}`}
                            >
                              {file.name}
                            </p>

                            <p className="mt-0.5 text-[10px] text-slate-400">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            removeFile(id);
                          }}
                          className="ml-3 rounded-lg px-2 py-1 text-xs text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}

              {/* Text input */}

              {uploadedFiles.length === 0 && (
                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      className={`text-[10px] font-bold uppercase tracking-wider ${theme.muted}`}
                    >
                      Or paste / write content
                    </label>

                    <span className="text-[10px] text-slate-400">
                      {sourceText.length.toLocaleString()}{" "}
                      characters
                    </span>
                  </div>

                  <textarea
                    value={sourceText}
                    onChange={(event) => {
                      setSourceText(event.target.value);
                      setHasGenerated(false);
                    }}
                    placeholder="Paste your article, report, notes, announcement, research, policy document or any other source content here..."
                    className={`min-h-[180px] w-full resize-y rounded-2xl border p-4 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 ${theme.input}`}
                  />
                </div>
              )}

              <div className="mt-6">
                <label className="block text-sm font-medium mb-2">
                  Additional Instructions
                  <span className="text-muted-foreground ml-1">
                    (Optional)
                  </span>
                </label>

                <textarea
                  value={additionalInstructions}
                  onChange={(e) => {
                    setAdditionalInstructions(e.target.value);
                    setHasGenerated(false);
                  }}
                  placeholder="e.g. Keep the output within 2 pages, under 800 words, or highlight the major risks and recommendations."
                  className={`w-full min-h-[120px] resize-none rounded-2xl border p-4 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 ${theme.input}`} />
              </div>

              {/* Transformation settings */}

              <div
                className={`mt-8 border-t pt-7 ${theme.border}`}
              >
                <h2
                  className={`text-lg font-bold ${theme.heading}`}
                >
                  2. Define your transformation
                </h2>

                <p
                  className={`mt-1 text-sm ${theme.muted}`}
                >
                  Tell the AI exactly how the final communication
                  should look.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {(Object.keys(
                    fieldOptions
                  ) as ParameterName[]).map(
                    (name) => (
                      <div
                        key={name}
                        className={
                          name === "Output Type" || name === "Output Format"
                            ? "sm:col-span-2"
                            : ""
                        }
                      >
                        <label
                          className={`mb-2 block text-[10px] font-bold uppercase tracking-wider ${theme.muted}`}
                        >
                          {name}
                        </label>

                        <select
                          value={selected[name]}
                          onChange={(event) =>
                            updateParameter(
                              name,
                              event.target.value
                            )
                          }
                          className={`w-full appearance-none rounded-xl border px-3 py-3 text-xs font-medium outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100 ${theme.input}`}
                        >
                          {fieldOptions[name].map(
                            (option) => (
                              <option
                                key={option}
                                value={option}
                              >
                                {option}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    )
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleTransform}
                  disabled={
                    isTransforming ||
                    (!uploadedFiles.length &&
                      !sourceText.trim())
                  }
                  className="mt-7 w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 py-4 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-violet-300 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isTransforming
                    ? "✦ Transforming..."
                    : "✦ Transform Content"}
                </button>
              </div>
            </div>

            {/* =================================================
                RIGHT SIDE
            ================================================== */}

            <div
              className={`rounded-[26px] border p-6 shadow-xl shadow-slate-200/20 sm:p-7 ${theme.card} ${theme.border}`}
            >
              {/* Preview header */}

              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Live Transformation Preview
                  </p>

                  <h2
                    className={`mt-1 text-lg font-bold ${theme.heading}`}
                  >
                    Your output
                  </h2>
                </div>

                <span className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  AI READY
                </span>
              </div>

              {/* Profile */}

              <div
                className={`rounded-2xl border p-4 ${theme.border} ${theme.soft}`}
              >
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Transformation Profile
                </p>

                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {(Object.keys(
                    selected
                  ) as ParameterName[]).map(
                    (name) => (
                      <div
                        key={name}
                        className={`rounded-xl border p-3 ${theme.border} ${theme.card}`}
                      >
                        <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                          {name}
                        </p>

                        <p
                          className={`mt-1 text-[10px] font-semibold ${theme.heading}`}
                        >
                          {selected[name]}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Output */}

              <div
                className={`mt-5 min-h-[470px] rounded-2xl border p-6 shadow-sm ${theme.preview} ${theme.border}`}
              >
                <div
                  className={`flex items-center justify-between border-b pb-4 ${theme.border}`}
                >
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Generated Output
                    </p>

                    <h3
                      className={`mt-1 text-base font-bold ${theme.heading}`}
                    >
                      {selected["Output Type"]}
                    </h3>
                  </div>

                  <span className="rounded-md bg-violet-50 px-2 py-1 text-[9px] font-bold text-violet-600">
                    {selected.Language}
                  </span>
                </div>

                {!hasGenerated ? (
                  <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
                    <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-violet-100 to-cyan-100 text-2xl">
                      ✦
                    </div>

                    <h3
                      className={`mt-5 text-base font-bold ${theme.heading}`}
                    >
                      Your transformed content will appear here
                    </h3>

                    <p
                      className={`mt-2 max-w-[380px] text-xs leading-6 ${theme.muted}`}
                    >
                      Add your source content, choose your
                      transformation settings and click Transform
                      Content.
                    </p>

                    <div className="mt-6 grid w-full max-w-[400px] gap-2">
                      {[
                        `Audience: ${selected["Target Audience"]}`,
                        `Objective: ${selected["Communication Objective"]}`,
                        `Tone: ${selected.Tone}`,
                        `Detail: ${selected["Level of Detail"]}`,
                        `Output: ${selected["Output Type"]} (${selected["Output Format"]})`,
                      ].map((item) => (
                        <div
                          key={item}
                          className={`rounded-xl border p-3 text-left text-[10px] ${theme.border} ${theme.soft} ${theme.muted}`}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-6">
                    <div className="rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50 to-cyan-50 p-5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-violet-600">
                        AI Generated Preview
                      </p>

                      <h4 className="mt-3 text-base font-bold text-slate-800">
                        {selected["Output Type"]}: Communication
                        Overview
                      </h4>

                      <p className="mt-4 text-xs leading-7 text-slate-600">
                        This content has been structured for{" "}
                        <strong>
                          {selected["Target Audience"]}
                        </strong>{" "}
                        with a{" "}
                        <strong>
                          {selected.Tone.toLowerCase()}
                        </strong>{" "}
                        tone and a{" "}
                        <strong>
                          {selected[
                            "Communication Objective"
                          ].toLowerCase()}
                        </strong>{" "}
                        objective.
                      </p>

                      <p className="mt-3 text-xs leading-7 text-slate-600">
                        The final communication will be produced in{" "}
                        <strong>
                          {selected.Language}
                        </strong>{" "}
                        with a{" "}
                        <strong>
                          {selected[
                            "Level of Detail"
                          ].toLowerCase()}
                        </strong>{" "}
                        level of detail and formatted as a{" "}
                        <strong>
                          {selected["Output Type"]}
                        </strong>
                        .
                      </p>
                    </div>

                    <div className="mt-5 grid gap-3">
                      {[
                        `Audience adapted for ${selected["Target Audience"]}.`,
                        `Objective optimized for ${selected["Communication Objective"]}.`,
                        `${selected.Tone} tone applied.`,
                        `${selected.Language} language selected.`,
                        `${selected["Level of Detail"]} detail level applied.`,
                        `${selected["Content Style"]} content style selected.`,
                        `Output structured as ${selected["Output Type"]}.`,
                        `Output format: ${selected["Output Format"]}.`,
                        ...(additionalInstructions.trim()
                          ? [`Additional instructions: ${additionalInstructions.trim()}`]
                          : []),
                      ].map((text) => (
                        <div
                          key={text}
                          className={`flex gap-2 text-[11px] ${theme.muted}`}
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                          {text}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Source status */}

              <div
                className={`mt-5 flex items-center justify-between rounded-xl border p-4 ${theme.border} ${theme.soft}`}
              >
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Source
                  </p>

                  <p
                    className={`mt-1 text-xs font-semibold ${theme.heading}`}
                  >
                    {uploadedFiles.length > 0
                      ? `${uploadedFiles.length} file${uploadedFiles.length > 1
                        ? "s"
                        : ""
                      } uploaded`
                      : sourceText.trim()
                        ? "Text content added"
                        : "No source added yet"}
                  </p>
                </div>

                <span
                  className={`rounded-lg px-3 py-2 text-[9px] font-bold ${uploadedFiles.length > 0 ||
                    sourceText.trim()
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-slate-100 text-slate-400"
                    }`}
                >
                  {uploadedFiles.length > 0 ||
                    sourceText.trim()
                    ? "READY"
                    : "WAITING"}
                </span>
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

          <div className={`flex gap-5 ${theme.muted}`}>
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
          </div>
        </div>
      </footer>

    </main>
  );
}
