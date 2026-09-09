const labels = {
  vehicleType: "Тип заявки",
  model: "Марка / модель",
  condition: "Состояние",
  year: "Год выпуска",
  power: "Мощность",
  engineVolume: "Объём двигателя",
  city: "Город доставки",
  name: "Имя",
  contact: "Телефон / Telegram",
  registration: "Таможня и утильсбор",
  comment: "Комментарий",
};

const visibleFields = [
  "vehicleType",
  "model",
  "condition",
  "year",
  "power",
  "engineVolume",
  "city",
  "name",
  "contact",
  "registration",
  "comment",
];

function decodeBody(event) {
  const body = event.isBase64Encoded
    ? Buffer.from(event.body || "", "base64").toString("utf8")
    : event.body || "";

  if (!body) return {};

  try {
    return JSON.parse(body);
  } catch {}

  const params = new URLSearchParams(body);
  const payload = params.get("payload");
  if (payload) {
    try {
      return { payload: JSON.parse(payload) };
    } catch {
      return { payload };
    }
  }

  return Object.fromEntries(params.entries());
}

function getSubmissionData(input) {
  const payload = input.payload || input;
  return (
    payload.data ||
    payload.form_data ||
    payload.formData ||
    payload.fields ||
    payload
  );
}

function normalizeValue(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(", ");
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value).trim();
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildMessage(data) {
  const lines = ["<b>Новая заявка с сайта Лонбург</b>"];

  for (const key of visibleFields) {
    const value = normalizeValue(data[key]);
    if (!value) continue;
    lines.push(`<b>${labels[key]}:</b> ${escapeHtml(value)}`);
  }

  return lines.join("\n");
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return {
      statusCode: 500,
      body: "Telegram environment variables are not configured",
    };
  }

  const parsed = decodeBody(event);
  const data = getSubmissionData(parsed);
  const text = buildMessage(data);

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    return {
      statusCode: 502,
      body: `Telegram request failed: ${error}`,
    };
  }

  return { statusCode: 200, body: "OK" };
};
