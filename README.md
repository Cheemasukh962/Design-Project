# VitaPal

A student nutrition journal and habit builder built with React Native, Expo 57, and Expo Router.

## Run

```sh
cd nutrilens
npm ci
npm run web
```

Open `/demo` for the journal, or choose **Try the new VitaPal demo** on the original welcome screen. `/` and `/home` open the original app.

## Journal experience

The design builds on `design-new/design/Main.dc.html` with warm paper, olive panels, an expressive peach companion, numbered journal sections, and Poppins / Sorts Mill Goudy typography.

- **Log a meal:** open a bottom sheet from the main progress panel, choose a meal type, write a note, and optionally tag food groups. Edit or delete entries from the journal. The food snapshot reflects those tags; it does not estimate calories, nutrient intake, or deficiencies.
- **Build habits:** log and undo daily rituals from Home or Routine. Add a custom habit tied to an everyday cue such as “after class.” Duplicate titles are blocked. Cues do not schedule notifications.
- **Choose a focus:** meal rhythm, food variety, or nutrient knowledge. The selected focus changes Home’s suggested action, which can be added to the routine.
- **Look back:** tap a date in the seven-day strip to see saved habits and meals. Weekly activity is computed from actual logs, with no prefilled completions or streak penalties. The companion’s expression changes when a habit is completed.
- **Learn and act:** search nutrient notes by nutrient or food, switch between food ideas and supplement basics, open linked NIH fact sheets, and add a food habit or a habit for preparing questions for a health visit.
- **Make it yours:** edit the greeting name, toggle the companion, and choose a daily check-in.

Journal state is stored on the device with AsyncStorage: meals, habits, completion history, focus, check-in, name, and companion preference survive refresh. Daily records use the device’s local date; a new day starts with no completions. Storage errors appear in the app, and unreadable existing data is preserved. No backend, account, or cross-device sync is included. This state is separate from the original app’s quiz, routine, and companion.

Nutrient notes are educational and link to NIH Office of Dietary Supplements consumer fact sheets for [vitamin D](https://ods.od.nih.gov/factsheets/VitaminD-Consumer/), [B12](https://ods.od.nih.gov/factsheets/VitaminB12-Consumer/), and [vitamin C](https://ods.od.nih.gov/factsheets/VitaminC-Consumer/). The app does not prescribe doses or infer supplement needs from meal tags or moods.

## Structure

```text
design/                  Original screenshots and HTML references
design-new/design/       Main, Editorial, and Brutalist references
nutrilens/
  app/                   Original Expo routes plus demo.tsx
  components/demo/       Journal Home, editors, weekly history, library, profile
  data/journal.ts        Persistent journal state, local dates, goals, food tags
  data/demo.ts           Starter habits, check-ins, sourced nutrient notes
  theme/demo.ts          Journal palette, fonts, spacing
  tools/verify-journal.mjs  Isolated browser regression checks
```

## Verification

```sh
cd nutrilens
npx tsc --noEmit
# With the web server running:
node tools/verify-journal.mjs
```

The browser regression checks cover meal creation/editing/deletion, food-tag summaries, habit logging and undo across tabs, custom habit cues, duplicate prevention, focus changes, resource-to-routine actions, search, persistence after reload, previous-day history, and preservation of unreadable saved data. Layouts and meal sheets are checked at 320px, 393px, and desktop widths, with runtime/console error collection. Native iOS and Android builds have not been tested.
