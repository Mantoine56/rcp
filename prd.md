# Product Requirements Document (PRD)

**Product Name**: GC-RCP Lite – Risk & Compliance Self-Assessment Portal  
**Prepared By**: Antoine Elias – Director, Custom Development (TBS)  
**Last Updated**: 14 May 2025 (rev-1)

## 1. Purpose & Vision

Federal departments currently complete the Treasury Board Secretariat (TBS) Risk & Compliance Process (RCP) via a 60-page Word workbook and Excel annex. This manual workflow causes version-control issues, calculation errors, and reporting delays.

**Vision**: Provide a lightweight, fully-digital assessment portal that instantly calculates compliance flags, maturity scores, and residual risks, producing a Deputy-Head-ready PDF. The MVP runs entirely on a single developer laptop for rapid demonstration, while the architecture supports an effortless transition to multi-tenant cloud deployment.

**New in rev-1**: Add a Draft capability so coordinators can save progress and resume later, and include a sliding workflow overview that lets the user visualize every step at a glance.

## 2. Scope – MVP 1 (7-day deliverable)

| Category | In Scope | Out of Scope / Phase 2+ |
|----------|----------|------------------------|
| **Users & Auth** | Single local user (Department Coordinator) | Azure AD SSO, role-based access (Area Owners, Deputy Representative, Deputy Head, TBS Analyst) |
| **Assessment** | Full 11 Areas of Focus, static JSON question bank, Draft save & resume | Admin upload of new question banks |
| **Validation** | Inline red-flag detection, maturity averaging | Organization-wide analytics & dashboards |
| **Workflow UI** | Sliding workflow overview component with progress indicators | Kanban dashboard, multi-user swim-lane views |
| **Risk Register** | 3 corporate + 1 area risk rows; residual score calculation | Unlimited risks, CSV export |
| **Persistence** | SQLite via Prisma ORM (draft + final states) | Postgres (Supabase/Azure), migration scripts |
| **Output** | Bilingual (EN/FR) PDF export mirroring Word layout | Power BI embed, XLSX export |
| **Deployment** | Runs with `npm run dev` on macOS | Docker image, Azure App Service CI/CD |
| **UI Design** | Canada.ca Web Experience Toolkit (WET) styling and components | Custom branding not following GC standards |

## 3. Success Metrics

- Demo executed end-to-end with no console errors on a single laptop
- Draft resume works after app restart
- Sliding workflow renders in <100ms and updates on navigation
- PDF output accepted by Deputy Head as equivalent to existing form
- Boss signs off to proceed to multi-user Phase 2

## 4. User Roles (MVP 1)

**Department Coordinator** (single-user) – creates assessment, completes answers, enters risks, reviews workflow overview, generates PDF.

*Roles for future versions:*
- Deputy Representative (DepRep) – owns overall workflow & delegates Areas of Focus to Area Owners
- Area-of-Focus Owner
- Deputy Head Reviewer
- TBS Analyst

## 5. Key Features & Functional Requirements

| ID | Requirement | Priority |
|----|------------|----------|
| FR-1 | Create new assessment for selected fiscal year | Must |
| FR-2 | Render dynamic wizard from JSON question bank | Must |
| FR-3 | Support answer types: Frequency, Yes/No, Percentage (numeric), Maturity 0-4 | Must |
| FR-4 | Auto-evaluate answers against flagCondition and persist flag=true/false | Must |
| FR-5 | Real-time summary page: list of flags + average maturity by area | Must |
| FR-6 | Risk table with auto residual calculation likelihood × impact and heat-map color | Must |
| FR-7 | Generate bilingual PDF matching existing Word layout | Must |
| FR-8 | Persist all data locally (SQLite) and survive app restart | Must |
| FR-9 | Static language toggle (EN/FR) | Should |
| FR-10 | Dark-mode theme toggle | Could |
| FR-11 | Draft save & resume: every answer & risk auto-saved; manual "Save Draft" button | Must |
| FR-12 | Sliding workflow overview: persistent top/bottom bar (or drawer) showing step progress (Answer Qs → Review Flags → Enter Risks → Export PDF) with clickable navigation | Should |

## 6. Non-Functional Requirements

- **Performance**: <200ms client-side render for wizard pages; <100ms update for workflow slider
- **Accessibility**: WCAG 2.1 AA compliance (keyboard nav, semantic HTML) following Government of Canada standards
- **Portability**: Entire project (code + DB) in a single Git repo; no external services
- **Maintainability**: Type-safe code (TypeScript 5), ESLint & Prettier CI hooks
- **Security**: Localhost only; no network exposure
- **Canada.ca Compliance**: Adhere to Web Experience Toolkit (WET) and GCWeb theme standards for all UI components
- **Bilingual Support**: All UI elements must support both English and French languages

## 7. User Flows

### Create & Complete Assessment
1. Home → New Assessment → wizard loads first Area of Focus
2. Sliding workflow bar shows four steps; current step highlighted
3. User answers questions; data auto-saves (draft)

### Review Summary
- Click step 2 in slider or Summary tab → counts of flags and average maturity by area

### Enter Risks
- Step 3 in slider opens Risk Register grid (3 corporate + 1 area)
- Residual heat-map auto-updates

### Export PDF
- Step 4 button generates PDF and marks workflow complete

Resume Draft

On relaunch, Continue Last Draft button loads last incomplete assessment at the saved step.

8  Data Model (Prisma Schema excerpt)

model Assessment {
  id         Int       @id @default(autoincrement())
  fiscalYear String
  status     String    @default("draft")  // draft | completed
  currentStep Int      @default(1)         // 1‑4
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
  answers    Answer[]
  risks      Risk[]
}

(Answer & Risk models remain unchanged.)

9   Technology Stack

Next.js 15, React 19, TypeScript 5

TailwindCSS 3, shadcn/ui (customized for Canada.ca UI standards), lucide‑react

react‑hook‑form + Zod

Prisma 5 ORM → SQLite

@react-pdf/renderer

Canada.ca Web Experience Toolkit (WET) / GCWeb theme components

Additional package for workflow slider (optional): keen-slider or shadcn/ui Tabs component (customized to meet GC styling).

10   API Service Layer (local Next.js API Routes)

Route

Method

Purpose

/api/assessment

POST

Create new assessment

/api/assessment/:id

PATCH

Update status or currentStep (draft progress)

/api/assessment/:id/answer

PUT

Persist/update answer; returns new flag state

/api/assessment/:id/summary

GET

Return flag counts + maturity averages

/api/assessment/:id/risk

POST

Add/modify risk rows

/api/pdf/:id

GET

Stream generated PDF

11  Project Milestones & Timeline (7 calendar days)

Day

Deliverable

1

Repo scaffold, Tailwind, Prisma schema inc. draft fields, seed question bank

2

Wizard + auto‑save, draft resume logic

3

Flag logic, Summary page, workflow slider navigation

4

Risk Register grid + residual calculation

5

PDF template & generation route

6

Bilingual JSON, dark‑mode CSS toggle, accessibility pass

7

End‑to‑end testing (incl. draft), demo script, README

12  Detailed Task Breakdown (MVP 1 Build Guide)

Below is an actionable task list your AI pair‑coder can follow.  Task IDs map back to the functional requirements (FR) and non‑functional requirements (NFR).

Phase 0 – Project Setup

ID

Task

Ref

T‑0.1

Bootstrap repo with create‑next‑app@latest --ts, ESLint, Prettier, Husky pre‑commit

FR‑1

T‑0.2

Install core deps: Tailwind, prisma + sqlite, react‑hook‑form, zod, lucide‑react, shadcn/ui

FR‑1

T‑0.3

Initialise Prisma; create database.sqlite; generate client

FR‑8

T‑0.4

Seed the static questionBank.ts via prisma db seed

FR‑2

Phase 1 – Data Layer & API

ID

Task

Ref

T‑1.1

Implement Prisma models Assessment, Answer, Risk with draft fields

FR‑8

T‑1.2

Build Next.js API routes: create assessment (POST /api/assessment), update step (PATCH /api/assessment/:id)

FR‑1, FR‑11

T‑1.3

API route to upsert answer with flag logic util (PUT /api/assessment/:id/answer)

FR‑3, FR‑4

T‑1.4

API route to compute summary (GET /api/assessment/:id/summary)

FR‑5

T‑1.5

API route to manage risks (POST /api/assessment/:id/risk)

FR‑6

Phase 2 – UI Components

ID

Task

Ref

T‑2.1

Layout shell with shadcn Sidebar + Header; inject workflow slider component bottom fixed

FR‑12

T‑2.2

Dynamic WizardPage: render questions for current Area; map resultType to shadcn form controls

FR‑2, FR‑3

T‑2.3

Auto‑save hook: debounce 500 ms → call answer API; update local state for flag icon

FR‑11

T‑2.4

Flag icon component (lucide AlertCircle) appearing inline; tooltip shows requirement text

FR‑4

T‑2.5

SummaryPage: table of flags (# per area) + bar chart (Recharts) average maturity

FR‑5

T‑2.6

RiskTable: editable grid (shadcn DataTable) with likelihood/impact dropdowns and residual score cell colour

FR‑6

T‑2.7

PDFGenerator React‑PDF component; route /api/pdf/:id streams file

FR‑7

T‑2.8

Language toggle (simple state in context) swapping EN/FR JSON labels

FR‑9

T‑2.9

Dark‑mode toggle leveraging Tailwind dark: classes

FR‑10

Phase 3 – Workflow Slider Logic

ID

Task

Ref

W‑3.1

Create slider component (keen‑slider or custom flex) with 4 steps; bind to currentStep

FR‑12

W‑3.2

On form navigation or manual click, PATCH assessment currentStep

FR‑11, FR‑12

W‑3.3

Show green checkmarks for completed steps (all mandatory fields answered)

NFR‑Perf

Phase 4 – Quality & Testing

ID

Task

Ref

Q‑4.1

Unit tests (Vitest) for flagLogic, residual calculation util

NFR‑Maint

Q‑4.2

Integration test for draft save/resume (GET /api/assessment after restart)

FR‑11

Q‑4.3

Cypress flow test: create assessment → answer → risk → PDF

Overall

Q‑4.4

Axe accessibility scan on main pages

NFR‑A11y

Phase 5 – Packaging & Demo Prep

ID

Task

Ref

P‑5.1

Update README with install/run steps, architecture diagram

Deliverable

P‑5.2

Create demo script & sample filled assessment db seed

Success Metrics

P‑5.3

Tag v0.1-demo release in Git

Governance

Estimated Effort: 40‑45 person‑hours (1 dev in 7 calendar days)

13  Out‑of‑Scope Items (Phase 2 Backlog)

Unchanged – see previous section.

14  Risks & Mitigations

Unchanged.

15  Acceptance Criteria

Unchanged – includes draft & workflow functionality.

  Out‑of‑Scope Items (Phase 2 Backlog)

Azure AD authentication & role‑based access (DepRep, Area Owners, DH)

Evidence file uploads (Azure Blob / Supabase Storage)

Admin UI for question bank management

Power BI or Recharts analytics dashboard

Dockerfile + Azure Pipeline deployment

13  Risks & Mitigations

Risk

Probability

Impact

Mitigation

Draft auto‑save bugs lead to data loss

Medium

High

Use debounced writes; unit tests on resume logic

Workflow slider library adds bloat

Low

Medium

Use Tailwind Tabs for minimal dependency

Completion within 7 days

Medium

High

Strict time‑boxed scope; reuse generated code snippets

14  Acceptance Criteria

All rev‑1 features implemented (FR‑1 → FR‑12).

Draft remains after quitting dev server and reopening.

Workflow slider correctly reflects currentStep.

Unit tests ≥ 80 % statements for flag, residual, draft save/resume util.

Generated PDF passes side‑by‑side content check.

Ready for build.Feed this PRD to Cursor AI or GitHub Copilot to scaffold the draft logic and workflow slider in addition to the core assessment wizard.

