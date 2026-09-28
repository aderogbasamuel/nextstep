# NextStep

> **Know what you qualify for. Know what to do next.**

NextStep is an AI-powered opportunity intelligence platform that helps students and early-career professionals understand opportunities such as internships, scholarships, grants, competitions, and jobs.

Instead of simply finding an opportunity, NextStep helps answer the questions that actually matter:

- Am I eligible?
- What requirements do I already meet?
- What am I missing?
- What is unclear?
- What documents do I need?
- What should I do next?

---

## 🚀 The Problem

Opportunities are everywhere — internships, scholarships, grants, competitions, fellowships, and jobs.

But the information is often buried inside:

- PDFs
- Long application pages
- Social media posts
- University announcements
- Community groups
- Multiple websites

Finding an opportunity is only the first step.

People still have to manually read through the requirements, compare them against their own qualifications, figure out what they are missing, and determine what actions to take before the deadline.

**NextStep turns that process into a structured, personalized workflow.**

---

## 💡 How It Works

### 1. Build your profile

Users can provide their background manually or upload their resume.

NextStep can extract information such as:

- Education
- Field of study
- Study level
- Graduation year
- Location
- Skills
- Experience
- Projects

The extracted information can be reviewed and edited before being saved.

### 2. Analyze an opportunity

Users can upload an opportunity document or paste its details.

NextStep extracts important information such as:

- Opportunity type
- Organization
- Requirements
- Eligibility criteria
- Deadline
- Summary
- Required actions

### 3. Compare against the user's profile

NextStep compares the opportunity requirements against the user's profile.

Each requirement can be classified as:

- **Met** — the profile provides evidence that the requirement is satisfied.
- **Missing** — the profile does not satisfy the requirement.
- **Unclear** — there is not enough information to determine whether the requirement is satisfied.

### 4. Get an action plan

Instead of stopping at an eligibility result, NextStep generates actionable steps.

For example:

- Update your GitHub profile
- Highlight relevant backend experience
- Prepare a recommendation letter
- Submit your application
- Complete the required documents

The goal is simple:

> **Don't just tell users where they stand. Tell them what to do next.**

---

## ✨ Core Features

- 📄 Resume processing
- 🧑‍💻 Editable user profiles
- 📑 PDF, DOCX, and text document processing
- 🤖 AI-powered opportunity analysis
- 🎯 Eligibility matching
- 🔎 Requirement breakdown
- ⚠️ Missing and unclear requirements
- ✅ Personalized action plans
- 📅 Deadline tracking
- 📊 Match percentage
- 🔐 Authentication
- 💾 Persistent opportunity analyses
- ☁️ Server-side document processing

---

## 🛠️ Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React

### Backend

NextStep uses Next.js as a full-stack application rather than maintaining a separate backend service.

- Next.js Route Handlers
- Better Auth
- Drizzle ORM
- PostgreSQL
- Neon

### AI

- Google Gemini

Gemini is used for:

- Resume information extraction
- Opportunity analysis
- Requirement interpretation
- Profile-to-opportunity matching
- Action-plan generation

### Document Processing

- `pdf-parse`
- `mammoth`

These are used to extract text from uploaded documents before sending the relevant content to the AI layer.

---

## 🏗️ Architecture

```text
                         NextStep
                            │
              ┌─────────────┴─────────────┐
              │                           │
          User Profile              Opportunity
              │                           │
      ┌───────┴────────┐          ┌───────┴────────┐
      │                │          │                │
   Manual          Resume       PDF/DOCX         Text
   Input           Upload        Upload           Input
      │                │          │                │
      │             Parser        │                │
      │                │          │                │
      └────────┬───────┘          └───────┬────────┘
               │                          │
               ▼                          ▼
        Structured Profile        Opportunity Text
               │                          │
               └──────────┬───────────────┘
                          ▼
                       Gemini
                          │
                          ▼
                Requirement Analysis
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
            Match      Eligibility   Actions
              │           │           │
              └───────────┼───────────┘
                          ▼
                    NextStep Result
```

---

## 📁 Project Structure

```text
nextstep/
│
├── app/
│   ├── dashboard/
│   ├── analyze/
│   ├── analyses/
│   │   └── [id]/
│   ├── profile/
│   ├── settings/
│   │
│   └── api/
│       ├── analyze/
│       ├── analyses/
│       └── profile/
│           └── process-resume/
│
├── components/
│
├── lib/
│   ├── ai/
│   │   ├── gemini.ts
│   │   └── resume.ts
│   │
│   ├── auth/
│   │
│   ├── db/
│   │   ├── index.ts
│   │   └── schema.ts
│   │
│   └── parser/
│       └── extract-text.ts
│
├── public/
│
├── drizzle.config.js
├── next.config.mjs
├── package.json
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have:

- Node.js
- pnpm
- PostgreSQL/Neon database
- Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/aderogbasamuel/nextstep.git
cd nextstep
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Create environment variables

Create a `.env.local` file:

```env
DATABASE_URL=your_database_url

BETTER_AUTH_URL=http://localhost:3000

GEMINI_API_KEY=your_gemini_api_key
```

### 4. Set up the database

```bash
pnpm db:push
```

### 5. Start the development server

```bash
pnpm dev
```

Open:

```text
http://localhost:3000
```

---

## 🧠 Example Workflow

A typical NextStep workflow looks like this:

```text
Upload Resume
      ↓
Extract Profile
      ↓
Review & Edit
      ↓
Save Profile
      ↓
Upload Internship PDF
      ↓
Extract Requirements
      ↓
Compare With Profile
      ↓
88% Match
      ↓
Eligibility Breakdown
      ↓
Personalized Action Plan
```

For example:

```text
Software Engineering Intern

Match: 88%

✓ Currently pursuing a relevant degree
✓ JavaScript knowledge
✓ React experience

? Node.js / REST API experience
? Git / GitHub experience

Next steps:

1. Highlight backend experience on your resume
2. Update your GitHub profile
3. Prepare your application
4. Submit before the deadline
```

---

## 🎯 Product Philosophy

NextStep is built around a simple idea:

> **Finding an opportunity isn't enough. Understanding what to do about it is the real challenge.**

Most opportunity platforms focus on discovery.

NextStep focuses on **understanding and action**.

The product aims to reduce the amount of manual work required to go from:

```text
"I found this opportunity."
```

to:

```text
"I understand where I stand,
I know what's missing,
and I know what to do next."
```

---

## 🗺️ Roadmap

### Current

- [x] User authentication
- [x] User profiles
- [x] Opportunity document upload
- [x] Text-based opportunity input
- [x] PDF/DOCX/TXT extraction
- [x] AI opportunity analysis
- [x] Eligibility breakdown
- [x] Match percentage
- [x] Action plans
- [x] Deadline handling
- [x] Saved analyses
- [x] Interactive action checklist
- [x] Resume processing
- [x] Editable extracted profile

### Planned

- [ ] Skill-gap recommendations
- [ ] Opportunity comparison
- [ ] Application readiness checks
- [ ] Better structured experience/project profiles
- [ ] More opportunity sources
- [ ] Personalized opportunity recommendations

---

## 🔐 Privacy

Uploaded documents and profile information are used to provide NextStep's analysis and personalization features.

Sensitive information should only be uploaded when necessary for the intended workflow.

---

## 🤝 Contributing

Contributions, ideas, and feedback are welcome.

If you have an idea for improving NextStep:

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/your-feature
```

3. Make your changes
4. Commit your work

```bash
git commit -m "feat: add your feature"
```

5. Push your branch

```bash
git push origin feature/your-feature
```

6. Open a pull request

---

## 📄 License

This project is currently being developed as a hackathon/product project.

License information will be added as the project evolves.

---

## 👨‍💻 Built With

Built with curiosity, caffeine, and a lot of debugging.

**NextStep**

> Know what you qualify for. Know what to do next.
