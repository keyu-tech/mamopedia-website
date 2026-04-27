# Mamopedia AI — Design System

**ماموپێدیا · ماموبیدیا · Mamopedia** — a friendly, **chat‑based** AI learning companion for Iraqi students. Powered by AI and a tailored curriculum, it offers personalized homework support, step‑by‑step problem‑solving, and adaptive quizzes — all in **Arabic, Kurdish, and English**.

## What this system is

Mamopedia is not a generic edtech product. It is:
- **Chat‑first, Claude‑style.** The entire product is a conversation with an AI tutor. There is no "dashboard" — there is an open chat, and everything else (quizzes, book uploads, homework photos, curriculum lookups) is surfaced inside or alongside it.
- **Multilingual by default.** Arabic, Sorani Kurdish, and English are peers. The student picks once; the product flips instantly — RTL, number shape, script.
- **Curriculum‑aligned.** Every answer is anchored to the **Iraqi Ministry of Education curriculum**. The tutor doesn't just help — it helps *for the student's grade, subject, and textbook chapter*.
- **Warm, patient, young‑but‑respectful.** Designed to feel like a thoughtful older sibling helping with homework, not a corporate product.

## The four pillars

The product is four features, shown equally on the marketing site and in the learner app's empty state:

| Pillar | What it is | How it shows up in UI |
|---|---|---|
| **AI Homework Help** | Step‑by‑step guidance across math, science, literature, and every other subject. | Chat messages grouped into numbered *Steps* (§ Step blocks). Photo‑upload entry point on the composer. |
| **Personalized Quizzes** | AI‑generated quizzes that adapt to each student's level and track progress. | Inline *Quiz cards* inside chat (§ Quiz card). Results feed a quiet progress ring on the profile. |
| **Multi‑Language Support** | Chat and learn in AR · KU · EN — switchable anytime. | Persistent language switch in the top bar. Each message can be replayed in another language ("Explain this in Kurdish"). |
| **Iraqi Curriculum** | Content aligned to the official Iraqi school curriculum — grade, subject, textbook. | *Curriculum pill* above answers (Grade 6 · Science · Chapter 4). Book‑based quiz generator accepts a chapter or the whole textbook. |

## The brand in one breath

The logo is three stylized book pages — **blue, coral, green** — leaning together. Those three colors represent the three audiences (**student, teacher, school**) and the three languages working in harmony. The mark reads as *books stacked side by side*, or *three students standing shoulder to shoulder*.

## Content fundamentals

### Voice
- **Patient, plainspoken, encouraging.** The tutor never mocks, never rushes.
- **Never talks down.** A 9‑year‑old solving a fraction problem deserves the same respect as a high‑schooler proving a geometry theorem.
- **Curious with them.** "Let's try this together" over "Here is the answer."
- **Quietly celebratory.** Getting something right feels good, but we don't throw confetti at every step.
- **Shows its work.** When the student asks for help, the AI always shows the *steps*, not just the final answer — the product is about learning, not answer‑lookup.

### Tone by surface
| Surface | Tone |
|---|---|
| Empty chat / onboarding | "Welcome. What are we working on today?" |
| Step‑by‑step homework | "Step 1 — Let's read the question carefully. …" Short, numbered, one idea per step. |
| Correct quiz answers | Warm acknowledgement, not hype. "That's right. Here's why it works." |
| Wrong quiz answers | Never "wrong." "Close — look at this step again." |
| Errors (network, etc.) | Blame‑free, calm. "The connection dropped. Let's try again." |
| Marketing | Confident, proud, locally rooted. |

### Casing, punctuation, language
- **Sentence case** for all UI (buttons, headings, tabs).
- **Three‑language parity.** If a string exists in English, the Arabic and Kurdish versions must exist too, with equivalent warmth.
- **Numbers.** Arabic‑Indic digits (٠١٢٣٤٥٦٧٨٩) in AR/KU surfaces; Latin digits in EN. Math expressions keep Latin digits in all languages (curriculum convention).
- **No emoji in UI chrome.** Emoji are OK inside student‑to‑AI chat (the student may use them); the AI does not emit emoji.
- **No slang.** The AI does not say "cool" or "awesome." "Good" and "well done" are the ceiling.

### Person
- **You** for the student (formal‑warm — أنت, تۆ). **We** for collaborative moments ("Let's solve this").
- The AI does not have a first‑person identity — no "I think," no "As an AI." It presents material and asks questions.

## Chat‑based interaction patterns

The app is a single conversation thread, like Claude. Around that thread, three recurring patterns appear:

### 1. Step blocks (homework help)
When the student asks for help with a problem, the AI responds with a **numbered step stack** inside one assistant bubble (or across a few). Each step is:
- A short header (`Step 1 · Read the question`)
- One sentence of explanation
- Optionally, a math line, a diagram, or a small "Try this" pushback ("What do you think the next step is?")

Steps are visually separated by a hairline divider inside the bubble. Never more than ~5 steps per reply — after that, ask the student to try one before continuing.

### 2. Inline quiz card (personalized quizzes)
A quiz is not a separate screen — it arrives as a **card inside the chat**. One question at a time, multiple‑choice or short‑answer. The student taps an answer, the card flips to feedback, and the chat continues. Quiz state is remembered: "Last week's fractions quiz — 8 of 10."

### 3. Curriculum pill + source chip
Above any answer that's curriculum‑anchored, show a small pill: **"Grade 6 · Science · Chapter 4 — Photosynthesis."** Below, an optional **source chip** links back to the textbook page or uploaded file (§ Book upload). This is the trust signal that separates Mamopedia from a generic chatbot.

### Composer
Bottom‑fixed, ~64px tall. Three affordances: **+ (attach homework photo or book)**, **text input**, **mic (voice)**. Language switch lives in the top bar, not the composer — the composer stays minimal.

## Visual foundations

### Palette
Three signature colors, sampled from the official logo:

| Role | Token | Hex | Use |
|---|---|---|---|
| **Primary Green** | `--green-500` | `#7EA377` | **Default CTAs, links, focus rings, active states.** Growth, correctness, the Mamopedia voice. |
| Coral | `--coral-500` | `#F88672` | Warmth, student bubbles, streaks, encouragement |
| Blue | `--blue-600` | `#4179BE` | Secondary / informational accent, curriculum pills, schools audience |

Each has a full scale (050–800) in `colors_and_type.css`. Ink tones (`--ink`, `--ink-2`, `--ink-3`) are all AA+ against `--paper` (`#FAFAF7`).

**Usage discipline.** Pick one primary per surface. **Green is the product's primary color** — CTAs, navigation highlights, focus rings default to green. Coral is for warmth (student bubbles, streaks); blue is for curriculum/trust signals and secondary accent. Never split a screen evenly across all three — that's the logo's job.

**In chat specifically.** Student bubbles = coral (warm, personal). AI bubbles = paper/white with a thin border (neutral, quiet authority). CTAs (Send, Generate quiz, Continue) = green. Correct quiz answer = green. Curriculum pill = blue. Never-"wrong" retry = coral (soft), never red.

### Typography
- **Latin UI** — *Plus Jakarta Sans* (friendly humanist geometric; close match to the real "Mamopedia" English wordmark). 400/500/600/700/800.
- **Arabic & Kurdish UI** — *Noto Kufi Arabic.* Handles Sorani Kurdish letters (ڕ, ڤ, ۆ, ێ, ڵ, ی).
- **Arabic reading passages** — *Noto Naskh Arabic* for long‑form reading content (comprehension passages, story text).
- **Mono / math** — *JetBrains Mono* for code and math expressions. KaTeX or MathJax for block equations.

`:lang(ar)` and `:lang(ckb)` CSS selectors switch stacks automatically.

### RTL rules
- Use **logical properties** (`margin-inline-start`, `padding-inline-end`, `border-inline-start`) everywhere.
- Icons that imply direction (back, next, chevrons, **send**) flip in RTL. Logos and marks do not flip.
- Numerals in math and code do not flip.
- Chat bubbles: student bubble hugs the student's reading edge (right in LTR, left in RTL); AI bubble hugs the opposite.

### Spacing, radii, shadows
- **Grid** — 4px base. Scale: 4, 8, 12, 16, 24, 32, 48, 64.
- **Radii** — 10px buttons, 16px cards + chat bubbles, 24px sheets. Pills for tags and avatars.
- **Shadows** — two levels, cool‑tinted.

### Motion
Gentle ease‑out, 150/220/320ms. **Chat-specific:** new messages fade‑and‑rise 6px over 220ms. The AI response has a **1s typing indicator** (three dots pulsing in sequence) before the message streams in one phrase at a time (like Claude). Quiz card feedback flip = 320ms.

## Iconography

- **Lucide** (stroke 1.75px, rounded joins). Stands in for a proprietary set.
- Icons inherit `currentColor`. Default `--ink-2`; active/brand contexts use `--primary`.
- **Chat-specific icons:** `send` (arrow, flips in RTL), `paperclip` (attach homework photo), `book-open` (attach textbook), `mic` (voice), `camera` (homework photo), `languages` (switch language), `sparkles` (generate quiz).
- **No filled/colored icons in UI chrome** — color in the icon is always a signal, never decoration.

## Logos

All official combination marks and wordmarks in AR / KU / EN are available in `assets/`. The **mark alone** (`mark.png`) is the AI's chat avatar — shown next to every assistant message.

| File | Use |
|---|---|
| `logo-horizontal-en.png` · `-ar.png` · `-ku.png` | Top nav / marketing — full color, per language |
| `logo-vertical-*.png` | Splash screens, print |
| `mark.png` | AI chat avatar, favicons, app icon |
| `mark-black.png` / `mark-white.png` | Mono on light / dark |
| `wordmark-*.png` | Wordmark without mark |

**Minimum size.** Horizontal lockups: 24px tall. Mark alone: 16px. Clear space = one book‑page width.

---

## File index

| Path | Purpose |
|---|---|
| `README.md` | This file. |
| `SKILL.md` | Agent Skill entrypoint. |
| `colors_and_type.css` | Design tokens + semantic element defaults. |
| `assets/` | Official logos (EN · AR · KU; horizontal, vertical, mark, mono). |
| `preview/` | Design‑system cards: logo, colors, type, chat, step block, quiz card, curriculum pill, book upload. |
| `ui_kits/learner-app/` | Mobile learner app: chat, quiz, book upload. |
| `uploads/` | Original source material. |

## Caveats

- **Font substitution flagged.** Plus Jakarta Sans + Noto Kufi Arabic are close matches for the real logo's wordmark, loaded from Google Fonts. Swap for licensed brand faces.
- **Icon substitution flagged.** Lucide stands in — replace with a proprietary set if one exists.
- **Curriculum structure is a plausible placeholder.** Grade / subject / chapter strings should be replaced by a real content team against Iraqi MOE data.
- **UI kit screens are inferred** from the four pillars. Review every screen against real product decisions.
