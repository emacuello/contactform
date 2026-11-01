# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A one-page contact form (Spanish UI) for the portfolio (https://portafolio.emacuello.dev/), served at https://contacto.emacuello.dev/. Node 24 (`engines`), pnpm. React 18 + TypeScript + Vite + Tailwind 3. There is no backend here: the form posts to a separate API.

## Commands

- `pnpm dev`: Vite dev server
- `pnpm build`: `tsc -b && vite build`. Type errors fail the build.
- `pnpm lint`: ESLint with `--max-warnings 0`, so any warning fails it.
- `pnpm preview`: serve the built `dist/`

There are no tests.

## Architecture

All the logic and markup live in `src/App.tsx`. `App.css` is empty, and `index.css` only holds the Tailwind directives.

The submit flow in `handleSubmit`:
1. Validate the inputs on the client, and require a Cloudflare Turnstile token (`@marsidev/react-turnstile`, `onSuccess` → `token` state).
2. `POST {VITE_FORM_URL}/contact/form-token` gets a short-lived JWT (`jwtToken()`).
3. `POST {VITE_FORM_URL}/contact` with the JSON body `{name, email, message}` and these headers: the custom header pair, `turnstile-response: <token>`, `Authorization: Bearer <jwt>`.

Both requests send a custom header whose **name** comes from `VITE_BACK_KEY_HEADERS` and whose **value** comes from `VITE_BACK_VALUE_HEADERS`.

### Environment variables (Vite, `import.meta.env`)

`VITE_FORM_URL`, `VITE_TURNSTILE_SITE_KEY`, `VITE_BACK_KEY_HEADERS`, `VITE_BACK_VALUE_HEADERS`. The repo has no `.env.example`. Every `VITE_*` value ends up in the client bundle.

### Non-obvious behavior

- The result dialog (headlessui `Dialog`) chooses between success and error with `validateErrors(form)`, which is true when any form field is non-empty. After a successful send the form is reset to empty, so the dialog shows success. On a failure the fields are still filled, so it shows the error and `errorResponse`. Changing how the form resets after a send also changes which message the dialog shows.
- `handleSubmit` calls `setError(validateInputs(form))` but then checks `validateErrors(error)`, which is the **previous** render's error state. As a result, the client-side validation does not block the current submit (the HTML `required` attributes do most of the work).
- In `tailwind.config.js`, `theme.animation` and `theme.keyframes` sit outside `extend`, so they **replace** Tailwind's default animations (`animate-spin`, `animate-pulse` and so on don't exist). The `text-gradient` animation is inside `extend`.
