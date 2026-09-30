/**
 * Google Apps Script — paste into your Sheet (Extensions → Apps Script).
 *
 * Setup (once):
 * 1. Create a Google Sheet, name it e.g. "Γάμος Βασίλης & Ιωάννα — RSVP"
 * 2. Create two tabs named exactly: RSVP  and  Wishes
 * 3. Extensions → Apps Script → delete any stub code → paste THIS file
 * 4. Set SHARED_SECRET below to the same value as wedding.forms.secret
 * 5. Deploy → New deployment → Type: Web app
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 6. Authorize → copy the Web app URL
 * 7. Put that URL in src/content/wedding.ts → forms.endpoint
 * 8. Share the Sheet with your cousin (Editor or Viewer)
 *
 * After any script edit: Deploy → Manage deployments → Edit (pencil) → New version → Deploy
 */

const SHARED_SECRET = "REPLACE_WITH_SAME_SECRET_AS_WEDDING_TS";
const RSVP_SHEET = "RSVP";
const WISHES_SHEET = "Wishes";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || "{}");

    if (!data.secret || data.secret !== SHARED_SECRET) {
      return json_({ ok: false, error: "unauthorized" }, 401);
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const type = String(data.type || "");

    if (type === "rsvp") {
      const sheet = ensureSheet_(ss, RSVP_SHEET, [
        "Timestamp",
        "Name",
        "Phone",
        "Attendance",
        "Guests",
        "Children",
        "Notes",
      ]);
      sheet.appendRow([
        new Date(),
        data.name || "",
        data.phone || "",
        data.attendance || "",
        data.guests || "",
        data.children || "",
        data.notes || "",
      ]);
      return json_({ ok: true, type: "rsvp" });
    }

    if (type === "wish") {
      const sheet = ensureSheet_(ss, WISHES_SHEET, [
        "Timestamp",
        "Name",
        "Wish",
      ]);
      sheet.appendRow([new Date(), data.name || "", data.wish || ""]);
      return json_({ ok: true, type: "wish" });
    }

    return json_({ ok: false, error: "unknown_type" }, 400);
  } catch (err) {
    return json_({ ok: false, error: String(err) }, 500);
  }
}

/** Optional: open the web app URL in a browser to confirm it’s live */
function doGet() {
  return json_({ ok: true, service: "wedding-forms" });
}

function ensureSheet_(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  }
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
