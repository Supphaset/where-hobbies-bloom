Below is a single-user Product Requirements Document (PRD) for your adaptive IELTS Academic + HSK learning web-app. Use it as the authoritative spec while you design, code, and test.

1. Product Overview
ItemDetail
Name (working)SoloLingua Coach
PurposeContinuously diagnose your English (IELTS Academic) and Mandarin (HSK) skills, deliver AI-driven practice, and declare “Exam-Ready” status when targets are repeatedly met.
Primary userYou (single learner, data-scientist developer)
Launch scopeResponsive web app (desktop ≈ mobile). No multi-user, no public login.
Success definition• Two consecutive mock-exam scores ≥ target (e.g., IELTS 7.0 overall & HSK4 ≥ 180) with < 0.25 variance.
• Weekly study time ≥ planned budget.
• Self-reported perception: “AI feedback feels as helpful as a human tutor.”

2. Problem Statement
Self-studying for high-stakes language exams is inefficient: static books don’t pinpoint weaknesses, human tutors are costly, and generic apps lack deep exam realism. You need a private, always-on coach that grades like an examiner, adapts to your gaps, and objectively signals readiness.

3. Key Goals & Non-Goals
GoalsNon-Goals
1. Deliver realistic mock tests for IELTS Academic & HSK (1-6).Multi-user account management, payments, social features.
2. Provide instant AI scoring & feedback for writing / speaking.Pronunciation phoneme grading beyond Whisper heuristics (v1).
3. Maintain adaptive study plan that prioritises weakest micro-skills.Authoring tools for teachers or crowdsourced content.
4. Track progress with clear analytics and “Exam-Ready” gating.Native apps—web-only for MVP.

4. Key Metrics (KPIs)
MetricTarget
Mean time to feedback (essay)≤ 15 s (GPT-4 call)
Listening/Reading scoring latency≤ 1 s per 40 Qs
Weekly active study minutes≥ X (user-defined, default 120)
AI score vs human benchmark*±0.5 band (IELTS) / ±15 pts (HSK)

*Benchmarked on a small set of manually graded samples.

5. User Stories
Diagnostic – “As a learner I want to sit a full mock so I know my baseline.”

Review – “After finishing, I want to see every mistake with a short explanation so I can learn immediately.”

Targeted drill – “When writing is weak, suggest grammar/vocab drills before my next essay.”

Speaking practice – “I speak, get a transcript, and instant feedback on fluency and vocabulary.”

Readiness badge – “I’m told when two full mocks hit my goal so I can book the real exam.”

Progress insight – “I can visualise my vocabulary growth and skill trends.”

6. Functional Requirements
IDRequirement
F-1System shall deliver IELTS & HSK mock tests with timer, audio playback, and question navigation mirroring real exams.
F-2System shall auto-score objective items immediately upon submission.
F-3System shall call GPT-4o to grade writing (band + four criteria) and produce structured JSON feedback.
F-4System shall record microphone input, transcribe with Whisper, and request GPT-4o feedback on Fluency, Lexical, Grammar.
F-5System shall persist all attempts, scores, and AI feedback in a local database.
F-6After each activity, system shall update a Skill Profile table and regenerate next-step recommendations.
F-7Dashboard shall display: today’s recommended tasks, latest scores, radar of skills, and study-time streak.
F-8User can launch drills: Vocabulary SRS, Grammar quiz, Listening clip, Quick Speak, Quick Write.
F-9Adaptive engine shall surface weakest sub-skills using rule: lowest mastery gap = (target − current).
F-10System shall declare “Exam Ready” only when last 2 full mocks ≥ targets and stdev < 0.25 band (IELTS) or 15 pts (HSK).

7. Non-Functional Requirements
CategoryRequirement
PerformancePage loads < 2 s, API p95 latency < 300 ms (excluding external AI calls).
ReliabilityAutosave answers every 10 s; zero data loss on refresh/crash.
SecurityAPI key stored server-side; HTTPS if deployed; optional basic auth.
ScalabilityCode paths accept user_id param even if only “1”.
Cost guardrailsLog GPT token usage; allow model-switch (gpt-3.5 vs 4o) per feature.
AccessibilityKeyboard-navigable, color-contrast AA, captions on audio/video.

8. Technical Architecture (v1)
React SPA  ─┐
            │REST/JSON
FastAPI ─── SQLAlchemy → SQLite
            │
            ├─ OpenAI GPT-4o  (essay & speaking scoring, explanations, study-plan)
            └─ Whisper (API or local tiny) → transcript
Frontend: React + MUI, react-router, react-mic, Chart.js.

Backend: FastAPI (async) + Uvicorn; Pydantic schemas; Celery optional for long AI tasks.

Data: users, tests, questions, answers, skill_profile, study_plan, vocab_progress.

Content: local JSON/CSV for HSK lists & IELTS question sets.

9. Milestones (condensed)
WeekDeliverable
1-2Repo setup, DB schema, dummy React pages.
3-4Reading/Listening engine + auto-scoring.
5-6GPT-4o essay scoring & feedback page.
7-8Whisper recording + speaking feedback.
9-10Adaptive engine prototype, skill profile updates.
11Dashboard v1 with charts & recommendations.
12“Exam Ready” gating logic, full regression test.
13+Polish UI, add drills, refine prompts, optional deployment.

10. Open Issues & Risks
#Issue / RiskMitigation
1GPT scoring inconsistencyCalibrate with sample essays; store prompt templates centrally for easy tweak.
2Whisper accuracy on noisy micGuide user on recording environment; allow manual transcript edit before grading.
3API cost spikesAdd usage meter; fallback to gpt-3.5 for explanations, keep GPT-4o for scoring.
4Limited official HSK audio/licencesUse freely available past papers; synthesize extra audio via TTS for drills.

11. Out-of-Scope (v1)
Mobile native apps

Gamification beyond simple streaks/achievements

Multi-user content sharing

Pronunciation phoneme-level scoring

HSK 3.0 levels 7-9

TOEFL / other exams

12. Appendix A – Data Dictionary (excerpt)
TableKey Fields
usersid, name, target_ielts, target_hsk
testsid, exam_type, level, section, title
questionsid, test_id, type, prompt, options_json, answer_key
answersid, user_id, question_id, response, correct_bool, ai_score_json
skill_profileuser_id, skill_code, mastery_pct, last_updated
study_planid, user_id, recommendation_txt, due_date, status

13. Appendix B – Core GPT Prompt (IELTS Writing)
System: You are a certified IELTS Writing examiner.
User essay: <<< ... >>>
Task: Grade according to 4 criteria:
1. Task Response ...
2. Coherence & Cohesion ...
3. Lexical Resource ...
4. Grammatical Range & Accuracy ...
Return JSON:
{
 "task_response": { "band": <number>, "comment": "<string>" },
 "coherence": ...,
 "lexical": ...,
 "grammar": ...,
 "overall_band": <number>
}
End of PRD
Keep this document version-controlled; update sections (esp. milestones, risks) as the project evolves.
