export type MndaTermOption = "expires" | "until-terminated";
export type ConfidentialityTermOption = "years" | "perpetuity";

export interface MndaFormValues {
  purpose: string;
  effectiveDate: string;
  governingLaw: string;
  jurisdiction: string;
  mndaTermOption: MndaTermOption;
  mndaTermYears: string;
  confidentialityTermOption: ConfidentialityTermOption;
  confidentialityTermYears: string;
}

export const defaultMndaFormValues: MndaFormValues = {
  purpose: "",
  effectiveDate: "",
  governingLaw: "",
  jurisdiction: "",
  mndaTermOption: "expires",
  mndaTermYears: "1",
  confidentialityTermOption: "years",
  confidentialityTermYears: "1",
};

function formatYears(years: string): string {
  const value = years.trim();
  const plural = value === "1" ? "year" : "years";
  return `${value || "[N]"} ${plural}`;
}

function describeMndaTerm(values: MndaFormValues): string {
  return values.mndaTermOption === "expires"
    ? `Expires ${formatYears(values.mndaTermYears)} from the Effective Date`
    : "Continues until terminated in accordance with the terms of this MNDA";
}

function describeConfidentialityTerm(values: MndaFormValues): string {
  return values.confidentialityTermOption === "years"
    ? `${formatYears(
        values.confidentialityTermYears,
      )} from the Effective Date, but in the case of trade secrets until the Confidential Information is no longer considered a trade secret under applicable law`
    : "In perpetuity";
}

const COVERPAGE_SPAN = /<span class="coverpage_link">([^<]+)<\/span>/g;

/**
 * Replaces every `coverpage_link` placeholder in the raw Standard Terms
 * markdown with the corresponding value from the form. A given placeholder
 * name (e.g. "Purpose") may appear multiple times in the template and always
 * resolves to the same value.
 */
export function fillMndaTemplate(
  template: string,
  values: MndaFormValues,
): string {
  const replacements: Record<string, string> = {
    Purpose: values.purpose || "[Purpose not provided]",
    "Effective Date": values.effectiveDate || "[Effective Date not provided]",
    "MNDA Term": describeMndaTerm(values),
    "Term of Confidentiality": describeConfidentialityTerm(values),
    "Governing Law": values.governingLaw || "[Governing Law not provided]",
    Jurisdiction: values.jurisdiction || "[Jurisdiction not provided]",
  };

  return template.replace(COVERPAGE_SPAN, (match, placeholder: string) => {
    const value = replacements[placeholder];
    return value !== undefined ? `**${value}**` : match;
  });
}
