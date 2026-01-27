# Project Guidelines – Sabeel Islamic Website

This document defines the architecture, tools, and design rules for the Sabeel Islamic Website project.

The goal is to build a **clean, scalable, and professional Islamic / Qur’an website** using modern best practices, with a strong foundation that can grow over time without refactoring.

---

## 1. Tech Stack

The following stack is mandatory for this project:

- React (Vite)
- TypeScript
- Tailwind CSS
- Zustand (global UI & app state)
- TanStack Query (server / API state)
- i18next + react-i18next (internationalization)

Do not replace or remove these technologies unless explicitly requested.

---

## 2. Core Principles

- Prefer clarity over cleverness
- Keep code readable and maintainable
- Avoid premature optimization
- Separate concerns clearly
- Do not hardcode values that are expected to change

---

## 3. TypeScript Rules

- All components must be written in `.tsx`
- Use explicit types and interfaces
- Avoid using `any`
- Let TypeScript enforce correctness
- Do not silence TypeScript errors without reason

---

## 4. Internationalization (i18n)

- The app supports **Arabic and English**
- All user-facing text must come from translation files
- Translation files are located at:
  src/locales/en/common.json
  src/locales/ar/common.json

yaml
Copy code

- Language is auto-detected on first load
- Selected language is persisted
- RTL/LTR considerations must be respected in layout decisions

---

## 5. Theme & Dark Mode

- The app supports **light and dark themes**
- Theme behavior:
- Uses system preference on first visit
- Persists user preference
- Theme is applied globally
- Tailwind `dark:` variants are used for styling

---

## 6. Colors System (IMPORTANT)

A centralized color system is required.

### Goals

- No hardcoded colors in components
- Easy future design updates
- Clean support for light and dark themes
- Seamless integration with Tailwind CSS

---

### Colors Object

All colors are defined in a single file:

src/theme/colors.ts

css
Copy code

Structure requirements:

- Separate color values for `light` and `dark`
- Use semantic color names (background, surface, primary, text, etc.)
- Color values may initially be empty and added later without refactoring

Example structure (values added later):

```ts
export const colors = {
  light: {
    background: "",
    surface: "",
    textPrimary: "",
    textSecondary: "",
    primary: "",
    border: "",
  },
  dark: {
    background: "",
    surface: "",
    textPrimary: "",
    textSecondary: "",
    primary: "",
    border: "",
  },
};
Tailwind Integration
Colors are applied using CSS variables

Theme changes update CSS variables dynamically

Tailwind utilities reference CSS variables

Example usage:

tsx
Copy code
This ensures:

Tailwind remains the styling system

Theme switching is instant

No duplication of color logic

No refactoring when colors are updated later

7. State Management
Zustand is used for:

Global UI state

App preferences (theme, language, audio settings)

TanStack Query is used for:

Fetching and caching server data

Server state must not be stored in Zustand

8. What to Avoid
Hardcoded colors or text in components

Mixing server state with UI state

Overengineering

Large monolithic files

Ignoring accessibility and readability

9. Project Vision
This project should be:

Clean and respectful in design

Easy to maintain long-term

Scalable for future features (audio recitation, tafsir, bookmarks)

Built with modern, industry-standard practices
```
