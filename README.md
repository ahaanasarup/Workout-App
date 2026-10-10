# Workout Tracker

A single-page workout tracker for a three-day A/B/C rotation. It logs sets, reps, weight and cardio time, keeps a history, and exports it to CSV.

Everything is in `Workout Tracker.html` (`index.html` just redirects to it). Workout data is stored in the browser's `localStorage` on the device, and nothing is sent anywhere.

## Installing on an iPhone

iOS won't run the page properly if you open the HTML file straight from the Files app: it shows a preview, not a working web page. Serve it over HTTPS and add it to your Home Screen instead:

1. Turn on GitHub Pages for this repo (Settings → Pages → Deploy from branch → pick `iPhone-Deployment`, `/ (root)`).
2. On the iPhone, open the Pages URL in **Safari**.
3. Tap **Share → Add to Home Screen**.

It then opens full-screen with its own icon, like a native app. Home Screen web apps keep their own storage, separate from Safari's.

## Backups

Your data lives on that one phone. Use **Export CSV** now and then, which opens the iOS share sheet so you can save the file to Files or iCloud. Your data is lost if you delete the Home Screen app.

## Syncing to a Google Sheet

The app can add every finished workout to a Google Sheet. A small Google Apps Script attached to your sheet receives each workout and adds it as rows, one row per set. Setup takes about five minutes and only has to be done once.

1. Create a new Google Sheet (any name).
2. In the sheet, open **Extensions → Apps Script**. Delete what's there and paste in everything from [`google-apps-script/Code.gs`](google-apps-script/Code.gs). Click **Save**.
3. Click **Deploy → New deployment**. Click the gear next to "Select type" and pick **Web app**.
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**, then **Authorize access**. Google will warn that the app isn't verified, because you wrote it yourself. Click **Advanced → Go to (project name)** and then **Allow**.
5. Copy the **Web app URL**. It starts with `https://script.google.com/` and ends with `/exec`.
6. In Workout Tracker on your phone, tap **Google Sheet Sync** and paste the URL. It offers to send your past workouts too.

After that, every time you tap **Finish Workout**, the workout is sent to a **Workouts** tab in the sheet. If you have no signal, it waits on the phone and syncs the next time you open the app with a connection. The line under the sync button shows what's waiting and when the last sync happened.

Keep the web app URL private. Anyone who has it can add rows to that sheet, though they can't read it. The URL is stored only on your phone and is never part of this repository.

If you edit `Code.gs` later, use **Deploy → Manage deployments → Edit → Version: New version** so the URL stays the same.

## Customising workouts

Edit the `WORKOUTS` object near the top of the `<script>` in `Workout Tracker.html`.
