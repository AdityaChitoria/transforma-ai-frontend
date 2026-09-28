"use client";

import Link from "next/link";
import {
  ChangeEvent,
  DragEvent,
  useEffect,
  useRef,
  useState,
} from "react";

/*
 * =========================================================
 * FIELD OPTIONS
 * =========================================================
 */

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
    "Social Media",
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

    // Social Media
    "Twitter / X Post",
    "Instagram Post",
    "Instagram Caption",
    "LinkedIn Post",
    "Facebook Post",
    "YouTube Description",
    "YouTube Community Post",
    "Threads Post",
    "TikTok Caption",
    "TikTok Script",
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

  /*
   * Output formats are separate from source upload formats.
   */
  "Output Format": [
    "PDF",
    "DOCX",
    "PPTX",
    "PNG",
  ],
};

/*
 * =========================================================
 * INITIAL PARAMETERS
 * =========================================================
 */

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

type TransformationParameters =
  typeof initialParameters;

type OutputConfig =
  TransformationParameters & {
    id: string;
  };

type UploadedFile = {
  file: File;
  id: string;
};

/*
 * =========================================================
 * CREATE OUTPUT CONFIG
 * =========================================================
 */

const createOutputConfig =
  (): OutputConfig => ({
    id: `${Date.now()}-${Math.random()}`,
    ...initialParameters,
  });

/*
 * =========================================================
 * COMPONENT
 * =========================================================
 */

export default function TransformPage() {
  /*
   * =========================================================
   * THEME
   * =========================================================
   */

  const [darkMode, setDarkMode] =
    useState(false);

  useEffect(() => {
    const savedTheme =
      localStorage.getItem(
        "transforma-theme"
      );

    const isDark =
      savedTheme === "dark";

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
   * OUTPUT CONFIGURATIONS
   * =========================================================
   */

  const [outputConfigs, setOutputConfigs] =
    useState<OutputConfig[]>([
      createOutputConfig(),
    ]);

  const [
    activeOutputIndex,
    setActiveOutputIndex,
  ] = useState(0);

  const updateOutputParameter = (
    outputId: string,
    name: ParameterName,
    value: string
  ) => {
    setOutputConfigs((current) =>
      current.map((output) =>
        output.id === outputId
          ? {
              ...output,
              [name]: value,
            }
          : output
      )
    );

    setHasGenerated(false);
  };

  const increaseOutputs = () => {
    if (outputConfigs.length >= 3) {
      return;
    }

    setOutputConfigs((current) => [
      ...current,
      createOutputConfig(),
    ]);

    setActiveOutputIndex(
      outputConfigs.length
    );

    setHasGenerated(false);
  };

  const decreaseOutputs = () => {
    if (outputConfigs.length <= 1) {
      return;
    }

    setOutputConfigs((current) =>
      current.slice(0, -1)
    );

    setActiveOutputIndex((current) =>
      Math.min(
        current,
        outputConfigs.length - 2
      )
    );

    setHasGenerated(false);
  };

  /*
   * =========================================================
   * OUTPUT CAROUSEL
   * =========================================================
   */

  const goToPreviousOutput = () => {
    setActiveOutputIndex((current) =>
      current === 0
        ? outputConfigs.length - 1
        : current - 1
    );
  };

  const goToNextOutput = () => {
    setActiveOutputIndex((current) =>
      current ===
      outputConfigs.length - 1
        ? 0
        : current + 1
    );
  };

  /*
   * =========================================================
   * SOURCE CONTENT
   * =========================================================
   */

  const [uploadedFiles, setUploadedFiles] =
    useState<UploadedFile[]>([]);

  const [sourceText, setSourceText] =
    useState("");

  const [
    additionalInstructions,
    setAdditionalInstructions,
  ] = useState("");

  const [dragActive, setDragActive] =
    useState(false);

  const [isTransforming, setIsTransforming] =
    useState(false);

  const [hasGenerated, setHasGenerated] =
    useState(false);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  /*
   * =========================================================
   * SUPPORTED SOURCE FILE TYPES
   *
   * ONLY THESE 9 FORMATS ARE ALLOWED:
   *
   * PDF
   * DOC
   * DOCX
   * TXT
   * JPG
   * JPEG
   * PNG
   * PPT
   * PPTX
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
    ".ppt",
    ".pptx",
  ] as const;

  const acceptedFileTypes =
    acceptedExtensions.join(",");

  /*
   * =========================================================
   * CHECK FILE EXTENSION
   * =========================================================
   */

  const isSupportedFile = (
    file: File
  ) => {
    const fileName =
      file.name.toLowerCase();

    return acceptedExtensions.some(
      (extension) =>
        fileName.endsWith(extension)
    );
  };

  /*
   * =========================================================
   * FILE UPLOAD
   * =========================================================
   */

  const addFiles = (
    files: FileList | File[]
  ) => {
    /*
     * Only one source file is allowed.
     */
    if (uploadedFiles.length > 0) {
      return;
    }

    const selectedFiles =
      Array.from(files);

    if (selectedFiles.length === 0) {
      return;
    }

    /*
     * Find the first supported file.
     */
    const file =
      selectedFiles.find(
        isSupportedFile
      );

    /*
     * Reject unsupported formats.
     */
    if (!file) {
      alert(
        "Unsupported file format.\n\nAllowed formats:\nPDF, DOC, DOCX, TXT, JPG, JPEG, PNG, PPT, PPTX."
      );

      return;
    }

    /*
     * Add selected file.
     */
    const uploadedFile: UploadedFile = {
      file,
      id: `${file.name}-${file.size}-${Date.now()}`,
    };

    setUploadedFiles([
      uploadedFile,
    ]);

    /*
     * If a file is selected,
     * clear pasted text.
     */
    setSourceText("");

    setHasGenerated(false);
  };

  /*
   * =========================================================
   * FILE INPUT
   * =========================================================
   */

  const handleFileInput = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    if (uploadedFiles.length > 0) {
      event.target.value = "";
      return;
    }

    if (event.target.files) {
      addFiles(event.target.files);
    }

    event.target.value = "";
  };

  /*
   * =========================================================
   * DRAG & DROP
   * =========================================================
   */

  const handleDrop = (
    event: DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();

    setDragActive(false);

    if (uploadedFiles.length > 0) {
      return;
    }

    if (event.dataTransfer.files) {
      addFiles(
        event.dataTransfer.files
      );
    }
  };

  /*
   * =========================================================
   * REMOVE FILE
   * =========================================================
   */

  const removeFile = () => {
    setUploadedFiles([]);

    setHasGenerated(false);

    if (fileInputRef.current) {
      fileInputRef.current.value =
        "";
    }
  };

  /*
   * =========================================================
   * FORMAT FILE SIZE
   * =========================================================
   */

  const formatFileSize = (
    bytes: number
  ) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (
      bytes <
      1024 * 1024
    ) {
      return `${(
        bytes / 1024
      ).toFixed(1)} KB`;
    }

    return `${(
      bytes /
      (1024 * 1024)
    ).toFixed(1)} MB`;
  };

  /*
   * =========================================================
   * TRANSFORM
   * =========================================================
   */

  const handleTransform =
    async () => {
      if (
        !uploadedFiles.length &&
        !sourceText.trim()
      ) {
        return;
      }

      setIsTransforming(true);
      setHasGenerated(false);

      try {
        const formData =
          new FormData();

        /*
         * Source text
         */
        formData.append(
          "source_text",
          sourceText
        );

        /*
         * Source file
         */
        if (
          uploadedFiles.length > 0
        ) {
          formData.append(
            "file",
            uploadedFiles[0].file
          );
        }

        /*
         * Additional instructions
         */
        formData.append(
          "additional_instructions",
          additionalInstructions
        );

        /*
         * Output configurations
         */
        const outputs =
          outputConfigs.map(
            (
              output,
              index
            ) => ({
              output_number:
                index + 1,

              audience:
                output[
                  "Target Audience"
                ],

              objective:
                output[
                  "Communication Objective"
                ],

              tone:
                output.Tone,

              language:
                output.Language,

              detail_level:
                output[
                  "Level of Detail"
                ],

              content_style:
                output[
                  "Content Style"
                ],

              output_type:
                output[
                  "Output Type"
                ],

              output_format:
                output[
                  "Output Format"
                ],
            })
          );

        formData.append(
          "outputs",
          JSON.stringify(outputs)
        );

        /*
         * API
         */
        const apiBaseUrl =
          process.env
            .NEXT_PUBLIC_API_URL ||
          "https://transforma-ai-api.onrender.com";

        const response =
          await fetch(
            `${apiBaseUrl.replace(
              /\/$/,
              ""
            )}/transform`,
            {
              method: "POST",
              body: formData,
            }
          );

        if (!response.ok) {
          const errorBody =
            await response.text();

          throw new Error(
            errorBody ||
              `Transformation failed (${response.status}).`
          );
        }

        /*
         * Backend returns:
         *
         * 1 output:
         * generated file
         *
         * 2-3 outputs:
         * ZIP
         */
        const blob =
          await response.blob();

        const downloadUrl =
          window.URL.createObjectURL(
            blob
          );

        const link =
          document.createElement(
            "a"
          );

        link.href =
          downloadUrl;

        /*
         * Single output
         */
        if (
          outputConfigs.length ===
          1
        ) {
          const format =
            outputConfigs[0][
              "Output Format"
            ].toLowerCase();

          link.download =
            `transformed_content.${format}`;
        } else {
          /*
           * Multiple outputs
           */
          link.download =
            "transformed_outputs.zip";
        }

        document.body.appendChild(
          link
        );

        link.click();

        link.remove();

        window.URL.revokeObjectURL(
          downloadUrl
        );

        setActiveOutputIndex(0);

        setHasGenerated(true);
      } catch (error) {
        console.error(
          "Transformation error:",
          error
        );

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
   * CURRENT OUTPUT
   * =========================================================
   */

  const activeOutput =
    outputConfigs[
      activeOutputIndex
    ];

  if (!activeOutput) {
    return null;
  }

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

            backgroundSize:
              "60px 60px",
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
              className="font-semibold text-violet-600"
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

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={
                toggleTheme
              }
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
                {darkMode
                  ? "🌙"
                  : "☀️"}
              </span>

              <span className="ml-auto mr-1 text-[9px] font-bold text-slate-400">
                {darkMode
                  ? "DARK"
                  : "LIGHT"}
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
              Transform your
              content{" "}
              <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                your way.
              </span>
            </h1>

            <p
              className={`mt-5 max-w-[720px] text-base leading-7 ${theme.muted}`}
            >
              Upload one source, then
              create up to three
              completely different
              outputs from the same
              content.
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
              {/* SOURCE */}

              <div>
                <h2
                  className={`text-lg font-bold ${theme.heading}`}
                >
                  1. Add your source
                  content
                </h2>

                <p
                  className={`mt-1 text-sm ${theme.muted}`}
                >
                  Upload one source
                  file or paste your
                  content below.
                </p>
              </div>

              {/* UPLOAD */}

              <div
                onDragEnter={(
                  event
                ) => {
                  event.preventDefault();

                  if (
                    uploadedFiles.length ===
                    0
                  ) {
                    setDragActive(
                      true
                    );
                  }
                }}
                onDragOver={(
                  event
                ) => {
                  event.preventDefault();

                  if (
                    uploadedFiles.length ===
                    0
                  ) {
                    setDragActive(
                      true
                    );
                  }
                }}
                onDragLeave={(
                  event
                ) => {
                  event.preventDefault();
                  setDragActive(
                    false
                  );
                }}
                onDrop={
                  handleDrop
                }
                onClick={() => {
                  if (
                    uploadedFiles.length ===
                    0
                  ) {
                    fileInputRef.current?.click();
                  }
                }}
                className={`mt-6 rounded-2xl border-2 border-dashed p-8 text-center transition ${
                  uploadedFiles.length >
                  0
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer"
                } ${
                  dragActive &&
                  uploadedFiles.length ===
                    0
                    ? "border-violet-500 bg-violet-50 dark:bg-violet-950/20"
                    : `${theme.border} ${theme.soft} ${
                        uploadedFiles.length ===
                        0
                          ? "hover:border-violet-300"
                          : ""
                      }`
                }`}
              >
                <input
                  ref={
                    fileInputRef
                  }
                  type="file"
                  accept={
                    acceptedFileTypes
                  }
                  className="hidden"
                  onChange={
                    handleFileInput
                  }
                  disabled={
                    uploadedFiles.length >
                    0
                  }
                />

                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-100 to-cyan-100 text-2xl">
                  {uploadedFiles.length >
                  0
                    ? "✓"
                    : "↑"}
                </div>

                <h3
                  className={`mt-4 text-sm font-bold ${theme.heading}`}
                >
                  {uploadedFiles.length >
                  0
                    ? "Source file selected"
                    : "Drop your source file here"}
                </h3>

                <p
                  className={`mt-2 text-xs ${theme.muted}`}
                >
                  {uploadedFiles.length >
                  0
                    ? "Remove the current file to select another one."
                    : "or click to browse from your device"}
                </p>

                <p className="mt-3 text-[10px] font-medium text-slate-400">
                  PDF · DOC · DOCX ·
                  TXT · JPG · JPEG ·
                  PNG · PPT · PPTX
                </p>
              </div>

              {/* UPLOADED FILE */}

              {uploadedFiles.length >
                0 && (
                <div className="mt-4">
                  {uploadedFiles.map(
                    ({
                      file,
                      id,
                    }) => (
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
                              {
                                file.name
                              }
                            </p>

                            <p className="mt-0.5 text-[10px] text-slate-400">
                              {formatFileSize(
                                file.size
                              )}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(
                            event
                          ) => {
                            event.stopPropagation();
                            removeFile();
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

              {/* TEXT INPUT */}

              {uploadedFiles.length ===
                0 && (
                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      className={`text-[10px] font-bold uppercase tracking-wider ${theme.muted}`}
                    >
                      Or paste / write
                      content
                    </label>

                    <span className="text-[10px] text-slate-400">
                      {sourceText.length.toLocaleString()}{" "}
                      characters
                    </span>
                  </div>

                  <textarea
                    value={
                      sourceText
                    }
                    onChange={(
                      event
                    ) => {
                      setSourceText(
                        event
                          .target
                          .value
                      );

                      setHasGenerated(
                        false
                      );
                    }}
                    placeholder="Paste your article, report, notes, announcement, research, policy document or any other source content here..."
                    className={`min-h-[180px] w-full resize-y rounded-2xl border p-4 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 ${theme.input}`}
                  />
                </div>
              )} 
              
              {/* =================================================
                  OUTPUT CONFIGURATION
              ================================================== */}

              <div
                className={`mt-8 border-t pt-7 ${theme.border}`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2
                      className={`text-lg font-bold ${theme.heading}`}
                    >
                      2. Define your
                      outputs
                    </h2>

                    <p
                      className={`mt-1 text-sm ${theme.muted}`}
                    >
                      Create up to 3
                      different
                      versions from
                      the same source.
                    </p>
                  </div>

                  {/* OUTPUT COUNTER */}

                  <div
                    className={`flex items-center gap-2 rounded-xl border p-1 ${theme.border} ${theme.soft}`}
                  >
                    <button
                      type="button"
                      onClick={
                        decreaseOutputs
                      }
                      disabled={
                        outputConfigs.length <=
                        1
                      }
                      className={`grid h-9 w-9 place-items-center rounded-lg text-lg font-bold transition ${
                        outputConfigs.length <=
                        1
                          ? "cursor-not-allowed opacity-30"
                          : "hover:bg-violet-100 hover:text-violet-600"
                      }`}
                    >
                      −
                    </button>

                    <div className="min-w-[80px] text-center">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Outputs
                      </p>

                      <p
                        className={`text-sm font-bold ${theme.heading}`}
                      >
                        {
                          outputConfigs.length
                        }{" "}
                        / 3
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={
                        increaseOutputs
                      }
                      disabled={
                        outputConfigs.length >=
                        3
                      }
                      className={`grid h-9 w-9 place-items-center rounded-lg text-lg font-bold transition ${
                        outputConfigs.length >=
                        3
                          ? "cursor-not-allowed opacity-30"
                          : "hover:bg-violet-100 hover:text-violet-600"
                      }`}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* OUTPUT CAROUSEL */}

                <div className="mt-6">
                  <div className="relative">
                    {outputConfigs.length >
                      1 && (
                      <button
                        type="button"
                        onClick={
                          goToPreviousOutput
                        }
                        aria-label="Previous output"
                        className={`absolute left-[-14px] top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border shadow-md transition hover:scale-105 ${theme.border} ${theme.card}`}
                      >
                        ←
                      </button>
                    )}

                    <div
                      className={`rounded-2xl border p-5 ${theme.border} ${theme.soft}`}
                    >
                      {/* HEADER */}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-500 text-xs font-bold text-white">
                            {
                              activeOutputIndex +
                              1
                            }
                          </div>

                          <div>
                            <h3
                              className={`text-sm font-bold ${theme.heading}`}
                            >
                              Output{" "}
                              {
                                activeOutputIndex +
                                1
                              }
                            </h3>

                            <p className="text-[10px] text-slate-400">
                              Independent
                              configuration
                            </p>
                          </div>
                        </div>

                        <span className="rounded-lg bg-violet-50 px-2.5 py-1.5 text-[9px] font-bold text-violet-600">
                          {
                            activeOutput[
                              "Output Format"
                            ]
                          }
                        </span>
                      </div>

                      {/* PARAMETERS */}

                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        {(
                          Object.keys(
                            fieldOptions
                          ) as ParameterName[]
                        ).map(
                          (
                            name
                          ) => (
                            <div
                              key={`${activeOutput.id}-${name}`}
                              className={
                                name ===
                                  "Output Type" ||
                                name ===
                                  "Output Format"
                                  ? "sm:col-span-2"
                                  : ""
                              }
                            >
                              <label
                                className={`mb-2 block text-[10px] font-bold uppercase tracking-wider ${theme.muted}`}
                              >
                                {
                                  name
                                }
                              </label>

                              <select
                                value={
                                  activeOutput[
                                    name
                                  ]
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateOutputParameter(
                                    activeOutput.id,
                                    name,
                                    event
                                      .target
                                      .value
                                  )
                                }
                                className={`w-full appearance-none rounded-xl border px-3 py-3 text-xs font-medium outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100 ${theme.input}`}
                              >
                                {fieldOptions[
                                  name
                                ].map(
                                  (
                                    option
                                  ) => (
                                    <option
                                      key={
                                        option
                                      }
                                      value={
                                        option
                                      }
                                    >
                                      {
                                        option
                                      }
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                          )
                        )}
                      </div>

                      {/* QUICK SUMMARY */}

                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        <div
                          className={`rounded-xl border p-3 ${theme.border} ${theme.card}`}
                        >
                          <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                            Output
                          </p>

                          <p
                            className={`mt-1 text-[10px] font-semibold ${theme.heading}`}
                          >
                            {
                              activeOutput[
                                "Output Type"
                              ]
                            }
                          </p>
                        </div>

                        <div
                          className={`rounded-xl border p-3 ${theme.border} ${theme.card}`}
                        >
                          <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                            Format
                          </p>

                          <p
                            className={`mt-1 text-[10px] font-semibold ${theme.heading}`}
                          >
                            {
                              activeOutput[
                                "Output Format"
                              ]
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    {outputConfigs.length >
                      1 && (
                      <button
                        type="button"
                        onClick={
                          goToNextOutput
                        }
                        aria-label="Next output"
                        className={`absolute right-[-14px] top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border shadow-md transition hover:scale-105 ${theme.border} ${theme.card}`}
                      >
                        →
                      </button>
                    )}
                  </div>

                  {/* OUTPUT INDICATORS */}

                  {outputConfigs.length >
                    1 && (
                    <div className="mt-4 flex items-center justify-center gap-2">
                      {outputConfigs.map(
                        (
                          output,
                          index
                        ) => (
                          <button
                            key={
                              output.id
                            }
                            type="button"
                            onClick={() =>
                              setActiveOutputIndex(
                                index
                              )
                            }
                            aria-label={`Show output ${
                              index +
                              1
                            }`}
                            className={`h-2 rounded-full transition-all ${
                              index ===
                              activeOutputIndex
                                ? "w-6 bg-violet-600"
                                : "w-2 bg-slate-300 hover:bg-slate-400"
                            }`}
                          />
                        )
                      )}
                    </div>
                  )}

                  {outputConfigs.length >
                    1 && (
                    <p
                      className={`mt-3 text-center text-[10px] ${theme.muted}`}
                    >
                      Output{" "}
                      {
                        activeOutputIndex +
                        1
                      }{" "}
                      of{" "}
                      {
                        outputConfigs.length
                      }{" "}
                      · Use the
                      arrows to switch
                      outputs
                    </p>
                  )}
                </div>

                {/* TRANSFORM BUTTON */}

                <button
                  type="button"
                  onClick={
                    handleTransform
                  }
                  disabled={
                    isTransforming ||
                    (!uploadedFiles.length &&
                      !sourceText.trim())
                  }
                  className="mt-7 w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 py-4 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-violet-300 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isTransforming
                    ? "✦ Transforming..."
                    : `✦ Generate ${
                        outputConfigs.length
                      } Output${
                        outputConfigs.length >
                        1
                          ? "s"
                          : ""
                      }`}
                </button>
              </div>
            </div>

            {/* =================================================
                RIGHT SIDE
            ================================================== */}

            <div
              className={`rounded-[26px] border p-6 shadow-xl shadow-slate-200/20 sm:p-7 ${theme.card} ${theme.border}`}
            >
              {/* PREVIEW HEADER */}

              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Transformation
                    Preview
                  </p>

                  <h2
                    className={`mt-1 text-lg font-bold ${theme.heading}`}
                  >
                    Your outputs
                  </h2>
                </div>

                <span className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                  AI READY
                </span>
              </div>

              {/* OUTPUT PROFILES */}

              <div
                className={`rounded-2xl border p-4 ${theme.border} ${theme.soft}`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Transformation
                    Profile
                  </p>

                  {outputConfigs.length >
                    1 && (
                    <span className="text-[9px] font-semibold text-violet-600">
                      {
                        activeOutputIndex +
                        1
                      }{" "}
                      /{" "}
                      {
                        outputConfigs.length
                      }
                    </span>
                  )}
                </div>

                <div className="relative mt-3">
                  {outputConfigs.length >
                    1 && (
                    <button
                      type="button"
                      onClick={
                        goToPreviousOutput
                      }
                      aria-label="Previous output profile"
                      className={`absolute left-[-10px] top-1/2 z-10 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full border shadow-sm ${theme.border} ${theme.card}`}
                    >
                      ←
                    </button>
                  )}

                  <div
                    className={`rounded-xl border p-4 ${theme.border} ${theme.card}`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <p
                        className={`text-[10px] font-bold ${theme.heading}`}
                      >
                        Output{" "}
                        {
                          activeOutputIndex +
                          1
                        }
                      </p>

                      <span className="rounded-md bg-violet-50 px-2 py-1 text-[8px] font-bold text-violet-600">
                        {
                          activeOutput[
                            "Output Format"
                          ]
                        }
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <div>
                        <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                          Audience
                        </p>

                        <p
                          className={`mt-1 text-[9px] font-semibold ${theme.heading}`}
                        >
                          {
                            activeOutput[
                              "Target Audience"
                            ]
                          }
                        </p>
                      </div>

                      <div>
                        <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                          Language
                        </p>

                        <p
                          className={`mt-1 text-[9px] font-semibold ${theme.heading}`}
                        >
                          {
                            activeOutput.Language
                          }
                        </p>
                      </div>

                      <div>
                        <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                          Type
                        </p>

                        <p
                          className={`mt-1 text-[9px] font-semibold ${theme.heading}`}
                        >
                          {
                            activeOutput[
                              "Output Type"
                            ]
                          }
                        </p>
                      </div>

                      <div>
                        <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                          Format
                        </p>

                        <p
                          className={`mt-1 text-[9px] font-semibold ${theme.heading}`}
                        >
                          {
                            activeOutput[
                              "Output Format"
                            ]
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {outputConfigs.length >
                    1 && (
                    <button
                      type="button"
                      onClick={
                        goToNextOutput
                      }
                      aria-label="Next output profile"
                      className={`absolute right-[-10px] top-1/2 z-10 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full border shadow-sm ${theme.border} ${theme.card}`}
                    >
                      →
                    </button>
                  )}
                </div>

                {outputConfigs.length >
                  1 && (
                  <div className="mt-3 flex justify-center gap-1.5">
                    {outputConfigs.map(
                      (
                        output,
                        index
                      ) => (
                        <button
                          key={
                            output.id
                          }
                          type="button"
                          onClick={() =>
                            setActiveOutputIndex(
                              index
                            )
                          }
                          aria-label={`Show output profile ${
                            index +
                            1
                          }`}
                          className={`h-1.5 rounded-full transition-all ${
                            index ===
                            activeOutputIndex
                              ? "w-5 bg-violet-600"
                              : "w-1.5 bg-slate-300"
                          }`}
                        />
                      )
                    )}
                  </div>
                )}
              </div>

              {/* OUTPUT PREVIEW */}

              <div
                className={`mt-5 min-h-[470px] rounded-2xl border p-6 shadow-sm ${theme.preview} ${theme.border}`}
              >
                <div
                  className={`flex items-center justify-between border-b pb-4 ${theme.border}`}
                >
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Generated Outputs
                    </p>

                    <h3
                      className={`mt-1 text-base font-bold ${theme.heading}`}
                    >
                      {
                        outputConfigs.length
                      }{" "}
                      configured
                      output
                      {outputConfigs.length >
                      1
                        ? "s"
                        : ""}
                    </h3>
                  </div>

                  <span className="rounded-md bg-violet-50 px-2 py-1 text-[9px] font-bold text-violet-600">
                    {outputConfigs.length ===
                    1
                      ? outputConfigs[0][
                          "Output Format"
                        ]
                      : "ZIP"}
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
                      Your outputs will
                      appear here
                    </h3>

                    <p
                      className={`mt-2 max-w-[380px] text-xs leading-6 ${theme.muted}`}
                    >
                      Configure each
                      output
                      independently
                      and click
                      Generate
                      Outputs.
                    </p>

                    <div
                      className={`mt-6 w-full max-w-[400px] rounded-xl border p-4 text-left ${theme.border} ${theme.soft}`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-bold ${theme.heading}`}
                        >
                          Output{" "}
                          {
                            activeOutputIndex +
                            1
                          }
                        </span>

                        <span className="text-[9px] font-bold text-violet-600">
                          {
                            activeOutput[
                              "Output Format"
                            ]
                          }
                        </span>
                      </div>

                      <p
                        className={`mt-1 text-[10px] ${theme.muted}`}
                      >
                        {
                          activeOutput[
                            "Output Type"
                          ]
                        }{" "}
                        ·{" "}
                        {
                          activeOutput.Language
                        }{" "}
                        ·{" "}
                        {
                          activeOutput.Tone
                        }
                      </p>
                    </div>

                    {outputConfigs.length >
                      1 && (
                      <div className="mt-4 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={
                            goToPreviousOutput
                          }
                          className={`grid h-8 w-8 place-items-center rounded-full border ${theme.border} ${theme.soft}`}
                        >
                          ←
                        </button>

                        <span className="text-[10px] font-semibold text-slate-400">
                          {
                            activeOutputIndex +
                            1
                          }{" "}
                          /{" "}
                          {
                            outputConfigs.length
                          }
                        </span>

                        <button
                          type="button"
                          onClick={
                            goToNextOutput
                          }
                          className={`grid h-8 w-8 place-items-center rounded-full border ${theme.border} ${theme.soft}`}
                        >
                          →
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-6">
                    <div className="rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50 to-cyan-50 p-5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-violet-600">
                        Generation
                        Complete
                      </p>

                      <h4 className="mt-3 text-base font-bold text-slate-800">
                        Your content
                        has been
                        transformed
                      </h4>

                      <p className="mt-4 text-xs leading-7 text-slate-600">
                        Generated{" "}
                        <strong>
                          {
                            outputConfigs.length
                          }
                        </strong>{" "}
                        independent
                        output
                        {outputConfigs.length >
                        1
                          ? "s"
                          : ""}{" "}
                        from the same
                        source.
                      </p>
                    </div>

                    <div className="relative mt-5">
                      {outputConfigs.length >
                        1 && (
                        <button
                          type="button"
                          onClick={
                            goToPreviousOutput
                          }
                          aria-label="Previous generated output"
                          className={`absolute left-[-12px] top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border shadow-md transition hover:scale-105 ${theme.border} ${theme.card}`}
                        >
                          ←
                        </button>
                      )}

                      <div
                        className={`rounded-xl border p-5 ${theme.border} ${theme.soft}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                              Output{" "}
                              {
                                activeOutputIndex +
                                1
                              }
                            </p>

                            <p
                              className={`mt-1 text-xs font-bold ${theme.heading}`}
                            >
                              {
                                activeOutput[
                                  "Output Type"
                                ]
                              }
                            </p>
                          </div>

                          <span className="rounded-lg bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-600">
                            {
                              activeOutput[
                                "Output Format"
                              ]
                            }
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                          <p
                            className={`text-[10px] ${theme.muted}`}
                          >
                            Audience:{" "}
                            {
                              activeOutput[
                                "Target Audience"
                              ]
                            }
                          </p>

                          <p
                            className={`text-[10px] ${theme.muted}`}
                          >
                            Language:{" "}
                            {
                              activeOutput.Language
                            }
                          </p>

                          <p
                            className={`text-[10px] ${theme.muted}`}
                          >
                            Tone:{" "}
                            {
                              activeOutput.Tone
                            }
                          </p>

                          <p
                            className={`text-[10px] ${theme.muted}`}
                          >
                            Detail:{" "}
                            {
                              activeOutput[
                                "Level of Detail"
                              ]
                            }
                          </p>
                        </div>
                      </div>

                      {outputConfigs.length >
                        1 && (
                        <button
                          type="button"
                          onClick={
                            goToNextOutput
                          }
                          aria-label="Next generated output"
                          className={`absolute right-[-12px] top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border shadow-md transition hover:scale-105 ${theme.border} ${theme.card}`}
                        >
                          →
                        </button>
                      )}
                    </div>

                    {outputConfigs.length >
                      1 && (
                      <div className="mt-4 flex items-center justify-center gap-2">
                        {outputConfigs.map(
                          (
                            output,
                            index
                          ) => (
                            <button
                              key={
                                output.id
                              }
                              type="button"
                              onClick={() =>
                                setActiveOutputIndex(
                                  index
                                )
                              }
                              aria-label={`Show generated output ${
                                index +
                                1
                              }`}
                              className={`h-2 rounded-full transition-all ${
                                index ===
                                activeOutputIndex
                                  ? "w-6 bg-violet-600"
                                  : "w-2 bg-slate-300 hover:bg-slate-400"
                              }`}
                            />
                          )
                        )}
                      </div>
                    )}

                    <p
                      className={`mt-5 text-center text-[10px] ${theme.muted}`}
                    >
                      {outputConfigs.length >
                      1
                        ? `Showing output ${
                            activeOutputIndex +
                            1
                          } of ${
                            outputConfigs.length
                          }. Your generated ZIP has been downloaded.`
                        : "Your generated file has been downloaded."}
                    </p>
                  </div>
                )}
              </div>

              {/* SOURCE STATUS */}

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
                    {uploadedFiles.length >
                    0
                      ? uploadedFiles[0]
                          .file.name
                      : sourceText.trim()
                      ? "Text content added"
                      : "No source added yet"}
                  </p>
                </div>

                <span
                  className={`rounded-lg px-3 py-2 text-[9px] font-bold ${
                    uploadedFiles.length >
                      0 ||
                    sourceText.trim()
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {uploadedFiles.length >
                    0 ||
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
            AI-Powered Content
            Transformation Platform
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
          </div>
        </div>
      </footer>
    </main>
  );
}
