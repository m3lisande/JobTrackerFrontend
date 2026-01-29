# Job Tracker Frontend

React + Vite frontend for the Job Tracker app. Uses Clerk for authentication and React Router for navigation.

---

## Prerequisites

Before running the frontend, you need:

1. **Node.js** — Version 18 or higher (20+ recommended).  
   Check: `node -v`

2. **npm** — Comes with Node.js.  
   Check: `npm -v`

---

## 1. Install dependencies

From the **frontend** folder:

```bash
cd frontend
npm install
```

This installs React, Vite, React Router, Clerk, ESLint, and the rest of the dependencies from `package.json`.

---

## 2. Environment variables - case where .env doesn't exist

The app uses **Clerk** for auth and expects a publishable key in the environment.

1. In the `frontend` folder, create a file named `.env` (if it doesn’t exist).

2. Add:

   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
   ```

3. Get the key from [Clerk Dashboard](https://dashboard.clerk.com):
   - Sign in or create an account
   - Create or select an application
   - Open **API Keys**
   - Copy the **Publishable key** (starts with `pk_test_` or `pk_live_`)

**Important:**  
- Only variables prefixed with `VITE_` are exposed to the client in Vite.  
- Do not commit real keys to git. `.env` should be in `.gitignore` (and is in this project).

---

## 3. Run the development server

From the **frontend** folder:

```bash
npm run dev
```

Vite starts the dev server (usually at **http://localhost:5173**).  
The terminal will show the exact URL. Open it in a browser.

You get:
- Hot Module Replacement (HMR) — edits in code update the app without a full reload  
- Fast refresh for React components  

Stop the server with `Ctrl+C` in the terminal.

---

## Other npm scripts

| Command        | Description                                      |
|----------------|--------------------------------------------------|
| `npm run dev`  | Start dev server (default: http://localhost:5173) |
| `npm run build`| Production build; output goes to `dist/`         |
| `npm run preview` | Serve the production build locally (after `npm run build`) |
| `npm run lint` | Run ESLint on the project                        |

---

## Project structure (relevant to running the app)

```
frontend/
├── .env                 # Your env vars (create this; don’t commit secrets)
├── index.html           # Entry HTML
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
├── public/              # Static assets
└── src/
    ├── main.jsx        # App entry; wraps app with ClerkProvider
    ├── App.jsx         # Root component and routes
    ├── App.css
    ├── index.css       # Global styles
    ├── components/     # Reusable components (e.g. Header)
    └── pages/          # Route pages (Home, Login, Applications, etc.)
```

---

## Troubleshooting

- **“VITE_CLERK_PUBLISHABLE_KEY is undefined”**  
  Add `VITE_CLERK_PUBLISHABLE_KEY` to `.env` in the `frontend` folder and restart the dev server (`npm run dev`).

- **Port 5173 already in use**  
  Vite will offer the next free port (e.g. 5174), or you can set a port in `vite.config.js` under `server.port`.

- **Dependencies out of date or install fails**  
  Try: `rm -rf node_modules package-lock.json` then `npm install` again.

- **Clerk login/signup not working**  
  Check in the Clerk Dashboard that the app is set up, the key is correct in `.env`, and that allowed redirect/origin URLs include your dev URL (e.g. `http://localhost:5173`).

---

## Summary: minimal steps to run

```bash
cd frontend
npm install
# Create .env with VITE_CLERK_PUBLISHABLE_KEY=your_key
npm run dev
```

Then open the URL shown in the terminal (usually http://localhost:5173).
