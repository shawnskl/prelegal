# Mutual NDA Creator (frontend)

A Next.js prototype for [KAN-11](https://shawnskl8.atlassian.net/browse/KAN-11). Users fill in a form with the key terms of a Mutual NDA, see a live preview of the completed agreement, and download it as a Markdown file.

The app reads the Common Paper Mutual NDA Standard Terms directly from [`../templates/mutual-nda.md`](../templates/mutual-nda.md) (added in KAN-10) and fills in its `coverpage_link` placeholders (Purpose, Effective Date, MNDA Term, Term of Confidentiality, Governing Law, Jurisdiction) with the values entered in the form.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

## Structure

- `app/page.tsx` — Server Component; reads the source template from `../templates/mutual-nda.md`.
- `components/MndaForm.tsx` — Client Component; form state, live Markdown preview (via `react-markdown`), and the download action.
- `utils/fillTemplate.ts` — pure function that fills the template's placeholders given form values.
