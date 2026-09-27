# TransForma AI Frontend

TransForma AI is a web-based AI content transformation platform that adapts a single source into audience-specific content based on the required purpose, tone, language, detail level, content style, output type, and output format.

This repository contains the frontend application built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- AI-powered content transformation workspace
- Upload a source document or enter source text directly
- Single-source-file workflow
- Drag-and-drop file upload
- Supports source files:
  - PDF
  - DOC
  - DOCX
  - TXT
  - JPG
  - JPEG
  - PNG
  - PPT
  - PPTX
- Configure up to 3 outputs in a single transformation request
- Audience-specific transformation
- Communication objective selection
- Tone selection
- English and Hindi output
- Detail-level control
- Multiple content styles
- Multiple output types
- Output formats:
  - PDF
  - DOCX
  - PPTX
  - PNG
- Additional instructions field
- Automatic download of generated output
- Multiple outputs are downloaded as a ZIP archive
- Light/dark theme with saved theme preference
- Responsive interface

## Transformation Options

### Target Audience

The frontend provides options such as:

- School Student
- College Student
- Professional
- Department Head
- General Public
- Government Official
- Researcher
- Media / Journalist
- Teacher / Educator
- Policy Maker
- NGO / Civil Society
- Social Media
- And other audience profiles

### Communication Objective

Available objectives include:

- Educate
- Briefing
- Awareness
- Reporting
- Public Communication
- Persuasion
- Instruction
- Information Sharing
- Policy Communication
- Decision Support
- Announcement
- Emergency Communication

### Tone

- Formal
- Professional
- Simple
- Technical
- Friendly
- Authoritative
- Neutral
- Persuasive
- Urgent
- Informative
- Conversational

### Language

- English
- Hindi

### Level of Detail

- Concise
- Moderate
- Detailed
- Comprehensive

### Content Style

The frontend supports styles including:

- Informative
- Educational
- Executive
- Public Information
- Technical
- Policy
- News / Media
- Conversational
- Instructional
- Analytical
- Social-media-specific styles such as LinkedIn, Instagram, YouTube, Threads, TikTok, Twitter/X, and Facebook formats

### Output Types

- Executive Summary
- Press Release
- Advisory
- Social Media Post
- Presentation
- Study Notes
- Briefing Note
- Report
- Email
- Speech
- Public Notice
- FAQ
- Infographic Content
- Policy Summary
- Meeting Minutes
- Newsletter
- Article

### Output Formats

- PDF
- DOCX
- PPTX
- PNG

## How It Works

1. Open the Transform workspace.
2. Add source text or upload one supported source file.
3. Configure the first output.
4. Add up to two additional output configurations if required.
5. Provide additional instructions if needed.
6. Click the transformation action.
7. The frontend sends the source and output configurations to the backend API.
8. A single generated output is downloaded directly.
9. When multiple outputs are requested, the backend returns a ZIP archive containing the generated files.

## Tech Stack

- Next.js 16.3.4
- React 19.2.8
- TypeScript
- Tailwind CSS 4
- Next Themes
- ESLint

## Project Structure

```text
transforma-ai-frontend/
├── app/
│   ├── page.tsx
│   ├── transform/
│   │   └── page.tsx
│   ├── globals.css
│   └── layout.tsx
├── public/
├── .env.example
├── package.json
├── tsconfig.json
├── postcss.config.mjs
└── eslint.config.mjs
```

## Getting Started

### Prerequisites

Make sure you have:

- Node.js
- npm

installed on your system.

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/aryancodesdaily/transforma-ai-frontend.git
cd transforma-ai-frontend
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

For a deployed backend, set the variable to the backend API URL:

```env
NEXT_PUBLIC_API_URL=https://transforma-ai-api.onrender.com
```

The frontend uses `NEXT_PUBLIC_API_URL` to send transformation requests to the backend `/transform` endpoint.

## Run Locally

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Production Build

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Linting

Run ESLint with:

```bash
npm run lint
```

## Backend Integration

The frontend communicates with the TransForma AI backend using a `multipart/form-data` request.

The request contains:

- `source_text`
- `file`
- `additional_instructions`
- `outputs`

Each output configuration contains:

```json
{
  "output_number": 1,
  "audience": "General Public",
  "objective": "Public Communication",
  "tone": "Professional",
  "language": "English",
  "detail_level": "Concise",
  "content_style": "Informative",
  "output_type": "Executive Summary",
  "output_format": "PDF"
}
```

The backend returns:

- A generated file when one output is requested
- A ZIP archive when multiple outputs are requested

## Deployment

The frontend can be deployed to platforms that support Next.js, including Vercel.

For deployment, configure:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url
```

The backend must also allow the deployed frontend origin through its CORS configuration.

## Project

**TransForma AI**  
AI-Powered Content Transformation Platform

Frontend repository:

https://github.com/aryancodesdaily/transforma-ai-frontend
