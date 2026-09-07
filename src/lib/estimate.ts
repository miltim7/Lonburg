import type {
  EstimateContent,
  EstimateFieldName,
  EstimateValues,
} from "@/types/content";
export type EstimateErrors = Partial<Record<EstimateFieldName, string>>;
export const estimateFormName = "lonburg-request";
const estimateFormEndpoint =
  process.env.NEXT_PUBLIC_ESTIMATE_FORM_ENDPOINT?.trim() || "/__forms.html";
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
export type EstimateSubmissionResult = { status: "success" | "failed" };
export async function submitEstimate(
  values: EstimateValues,
): Promise<EstimateSubmissionResult> {
  const body = new URLSearchParams();
  body.set("form-name", estimateFormName);
  body.set("bot-field", "");
  body.set("vehicleType", values.vehicleType ?? "");
  body.set("model", values.model.trim());
  body.set("condition", values.condition.trim());
  body.set("year", values.year.trim());
  body.set("power", values.power.trim());
  body.set("engineVolume", values.engineVolume.trim());
  body.set("city", values.city.trim());
  body.set("name", values.name.trim());
  body.set("contact", values.contact.trim());
  body.set("registration", values.registration.trim());
  body.set("comment", values.comment.trim());
  try {
    const response = await fetch(estimateFormEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    return { status: response.ok ? "success" : "failed" };
  } catch {
    return { status: "failed" };
  }
}
