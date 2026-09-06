// Isolated browser regression check; never reads or changes a user's browser profile.
// Run with the web server up: node tools/verify-journal.mjs [http://localhost:8081/demo]
import assert from "node:assert/strict";
import puppeteer from "puppeteer";
const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
const url = process.argv[2] || "http://localhost:8081/demo";
const key = "vitapal-journal-v1";
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
const contains = (text) =>
  page.waitForFunction(
    (text) => document.body.innerText.includes(text),
    {},
    text,
  );
const saved = (predicate) =>
  page.waitForFunction(
    `(${predicate})(JSON.parse(localStorage.getItem('${key}')))`,
  );
async function click(name, role = "button") {
  await page
    .locator(
      `::-p-xpath(//*[@role="${role}" and (contains(@aria-label,"${name}") or contains(.,"${name}")) and not(@aria-disabled="true")])`,
    )
    .click();
}
async function fill(label, value) {
  await page.locator(`input[aria-label="${label}"]`).fill(value);
}

try {
  await page.setViewport({ width: 393, height: 852 });
  await page.goto(url, { waitUntil: "networkidle0" });
  await contains("A well-fed you.");
  await saved("j => j && j.tasks.length === 3");
  await click("Log a meal");
  assert.equal(
    await page.$eval('[role="button"][aria-disabled="true"]', (e) =>
      e.textContent.includes("Save meal"),
    ),
    true,
  );
  await fill("Meal description", "Tofu rice bowl");
  await click("Fruit & veg");
  await click("Protein foods");
  await click("Grains");
  await click("Save meal");
  await contains("3 food groups tagged");
  await saved("j => Object.values(j.days).some(d => d.meals.length === 1)");
  await click("Edit Lunch: Tofu rice bowl");
  await fill("Meal description", "Tofu and broccoli rice bowl");
  await click("Dinner");
  await click("Save changes");
  await saved(
    'j => Object.values(j.days).some(d => d.meals[0]?.type === "Dinner")',
  );
  await click("Make time for breakfast", "checkbox");
  await click("Routine", "tab");
  await page.waitForSelector(
    '[role="checkbox"][aria-label="Make time for breakfast"][aria-checked="true"]',
  );
  await click("Make time for breakfast", "checkbox");
  await saved("j => Object.values(j.days).every(d => d.done.length === 0)");
  await click("Build a new habit");
  await fill("Habit name", "Pack a campus snack");
  await click("After class");
  await click("Add to my routine");
  await saved(
    'j => j.tasks.some(t => t.title === "Pack a campus snack" && t.detail === "After class")',
  );
  await click("Build a new habit");
  await fill("Habit name", "Pack a campus snack");
  await contains("That habit is already");
  await click("Cancel");
  await click("Home", "tab");
  await click("Change");
  await click("Add more variety", "radio");
  await click("Set my focus");
  await contains("Try this: try a different fruit or vegetable");
  await click("Try this:");
  await saved('j => j.focus === "variety" && j.tasks.length === 5');
  await click("Discover", "tab");
  await fill("Search nutrients", "broccoli");
  await click("Learn about Vitamin C");
  await click("Make this a habit");
  await contains("Added to your routine");
  await click("Supplement basics");
  await contains("High-dose supplements");
  await click("Save a questions habit");
  await saved(
    'j => j.tasks.some(t => t.title === "Prepare questions about Vitamin C")',
  );
  await click("Back");
  await fill("Search nutrients", "nothing-matches");
  await contains("No match yet");
  await click("Profile", "tab");
  await fill("Your name", "Sam");
  await saved('j => j.name === "Sam"');
  await page.reload({ waitUntil: "networkidle0" });
  await contains("Let’s make room for you, Sam.");
  await contains("Tofu and broccoli rice bowl");
  await contains("Add more variety");
  await click("Edit Dinner: Tofu and broccoli rice bowl");
  await click("Delete this entry");
  await saved("j => Object.values(j.days).every(d => d.meals.length === 0)");
  await contains("Dining hall, desk lunch");
  console.log(
    "PASS: meal create/edit/delete, tag summary, habit log/undo, custom cue, duplicate prevention, focus, resource actions, search, and reload persistence",
  );

  // Yesterday's records survive a new day without being counted as today's activity.
  const yesterday = await page.evaluate((key) => {
    const j = JSON.parse(localStorage.getItem(key));
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const yesterday = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    j.days = {
      [yesterday]: {
        done: ["breakfast"],
        meals: [
          {
            id: "past-meal",
            title: "Yesterday’s breakfast",
            type: "Breakfast",
            groups: ["Grains"],
          },
        ],
        mood: null,
      },
    };
    localStorage.setItem(key, JSON.stringify(j));
    return yesterday;
  }, key);
  await page.reload({ waitUntil: "networkidle0" });
  await contains("Your first little win is waiting.");
  await click(yesterday);
  await contains("Yesterday’s breakfast");
  await contains("1 little win");
  await click("Back to today");
  await page.waitForSelector(
    '[role="checkbox"][aria-label="Make time for breakfast"][aria-checked="false"]',
  );
  console.log("PASS: previous-day history stays separate from today");

  for (const width of [320, 393, 1440]) {
    await page.setViewport({ width, height: width === 320 ? 640 : 900 });
    await click("Home", "tab");
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
      `overflow at ${width}`,
    );
    await click("Log a meal");
    await fill("Meal description", "Viewport check");
    await page.screenshot({ path: `/tmp/vitapal-meal-${width}.png` });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
    );
    await click("Cancel");
  }
  await page.setViewport({ width: 393, height: 852 });
  await click("Home", "tab");
  await page.screenshot({ path: "/tmp/vitapal-home-final.png" });
  console.log("PASS: desktop and 393px/320px layouts and meal sheets");
  assert.deepEqual(errors, [], "Unexpected browser errors");

  await page.evaluate((key) => localStorage.setItem(key, "{invalid"), key);
  await page.reload({ waitUntil: "networkidle0" });
  await contains("Your saved journal couldn’t load");
  await click("Make time for breakfast", "checkbox");
  assert.equal(
    await page.evaluate((key) => localStorage.getItem(key), key),
    "{invalid",
  );
  console.log("PASS: unreadable saved data is preserved and visibly reported");
  console.log("All journal checks passed.");
} finally {
  await browser.close();
}
