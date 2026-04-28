---
name: mamopedia-design
description: Use this skill to generate well-branded interfaces and assets for Mamopedia AI — a friendly, chat-based, Claude-style AI learning companion for Iraqi K-12 students. Supports Arabic, Kurdish, and English (RTL first-class). Covers AI homework help, AI-generated quizzes, and Iraqi MOE curriculum alignment.
user-invocable: true
---

Read `README.md` first.

Mamopedia AI is a **chat-first product, like Claude**, for Iraqi students. Four feature pillars:
1. **AI Homework Help** — step-by-step guidance across every subject
2. **Personalized Quizzes** — AI-generated, adaptive, progress-tracked
3. **Multi-Language Support** — Arabic, Kurdish, English, switchable anytime
4. **Iraqi Curriculum** — every answer anchored to the official MOE curriculum

Recurring chat patterns (see README for details):
- **Step blocks** — numbered, one idea per step, inside an AI bubble. Max ~5 per reply.
- **Inline quiz cards** — quiz questions arrive as cards *inside the chat*, not on a separate screen.
- **Curriculum pill** — `Grade 6 · Science · Ch 4` above any answer. Trust signal.
- **Source chip** — links back to textbook page or uploaded book/photo.
- **Language switch** — persistent in the top bar; also an inline "explain this in Kurdish" chip under any answer.

Core files:
- `README.md` — brand + content fundamentals + chat/quiz interaction patterns
- `colors_and_type.css` — tokens; `:lang(ar)` / `:lang(ckb)` auto-switches Arabic font stack
- `assets/` — official logos (EN · AR · KU horizontal/vertical/mark, mono variants)
- `preview/` — 25+ design-system cards (see Design System tab)
- `ui_kits/learner-app/` — mobile chat-first UI kit

Design rules:
- **One primary color per surface.** Student-facing = coral accent + blue primary. Teacher = green. Never split a screen across all three brand colors.
- **Use logical CSS properties** (margin-inline-start, etc.) so RTL just works.
- **Chat colors:** student bubble = coral; AI bubble = white/paper with border; correct = green; retry = coral (never red).
- **No emoji** in AI-authored UI. Students may use emoji in their own messages.
- **Numbers:** Arabic-Indic digits in AR/KU UI copy; Latin digits in math & code (curriculum convention).

If invoked without guidance, ask what to build (chat screen, quiz flow, marketing page, teacher dashboard, etc.), confirm language, then produce HTML artifacts or production code.
