"use client";
import { useRef, useState, type ReactNode } from "react";
import { ChevronDown, Info, Send, X } from "lucide-react";
import type {
  EstimateContent,
  EstimateField,
  EstimateValues,
} from "@/types/content";
import {
  estimateFormName,
  submitEstimate,
  validateEstimate,
  type EstimateErrors,
} from "@/lib/estimate";
import { SectionHeading } from "@/components/ui/primitives";
import { useRequest } from "@/components/ui/request-context";

export function Estimate({
  content,
  contacts,
}: {
  content: EstimateContent;
  contacts: ReactNode;
}) {
  const { category, selectCategory } = useRequest();
  const [values, setValues] = useState<EstimateValues>({
    model: "",
    condition: "",
    year: "",
    power: "",
    engineVolume: "",
    city: "",
    name: "",
    contact: "",
    registration: "",
    comment: "",
  });
  const [errors, setErrors] = useState<EstimateErrors>({});
  const [pending, setPending] = useState(false);
  const [submission, setSubmission] = useState<"success" | "failed" | null>(
    null,
  );
  const form = useRef<HTMLFormElement>(null);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const request = { ...values, vehicleType: category ?? undefined };
    const next = validateEstimate(request, content);
    setErrors(next);
    setSubmission(null);
    if (Object.keys(next).length) {
      const first = content.fields.find(
        (field) => field.name === Object.keys(next)[0],
      );
      if (first?.secondary) {
        const details = form.current?.querySelector("details");
        if (details) details.open = true;
      }
      form.current
        ?.querySelector<HTMLInputElement>(
          '[name="' + Object.keys(next)[0] + '"]',
        )
        ?.focus();
      return;
    }
    setPending(true);
    try {
      const result = await submitEstimate(request);
      setSubmission(result.status);
      if (result.status === "success") {
        setValues({
          model: "",
          condition: "",
          year: "",
          power: "",
          engineVolume: "",
          city: "",
          name: "",
          contact: "",
          registration: "",
          comment: "",
        });
        selectCategory(null);
      }
    } finally {
      setPending(false);
    }
  }
  function renderField(field: EstimateField) {
    const common = {
      id: "estimate-" + field.name,
      name: field.name,
      placeholder: field.placeholder,
      maxLength: field.maxLength,
      value: values[field.name],
      required: field.required,
      "aria-invalid": !!errors[field.name],
      "aria-describedby": errors[field.name]
        ? "error-" + field.name
        : undefined,
      onChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        setValues({ ...values, [field.name]: event.target.value });
        setErrors({ ...errors, [field.name]: undefined });
        setSubmission(null);
      },
    };
    return (
      <div
        className={
          "form-field " +
          (field.multiline || field.name === "model" ? "form-field--wide" : "")
        }
        key={field.name}
      >
        <label htmlFor={common.id}>
          {field.label}
          {!field.required && <span> — {content.optionalLabel}</span>}
        </label>
        {field.multiline ? (
          <textarea {...common} rows={3} />
        ) : (
          <input
            {...common}
            type="text"
            autoComplete={field.autoComplete ?? "off"}
            autoCapitalize={field.name === "contact" ? "none" : undefined}
            spellCheck={field.name === "contact" ? false : undefined}
          />
        )}
        {errors[field.name] && (
          <p className="field-error" id={"error-" + field.name}>
            {errors[field.name]}
          </p>
        )}
      </div>
    );
  }
  return (
    <section className="section estimate" id="estimate" tabIndex={-1}>
      <div className="container estimate-grid">
        <div className="estimate-intro">
          <SectionHeading content={content} />
          <ol className="estimate-steps">
            {content.steps.map((step, i) => (
              <li key={step}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {step}
              </li>
            ))}
          </ol>
          <p className="estimate-note">{content.note}</p>
        </div>
        <form
          ref={form}
          onSubmit={submit}
          noValidate
          className="estimate-form"
          aria-busy={pending}
          name={estimateFormName}
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
        >
          <input type="hidden" name="form-name" value={estimateFormName} />
          <p className="form-honeypot" aria-hidden="true">
            <label>
              Не заполняйте это поле
              <input name="bot-field" tabIndex={-1} autoComplete="off" />
            </label>
          </p>
          <input type="hidden" name="vehicleType" value={category ?? ""} />
          {category && (
            <div className="request-category">
              <p>
                <span>{content.categoryLabel}: </span>
                {category}
              </p>
              <button
                type="button"
                aria-label={content.clearCategory}
                onClick={() => {
                  selectCategory(null);
                  setSubmission(null);
                }}
              >
                <X size={17} aria-hidden="true" />
              </button>
            </div>
          )}
          <div className="form-grid">
            {content.fields
              .filter((field) => !field.secondary)
              .map(renderField)}
          </div>
          <details className="form-extra">
            <summary>
              {content.extraFieldsLabel}
              <ChevronDown size={18} aria-hidden="true" />
            </summary>
            <div className="form-grid">
              {content.fields
                .filter((field) => field.secondary)
                .map(renderField)}
            </div>
          </details>
          <div className="form-availability">
            <Info size={17} aria-hidden="true" />
            <p>{content.unavailable}</p>
          </div>
          <button
            type="submit"
            className="button button--primary form-submit"
            disabled={pending}
          >
            {pending ? content.pending : content.cta}
            <Send size={19} aria-hidden="true" />
          </button>
          <p className="form-privacy">{content.privacy}</p>
          <div className="form-status" role="status" aria-live="polite">
            {submission === "success" && <p>{content.submitted}</p>}
            {submission === "failed" && <p>{content.failed}</p>}
          </div>
        </form>
        <div className="estimate-contacts" id="contacts">
          {contacts}
        </div>
      </div>
    </section>
  );
}
