# NSK-portfolio

This is an isolated React/Vite entry point for the preserved Framer website export in `public/original-site`. The archived Framer pages retain the original visual design, scroll behavior, and interactions inside the React app. `original-site/` at the project root is the human-organized archive; the copy in `public/` lets Vite serve it locally without changing that archive.

## Run

1. Install Node.js 20.19+ (or 22.12+).
2. From this folder run `npm install`.
3. Run `npm run dev` and open the local URL Vite prints.
4. For a production build, run `npm run build`.

The archived Framer export loads some media and runtime resources from Framer, so an internet connection is required for full visual parity.
