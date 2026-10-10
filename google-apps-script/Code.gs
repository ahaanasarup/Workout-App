// Google Apps Script for Workout Tracker sync.
// Paste this into Extensions → Apps Script on your Google Sheet, then deploy it as a web app
// (Execute as: Me, Who has access: Anyone). See the README for step-by-step instructions.

const SHEET_NAME = 'Workouts';
const HEADERS = ['Session ID', 'Date', 'Time', 'Day', 'Workout', 'Exercise', 'Type', 'Set', 'Weight (kg)', 'Reps', 'Minutes'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const body = JSON.parse(e.postData.contents);
    if (!body.sessionId || !Array.isArray(body.rows)) throw new Error('Bad payload');

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
    }

    // Retries from the app resend the same session; only write it once.
    const last = sheet.getLastRow();
    const ids = last > 1 ? sheet.getRange(2, 1, last - 1, 1).getValues().map(r => r[0]) : [];
    if (ids.indexOf(body.sessionId) === -1 && body.rows.length) {
      const rows = body.rows.map(r => [body.sessionId].concat(r).slice(0, HEADERS.length));
      sheet.getRange(last + 1, 1, rows.length, HEADERS.length).setValues(rows);
    }
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json({ ok: true, message: 'Workout Tracker sync is running.' });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
