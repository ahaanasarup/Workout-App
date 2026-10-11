/**
 * @OnlyCurrentDoc
 * Limits this script's permission to the one spreadsheet it's attached to,
 * instead of every spreadsheet in your Google account.
 */

// Google Apps Script for Workout Tracker sync.
// Paste this into Extensions → Apps Script on your Google Sheet, run setupSyncKey once, then deploy
// it as a web app (Execute as: Me, Who has access: Anyone). See the README for step-by-step instructions.
//
// Only requests carrying the sync key are written. The key is kept in this script's properties,
// not in the code, so it never ends up in the repository.

const SHEET_NAME = 'Workouts';
const HEADERS = ['Session ID', 'Date', 'Day', 'Exercise ID', 'Exercise', 'Status', 'Set', 'Target Sets', 'Target Reps', 'Target Minutes',
                 'Weight (kg)', 'Reps', 'RPE', 'Minutes', 'Distance (m)'];

// Run this once from the Apps Script editor (select it in the toolbar and click Run).
// It creates a random key and prints it in the Execution log; paste that key into the app.
// Running it again replaces the key, and the old one stops working.
function setupSyncKey() {
  const key = Utilities.getUuid().replace(/-/g, '');
  PropertiesService.getScriptProperties().setProperty('SYNC_KEY', key);
  Logger.log('Your sync key: ' + key);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const body = JSON.parse(e.postData.contents);
    const expected = PropertiesService.getScriptProperties().getProperty('SYNC_KEY');
    if (!expected || body.key !== expected) return json({ ok: false, error: 'Unauthorized' });
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
