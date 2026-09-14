import { readFile } from "node:fs/promises";
import path from "node:path";
import MndaForm from "@/components/MndaForm";

async function loadMndaTemplate(): Promise<string> {
  const templatePath = path.join(
    process.cwd(),
    "..",
    "templates",
    "mutual-nda.md",
  );
  return readFile(templatePath, "utf-8");
}

export default async function Home() {
  const template = await loadMndaTemplate();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10 sm:px-10">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Mutual NDA Creator
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Fill in the details below to generate a Common Paper Mutual
          Non-Disclosure Agreement, then download it as a Markdown file.
        </p>
      </header>
      <MndaForm template={template} />
    </div>
  );
}
