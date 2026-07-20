import { event } from "./event";

export type RsvpPayload = {
  name: string;
  attending: "yes" | "no";
  partySize: number;
  message: string;
};

export type SheetRow = {
  timestamp: string;
  name: string;
  attending: string;
  partySize: string;
  message: string;
};

/** Accept bare form id or a full /forms/d/e/.../viewform URL. */
function resolveFormId(formIdOrUrl: string): string {
  const match = formIdOrUrl.match(/\/forms\/d\/e\/([^/]+)/);
  return match?.[1] ?? formIdOrUrl.trim();
}

/** POST RSVP fields into the Google Form response endpoint (no backend). */
export async function submitRsvp(payload: RsvpPayload): Promise<void> {
  const { formId, entries } = event.google;
  const id = resolveFormId(formId);
  const body = new FormData();

  body.append(entries.name, payload.name);
  body.append(entries.attending, payload.attending);
  // Party size is only meaningful when attending; omit on "no"
  // (Google Form Party Size should not be required).
  if (payload.attending === "yes") {
    body.append(entries.partySize, String(payload.partySize));
  }
  if (payload.message) {
    body.append(entries.message, payload.message);
  }

  // no-cors: Google Forms does not send CORS headers; the request still lands.
  await fetch(`https://docs.google.com/forms/d/e/${id}/formResponse`, {
    method: "POST",
    mode: "no-cors",
    body,
  });
}

/** Fetch published sheet CSV and parse rows (column order matches the Form). */
export async function fetchResponses(): Promise<SheetRow[]> {
  const res = await fetch(event.google.sheetCsvUrl, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Sheet fetch failed: ${res.status}`);
  }

  const csv = await res.text();
  return parseSheetCsv(csv);
}

export function summarizeAttendance(rows: SheetRow[]) {
  const attending = rows.filter((r) => normalizeYes(r.attending));
  const guestTotal = attending.reduce((sum, r) => {
    const n = Number.parseInt(r.partySize, 10);
    return sum + (Number.isFinite(n) ? n : 0);
  }, 0);

  return {
    responseCount: rows.length,
    attendingCount: attending.length,
    guestTotal,
  };
}

function normalizeYes(value: string): boolean {
  const v = value.trim().toLowerCase();
  return v === "yes" || v === "y" || v === "true";
}

function parseSheetCsv(csv: string): SheetRow[] {
  const lines = csv
    .trim()
    .split(/\r?\n/)
    .filter((line) => line.length > 0);

  if (lines.length < 2) return [];

  // Skip header row. Expected order from Form:
  // Timestamp, Name, Attending, Party Size, Message
  return lines.slice(1).map((line) => {
    const cols = splitCsvLine(line);
    return {
      timestamp: cols[0] ?? "",
      name: cols[1] ?? "",
      attending: cols[2] ?? "",
      partySize: cols[3] ?? "",
      message: cols[4] ?? "",
    };
  });
}

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out;
}
