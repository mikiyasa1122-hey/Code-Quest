# Code Quest GitHub Pages Demo

This folder contains the DB-free static version of Code Quest.

- It runs directly on GitHub Pages.
- Quest data lives in `app.js`.
- Progress, XP, badges, and answer history are saved in each browser's `localStorage`.
- The full-stack Next.js + Prisma + PostgreSQL version remains in `src/` and `prisma/`.

## GitHub Pages settings

In the GitHub repository settings, configure Pages like this:

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/docs`

After GitHub Pages finishes deploying, the static demo will be available at:

```txt
https://mikiyasa1122-hey.github.io/Code-Quest/
```
