# 🌙 Night Sky Study Planner

A simple, personal study planner for tracking daily study goals — wrapped in a calm blue-and-black night sky theme with twinkling stars.

## What it is for

This is a lightweight tool for planning and tracking what you want to study each day. Every day you write down your goals by hand, tick them off as you finish them, and see at a glance how consistent you've been over the past week.

It's built for one person (me), runs entirely in the browser, and needs no account, no server, and no installation.

## How it works

1. **Open `index.html`** in any modern browser (or visit the GitHub Pages link if enabled).
2. **Add your goals for the day** — type a goal, optionally add how many minutes you plan to spend on it, and press **Add**.
3. **Check goals off** as you complete them. The progress bar shows how many goals (and minutes) you've finished.
4. **Write notes** about the day — what you learned, what was hard, what to revisit.
5. **Move between days** with the ‹ › arrows or the date picker to review past days or plan ahead. "Jump to today" brings you back.
6. **Review the last 7 days** in the history row:
   - dim dot — no goals or none completed
   - blue dot — some goals completed
   - glowing dot — every goal completed
7. **Streak** counts the consecutive days where you completed every goal.

### Where is my data stored?

Everything is saved automatically in your browser's `localStorage`. Nothing is uploaded anywhere. This means:

- Your data stays private on your device.
- It's tied to that browser — clearing site data or switching browsers/devices will start you fresh.

### Files

| File         | Purpose                                         |
|--------------|-------------------------------------------------|
| `index.html` | Page structure                                  |
| `style.css`  | Night sky theme and layout                      |
| `app.js`     | Goal tracking logic, storage, and star animation |

## What problems it solves

- **Vague study days** — writing goals each morning turns "I should study" into concrete, checkable tasks.
- **No sense of progress** — the progress bar and minute totals show exactly how much of the plan got done.
- **Inconsistency** — the 7-day history and streak counter make gaps visible and reward showing up every day.
- **Overcomplicated tools** — no sign-ups, sync, ads, or feature bloat. Just goals, checkboxes, and notes.
- **Forgetting what you studied** — daily notes and past days let you look back at what you actually covered.
- **Boring interfaces** — a calm night-sky look makes it a nicer place to sit down and plan.

## Running locally

No build step needed:

```bash
git clone https://github.com/Aditya-7826/Study-planner.git
cd Study-planner
# then open index.html in your browser
```
