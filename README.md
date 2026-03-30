# 🏋️ Gym Experience & Frustration Survey

## Description

A short, accessible web-based survey that collects gym users' habits, frustrations, and overall experience — then visualises the aggregated results with interactive charts. It was built as a course project to explore full-stack web development with a real database backend. The app targets everyday gym-goers and gym operators looking for honest, anonymous feedback about their facilities.

## Badges

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-2-22B5BF?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-8A3BDB?style=for-the-badge)

## Features

- **4-page flow** — Landing page → Survey form → Confirmation summary → Aggregated results
- **7 fully validated questions** — dropdowns, radio buttons, checkboxes, and free text, all required with inline error messages
- **Dynamic "Other" field** — a text input appears automatically when the "Other" frustration option is checked
- **Real-time submission feedback** — the submit button displays "Submitting…" while the request is in flight and retains all inputs if it fails
- **Confirmation summary** — after submitting, users see a readable recap of every answer they gave
- **Live results dashboard** — four Recharts visualisations (gym frequency, top frustrations, anxiety levels, preferred times) built from all anonymous responses
- **Fully accessible** — every input has a `<label>`, errors use `aria-describedby`, focus rings are visible on all interactive elements, and colour contrast meets WCAG 2.1 AA
- **Responsive layout** — single-column on mobile, wider card layout on tablet and desktop

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI component library and rendering |
| TypeScript 5.9 | Static typing across the entire codebase |
| Vite 7 | Development server and production bundler |
| React Router DOM v7 | Client-side routing (`/`, `/survey`, `/confirmation`, `/results`) |
| Supabase JS v2 | PostgreSQL database client (insert responses, query aggregates) |
| Recharts 2 | Bar charts and pie chart on the results dashboard |
| Tailwind CSS v4 | Utility-first styling and responsive layout |
| pnpm Workspaces | Monorepo package management |

## Getting Started

### Prerequisites

- [Node.js 20+](https://nodejs.org/) (Node 24 recommended)
- [pnpm 10+](https://pnpm.io/installation)
- A [Supabase](https://supabase.com/) account with a project created

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

   Create a `.env` file inside `artifacts/gym-survey/` (or set them as Replit Secrets):

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

   Both values are found in your Supabase dashboard under **Project Settings → API**.

4. **Create the database table**

   Open your Supabase dashboard, navigate to **SQL Editor → New query**, paste in the contents of `artifacts/gym-survey/supabase-setup.sql`, and click **Run**.

5. **Start the development server**

```bash
pnpm --filter @workspace/gym-survey run dev
```

   The app is now available at `http://localhost:24478`.

## Usage

### Running the app

```bash
# Development (with hot-module replacement)
pnpm --filter @workspace/gym-survey run dev

# Production build
pnpm --filter @workspace/gym-survey run build

# Preview the production build locally
pnpm --filter @workspace/gym-survey run serve
```

### Navigation

| Route | Page |
|---|---|
| `/` | Home — links to survey and results |
| `/survey` | 7-question survey form |
| `/confirmation` | Post-submission summary of responses |
| `/results` | Aggregated, anonymous results dashboard |

### Configuration

| Variable | Description | Required |
|---|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key | Yes |

## Project Structure

```
artifacts/gym-survey/
├── src/
│   ├── components/
│   │   └── Footer.tsx          # Shared footer rendered on every page
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client initialisation
│   │   └── types.ts            # Shared TypeScript interfaces (form data, DB rows, results)
│   ├── pages/
│   │   ├── Home.tsx            # Landing page with navigation buttons
│   │   ├── Survey.tsx          # 7-question form with validation and Supabase insert
│   │   ├── Confirmation.tsx    # Post-submission answer summary
│   │   └── Results.tsx         # Aggregated results with 4 Recharts visualisations
│   ├── App.tsx                 # BrowserRouter + route definitions
│   ├── index.css               # Tailwind imports and CSS custom properties (theme)
│   └── main.tsx                # React DOM entry point
├── supabase-setup.sql          # SQL to create table and configure RLS policies
├── vite.config.ts              # Vite config with safe PORT/BASE_PATH fallbacks
├── tsconfig.json               # TypeScript config (extends workspace base)
└── package.json                # Package manifest (@workspace/gym-survey)
```

## Changelog

### v1.0.0 — 2026-03-29

- Initial release
- Home, Survey, Confirmation, and Results pages
- All 7 PRD-specified questions with correct input types
- Dynamic "Other" text field on Q3
- Full client-side validation with accessible error messages
- Supabase integration for storing and reading anonymous responses
- Four Recharts visualisations on the results dashboard
- WCAG 2.1 AA accessibility compliance
- Responsive design for mobile, tablet, and desktop

## Known Issues / To-Do

- [ ] The results page fetches all rows from Supabase on every load — should be replaced with server-side aggregation or a Supabase RPC function for scalability
- [ ] The "Other" field for Q3 is stored as a plain text column (`frustrations_other`) but is not yet included in the results charts
- [ ] No success toast or notification is shown if the user navigates directly to `/confirmation` without submitting (currently shows a fallback message)

## Roadmap

- **Server-side aggregation** — replace client-side data processing with a Supabase RPC/view so the results page scales to thousands of responses
- **Experience rating chart** — add a fifth visualisation showing the breakdown of Excellent / Good / Average / Poor ratings
- **Export to CSV** — allow instructors or gym operators to download all anonymous responses as a CSV file
- **Multi-language support** — internationalise survey questions and UI labels (i18n)
- **Admin dashboard** — password-protected page showing response trends over time

## Contributing

Contributions are welcome. Please open an issue first to discuss any significant change before submitting a pull request. Make sure all existing TypeScript checks pass (`pnpm --filter @workspace/gym-survey run typecheck`) before opening a PR.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature-name`)
3. Commit your changes (`git commit -m 'feat: add your feature'`)
4. Push to your branch (`git push origin feature/your-feature-name`)
5. Open a Pull Request against `main`

## License

This project is licensed under the [MIT License](LICENSE).

## Author

**Lake Mauer**
University of Iowa — BAIS:3300, Spring 2026

## Contact

GitHub: [@LakeMauer](https://github.com/LakeMauer)

## Acknowledgements

- [Supabase Docs](https://supabase.com/docs) — Row Level Security and JavaScript client reference
- [Recharts Documentation](https://recharts.org/) — chart component API and layout examples
- [React Router v7 Docs](https://reactrouter.com/) — client-side routing patterns
- [Tailwind CSS Docs](https://tailwindcss.com/docs) — utility class reference
- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/) — accessibility compliance reference
- [shields.io](https://shields.io/) — badge generation
- [Replit](https://replit.com/) — development environment and hosting platform
- [Claude (Anthropic)](https://www.anthropic.com/) — AI assistant used during development
