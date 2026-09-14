"use client";

import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  defaultMndaFormValues,
  fillMndaTemplate,
  type MndaFormValues,
} from "@/utils/fillTemplate";

interface MndaFormProps {
  template: string;
}

export default function MndaForm({ template }: MndaFormProps) {
  const [values, setValues] = useState<MndaFormValues>(defaultMndaFormValues);

  const filledDocument = useMemo(
    () => fillMndaTemplate(template, values),
    [template, values],
  );

  function updateField<K extends keyof MndaFormValues>(
    field: K,
    value: MndaFormValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleDownload() {
    const blob = new Blob([filledDocument], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const datePart = values.effectiveDate || "draft";
    link.href = url;
    link.download = `mutual-nda-${datePart}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid flex-1 grid-cols-1 gap-8 lg:grid-cols-2">
      <form
        className="flex flex-col gap-5 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="purpose" className="text-sm font-medium">
            Purpose
          </label>
          <p className="text-xs text-zinc-500">
            How Confidential Information may be used.
          </p>
          <textarea
            id="purpose"
            rows={3}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            placeholder="Evaluating whether to enter into a business relationship with the other party."
            value={values.purpose}
            onChange={(event) => updateField("purpose", event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="effectiveDate" className="text-sm font-medium">
            Effective Date
          </label>
          <input
            id="effectiveDate"
            type="date"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            value={values.effectiveDate}
            onChange={(event) =>
              updateField("effectiveDate", event.target.value)
            }
          />
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium">MNDA Term</legend>
          <p className="text-xs text-zinc-500">The length of this MNDA.</p>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="mndaTermOption"
              checked={values.mndaTermOption === "expires"}
              onChange={() => updateField("mndaTermOption", "expires")}
            />
            Expires
            <input
              type="number"
              min={1}
              aria-label="MNDA term length in years"
              className="w-16 rounded-md border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              value={values.mndaTermYears}
              onChange={(event) =>
                updateField("mndaTermYears", event.target.value)
              }
              disabled={values.mndaTermOption !== "expires"}
            />
            year(s) from Effective Date
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="mndaTermOption"
              checked={values.mndaTermOption === "until-terminated"}
              onChange={() =>
                updateField("mndaTermOption", "until-terminated")
              }
            />
            Continues until terminated in accordance with the MNDA
          </label>
        </fieldset>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium">
            Term of Confidentiality
          </legend>
          <p className="text-xs text-zinc-500">
            How long Confidential Information is protected.
          </p>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="confidentialityTermOption"
              checked={values.confidentialityTermOption === "years"}
              onChange={() =>
                updateField("confidentialityTermOption", "years")
              }
            />
            <input
              type="number"
              min={1}
              aria-label="Confidentiality term length in years"
              className="w-16 rounded-md border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              value={values.confidentialityTermYears}
              onChange={(event) =>
                updateField("confidentialityTermYears", event.target.value)
              }
              disabled={values.confidentialityTermOption !== "years"}
            />
            year(s) from Effective Date (trade secrets excepted)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="confidentialityTermOption"
              checked={values.confidentialityTermOption === "perpetuity"}
              onChange={() =>
                updateField("confidentialityTermOption", "perpetuity")
              }
            />
            In perpetuity
          </label>
        </fieldset>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="governingLaw" className="text-sm font-medium">
            Governing Law
          </label>
          <input
            id="governingLaw"
            type="text"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            placeholder="e.g. Delaware"
            value={values.governingLaw}
            onChange={(event) =>
              updateField("governingLaw", event.target.value)
            }
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="jurisdiction" className="text-sm font-medium">
            Jurisdiction
          </label>
          <input
            id="jurisdiction"
            type="text"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            placeholder="e.g. courts located in New Castle, DE"
            value={values.jurisdiction}
            onChange={(event) =>
              updateField("jurisdiction", event.target.value)
            }
          />
        </div>

        <button
          type="button"
          onClick={handleDownload}
          className="mt-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Download Mutual NDA (.md)
        </button>
      </form>

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Preview
        </h2>
        <div className="prose prose-zinc dark:prose-invert max-w-none flex-1 overflow-y-auto rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <ReactMarkdown>{filledDocument}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
