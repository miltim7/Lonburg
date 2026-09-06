import type {
  EstimateContent,
  EstimateFieldName,
  EstimateValues,
} from "@/types/content";
export type EstimateErrors = Partial<Record<EstimateFieldName, string>>;
export function validateEstimate(
  values: EstimateValues,
  content: EstimateContent,
): EstimateErrors {
  const errors: EstimateErrors = {};
  for (const field of content.fields) {
    const value = values[field.name].trim();
    if (field.required && !value)
      errors[field.name] = content.validation.required;
    else if (value.length > field.maxLength)
      errors[field.name] = content.validation.tooLong;
  }
  const contact = values.contact.trim();
  if (contact && !errors.contact) {
    const phone =
      /^\+?[\d\s()-]+$/.test(contact) &&
      /^\d{10,15}$/.test(contact.replace(/\D/g, ""));
    const telegram = /^@[A-Za-z][A-Za-z0-9_]{4,31}$/.test(contact);
    if (!phone && !telegram) errors.contact = content.validation.contact;
  }
  return errors;
}
export type EstimateSubmissionResult = { status: "unavailable" };
// Integration boundary: replace with your API/CRM adapter and handle a verified response.
// Never log or persist personal data here. No network request is made in this version.
export async function submitEstimate(
  _values: EstimateValues,
): Promise<EstimateSubmissionResult> {
  void _values;
  return { status: "unavailable" };
}
export function downloadEstimate(
  values: EstimateValues,
  content: EstimateContent,
) {
  const text = [
    content.downloadHeading,
    ...(values.vehicleType
      ? [`${content.categoryLabel}: ${values.vehicleType}`]
      : []),
    "",
    ...content.fields.map(
      (field) => `${field.label}: ${values[field.name].trim() || "—"}`,
    ),
  ].join("\r\n");
  const url = URL.createObjectURL(
    new Blob(["\uFEFF", text], { type: "text/plain;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = content.downloadFilename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
