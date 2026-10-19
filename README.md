# Workout Tracker

A single-page workout tracker for a three-day A/B/C rotation. It logs sets, reps, weight and cardio time, keeps a history, and exports it to CSV.

Everything is in `Workout Tracker.html` (`index.html` just redirects to it). Workout data is stored in the browser's `localStorage` on the device, and nothing is sent anywhere.

## Installing on an iPhone

iOS won't run the page properly if you open the HTML file straight from the Files app: it shows a preview, not a working web page. Serve it over HTTPS and add it to your Home Screen instead:

1. Turn on GitHub Pages for this repo (Settings → Pages → Deploy from branch → pick `iPhone-Deployment`, `/ (root)`).
2. On the iPhone, open the Pages URL in **Safari**.
3. Tap **Share → Add to Home Screen**.

It then opens full-screen with its own icon, like a native app. Home Screen web apps keep their own storage, separate from Safari's.

## Analysis

The **Analysis** button shows insights from the workouts logged so far: new bests, your biggest gain, exercises that have stalled, how often you train, and how hard (average RPE). It also shows strength progress for each exercise with a suggestion on when to add weight, cardio totals and pace, and the exercises you skip most. It's all worked out on the phone; nothing is sent anywhere.

Strength progress compares estimated one-rep max (weight × (1 + reps ÷ 30)), so both heavier weight and more reps count. The suggestion to add weight appears once every target set hits the target reps at RPE 8 or lower.

## Backups

Your data lives on that one phone. Use **Export CSV** now and then, which opens the iOS share sheet so you can save the file to Files or iCloud. Your data is lost if you delete the Home Screen app.

## Syncing to a Google Sheet

The app can add every finished workout to a Google Sheet. A small Google Apps Script attached to your sheet receives each workout and adds it as rows, one row per set. Setup takes about five minutes and only has to be done once.

1. Create a new Google Sheet (any name).
2. In the sheet, open **Extensions → Apps Script**. Delete what's there and paste in everything from [`google-apps-script/Code.gs`](google-apps-script/Code.gs). Click **Save**.
3. **Create your sync key:** in the toolbar's function menu, choose `setupSyncKey` and click **Run**. Approve the permissions when asked. Google will warn that the app isn't verified, because you wrote it yourself. Click **Advanced → Go to (project name)** and then **Allow**. The permission it asks for only covers this one spreadsheet (the script starts with `@OnlyCurrentDoc`). If it asks for access to *all* your spreadsheets, the first lines of the script didn't get pasted. The Execution log at the bottom then shows `Your sync key: …`. Copy that key.
4. Click **Deploy → New deployment**. Click the gear next to "Select type" and pick **Web app**.
   - **Execute as:** Me
   - **Who has access:** Anyone
5. Click **Deploy** and copy the **Web app URL**. It starts with `https://script.google.com/macros/s/` and ends with `/exec`. To find it again later, go to **Deploy → Manage deployments**. Don't use the "Test deployments" URL ending in `/dev`, because it only works while you're signed in to the editor.
6. In Workout Tracker on your phone, tap **Google Sheet Sync**. Paste the URL, then the sync key. It offers to send your past workouts too.

After that, every time you tap **Finish Workout**, the workout is sent to a **Workouts** tab in the sheet. If you have no signal, it waits on the phone and syncs the next time you open the app with a connection. The line under the sync button shows what's waiting and when the last sync happened.

### What gets recorded

Each finished workout adds one row per set for weight exercises, and one row for each cardio exercise, each skipped exercise, and each exercise checked off without numbers. The CSV export uses the same columns, minus Session ID.

| Column | Meaning |
| --- | --- |
| Session ID | Unique ID for the workout. The script uses it to avoid duplicates |
| Date | `YYYY-MM-DD` |
| Day | A, B or C |
| Exercise ID | Permanent ID (e.g. `a2`) that stays the same if an exercise is renamed |
| Exercise | Exercise name |
| Status | `Done`, or `Skipped` if nothing was logged and it wasn't checked off |
| Set | Set number (blank for cardio and skipped rows) |
| Target Sets / Target Reps / Target Minutes | The plan at the time of the workout |
| Weight (kg) / Reps | What you lifted |
| RPE | Effort, 1–10 (10 = nothing left) |
| Minutes / Distance (m) | Cardio |

### Who can write to the sheet

The web app has to allow "Anyone", because the phone app can't sign in to Google. Instead, the script rejects any request that doesn't include your sync key, so only your phone can add rows. Nobody can read the sheet through the web app either way. The key lives in the script's properties and on your phone, never in this repository. If you think it has leaked, run `setupSyncKey` again and enter the new key in the app. The old key stops working right away.

If you edit `Code.gs` later, use **Deploy → Manage deployments → Edit → Version: New version** so the URL stays the same.

## Customising workouts

Edit the `WORKOUTS` object near the top of the `<script>` in `Workout Tracker.html`.
