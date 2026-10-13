# AngularNotes

A notes app built with **Angular 21** — create, search, view and delete notes, backed by a REST API.

**Live demo:** [murad-proger.github.io/angular-notes](https://murad-proger.github.io/angular-notes/)

I'm a frontend developer (React / Next.js / TypeScript). I built this project after studying the Angular docs to show that I can pick up the framework and write idiomatic, modern Angular: standalone components, signals, the new control flow syntax, reactive forms and RxJS.

<!-- Add a screenshot or GIF here, e.g.: ![AngularNotes](docs/screenshot.png) -->

## Features

- **Notes list** with loading, error and empty states, plus a **Retry** button when the request fails
- **Live search** by title and description; the query is stored in the URL (`/notes?search=...`), so a filtered view can be shared or reloaded
- **Create a note** with a reactive form, validation (title is required) and a submit/loading state
- **Note details page** loaded by route parameter
- **Delete a note** with protection against duplicate requests and an error message on failure
- **HTTP interceptor** that logs every outgoing request
- **Static prerendering** (`@angular/ssr`, `outputMode: static`) — the app is built to static HTML and deployed to GitHub Pages

## Tech stack

| Area | Tools |
|---|---|
| Framework | Angular 21 (standalone components, no NgModules) |
| State | Signals: `signal`, `computed`, `input`, `output`, `toSignal` |
| Async | RxJS: `switchMap`, `catchError`, `finalize` |
| Forms | Typed Reactive Forms |
| Routing | Angular Router with component input binding |
| HTTP | `HttpClient` + functional interceptor |
| Rendering | `@angular/ssr` with static prerendering (`outputMode: static`), hydration with event replay |
| Hosting | GitHub Pages |
| Backend | [Mokky.dev](https://mokky.dev) (mock REST API) |

## What I focused on

- **Modern Angular APIs.** Signal-based `input()` / `output()`, `@if` / `@for` / `@empty` control flow, `inject()` instead of constructor injection, functional interceptors.
- **Signals and RxJS together.** The detail page turns the route `id` signal into an observable, loads the note with `switchMap`, and converts the result back to a signal. It has three distinct states: loading, found, and not found.
- **State kept in the URL.** The search field and the `search` query parameter stay in sync in both directions, including the browser back button.
- **Typed API layer.** `NotesService` exposes typed methods; the `NewNote` type is derived from `Note` with `Omit<Note, 'id'>`.
- **Handling failure.** Every request has an error path visible to the user, and the delete action ignores repeated clicks while a request is in flight.

## Project structure

```
src/app/
├── components/
│   ├── note-list/      # list, search, delete, loading/error states
│   ├── note-item/      # presentational component (input/output)
│   ├── note-detail/    # single note, loaded by route param
│   └── note-create/    # reactive form with validation
├── interceptors/
│   └── logging.interceptor.ts
├── notes.service.ts    # API layer (HttpClient)
├── app.routes.ts       # /notes, /notes/new, /notes/:id
└── app.config.ts       # router, HttpClient, hydration
```

## Routes

| Path | Page |
|---|---|
| `/notes` | List with search (`?search=...`) |
| `/notes/new` | Create a note |
| `/notes/:id` | Note details |

## API

The app uses a mock REST API on Mokky.dev. The base URL is set in `src/app/notes.service.ts`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/notes` | Get all notes |
| `GET` | `/notes/:id` | Get one note |
| `POST` | `/notes` | Create a note (`title`, `description`) |
| `DELETE` | `/notes/:id` | Delete a note |

Note model:

```ts
interface Note {
  id: number;
  title: string;
  description: string;
}
```

## Getting started

Requirements: Node.js (current LTS) and npm.

```bash
git clone <repository-url>
cd angular-notes
npm install
ng serve
```

Open `http://localhost:4200/`.

Production build (static prerendered output, ready for GitHub Pages):

```bash
ng build
```

## Possible improvements

- Edit existing notes (`PATCH`)
- Unit tests for `NotesService` and components
- Pagination or debounced server-side search
- A confirmation dialog before deleting

## Author

**Murad Adigozalov** — Frontend Developer (React, Next.js, TypeScript, now Angular)
LinkedIn: [linkedin.com/in/murad-sabiroglu](https://linkedin.com/in/murad-sabiroglu)
