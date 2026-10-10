# Three Rounds

A single-page workout tracker for a three-day A/B/C rotation. It logs sets, reps, weight and cardio time, keeps a history, and exports it to CSV.

Everything is in `index.html`. Workout data is stored in the browser's `localStorage` on the device, and nothing is sent anywhere.

## Installing on an iPhone

iOS won't run the page properly if you open `index.html` straight from the Files app: it shows a preview, not a working web page. Serve it over HTTPS and add it to your Home Screen instead:

1. Turn on GitHub Pages for this repo (Settings → Pages → Deploy from branch → pick the branch, `/ (root)`).
2. On the iPhone, open the Pages URL in **Safari**.
3. Tap **Share → Add to Home Screen**.

It then opens full-screen with its own icon, like a native app. Home Screen web apps keep their own storage, separate from Safari's.

## Backups

Your data lives on that one phone. Use **Export CSV** now and then, which opens the iOS share sheet so you can save the file to Files or iCloud. Your data is lost if you delete the Home Screen app.

## Customising workouts

Edit the `WORKOUTS` object near the top of the `<script>` in `index.html`.
