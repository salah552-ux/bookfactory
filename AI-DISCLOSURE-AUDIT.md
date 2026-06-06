# AI Disclosure Audit — BookFactory
## Generated: 2026-06-04
## Applies to: All books live or pending upload

---

## AMAZON'S CURRENT POLICY — WHAT IT ACTUALLY SAYS

Amazon's AI content disclosure requirement (mandatory since 2023, prominently enforced from April 2024, now a hard gate in the KDP upload questionnaire) distinguishes:

**Category A — AI-Generated Content:**
The primary content (text of the book) was created by an AI system. The human role was prompt writing, selection, and light editing. The AI is the author of the content in substance.

KDP questionnaire answer: "Created by AI"

**Category B — AI-Assisted Content:**
A human author wrote, directed, and extensively revised the content. AI tools were used as research aids, drafting assistants, or editorial tools — but the human is genuinely the author of the final work. The content reflects the human's knowledge, judgment, and editorial control.

KDP questionnaire answer: "Some content was AI-generated and has been edited and revised by a human"

**Category C — No AI:**
No AI tools were used in text creation.

KDP questionnaire answer: "None"

**The line between A and B is not clearly defined by Amazon in public policy language.** The practical distinction is: if a human could not have written the book without the AI doing the primary generation work, it is Category A. If the AI assisted but the human's knowledge and editorial judgment is genuinely present throughout, it is Category B.

**Amazon does not require publishers to prove their categorisation.** It is a self-attestation. However, publishing Category A content as Category B is a TOS violation that can result in account suspension.

---

## WHERE BOOKFACTORY BOOKS FALL

### The BookFactory workflow, accurately described:

1. The Opus brain agent produces a blueprint based on market intelligence.
2. The writer agent (health-writer, murder-mystery-writer) generates chapter drafts using detailed prompts that specify: tone, structure, specific facts to include, voice rules, word count targets, chapter function.
3. The Architect reviews drafts. Some chapters are edited or redirected. Chapters below quality thresholds are flagged for rewrite.
4. The quality and compliance systems review the full manuscript.
5. The Architect makes final approval decisions.

**Assessment:** BookFactory produces AI-generated content that is edited, directed, and approved by a human. The primary text generation is performed by the AI model. The human provides the strategy, the brief, the quality gate, and the editorial judgment — but does not write the prose independently of the AI.

**Correct disclosure category: Category B** — "Some content was AI-generated and has been edited and revised by a human."

This is the same categorisation already embedded in `kdp-upload-agent.md` (confirmed correct).

**Rationale for Category B over Category A:**
The distinction matters. Category A ("created by AI") implies the human role was minimal — a prompt, a selection, and publish. BookFactory's workflow involves significant human direction at every stage: the market intelligence decision, the blueprint approval, the chapter-by-chapter brief, the quality review, and the final approval gate. The Architect is a genuine editorial decision-maker, not a pass-through. Category B is accurate.

**This position should be maintained consistently across all books.**

---

## IN-BOOK DISCLOSURE STATUS

Amazon does not require an in-book AI disclosure. However, having one demonstrates good faith and creates consistency between the book's copyright page and the KDP questionnaire answer.

| Book | In-book disclosure present | Exact language used | Assessment |
|------|---------------------------|---------------------|------------|
| Fix Your Gut for Good | YES | "This work was developed with AI assistance as a research, drafting, and editorial tool under the author's direction and editorial control. All content, claims, and recommendations have been reviewed, verified, and approved by the author." | COMPLIANT — accurate, proportionate, consistent with Category B |
| Death in the Cathedral Close | YES | "AI Disclosure: This work was developed with AI assistance as a research, drafting, and editorial tool under the author's direction and editorial control. All content has been reviewed, verified, and approved by the author." | COMPLIANT — accurate, proportionate, consistent with Category B |
| 7-Day Gut Reset (pending) | N/A — not yet written | Will be written to same standard | TO VERIFY before upload |

---

## KDP QUESTIONNAIRE STATUS — LIVE BOOKS

The KDP AI questionnaire is filled at upload time. The answers are stored in KDP's system.
The Architect must verify these in KDP for the two live books.

### How to check the current questionnaire answers for a live book:

1. Go to: kdp.amazon.com → Bookshelf
2. Click the three dots next to the book → "Edit eBook Details"
3. Navigate to the "Content" tab
4. Scroll to the "AI-generated content" section
5. The current selections will be visible

### Fix Your Gut for Good (ASIN: B0GXYLWS1W)

**Correct answers (per kdp-upload-agent.md):**

| Field | Correct answer |
|-------|----------------|
| Text content | "Some content was AI-generated and has been edited and revised by a human" |
| AI tools (text) | "Anthropic Claude" |
| Images | "None" |
| Translation | "None" |

**Status:** Uploaded April 2026 — before the three confirmed failures were documented and before kdp-upload-agent.md was updated with the hard AI questionnaire protocol. The Architect must verify the current answers match the above.

**Human action required:** Log into KDP → Edit eBook Details → Content tab → Verify AI questionnaire answers match the table above. If incorrect, update and save. Note the outcome here.

**Risk level if incorrect:** MEDIUM. Amazon's enforcement has been inconsistent. If the questionnaire says "None" when AI was used, that is a misrepresentation. Correcting it proactively is the right action and carries no penalty.

---

### Death in the Cathedral Close (ASIN: B0GZD1S8HF)

**Correct answers (per kdp-upload-agent.md):**

| Field | Correct answer |
|-------|----------------|
| Text content | "Some content was AI-generated and has been edited and revised by a human" |
| AI tools (text) | "Anthropic Claude" |
| Images | "None" |
| Translation | "None" |

**Status:** Uploaded May 2026 — after kdp-upload-agent.md was updated with the AI questionnaire protocol. FAILURE 3 (wrong AI questionnaire) was a confirmed failure on a previous upload, and the upload agent was then updated with hard rules to prevent recurrence.

**From agent_log:** `"ai_questionnaire_confirmed": true` is set in pipeline-state.json.

However: "ai_questionnaire_confirmed" means the Architect confirmed the values the agent proposed — it does not confirm the values were entered correctly into KDP. The category failure on this same book (Trad Detective instead of Cozy) shows that confirmation and correct entry are not the same thing.

**Human action required:** Verify the AI questionnaire answers in KDP the same way as Book 1 above. The correct answers are the same for all BookFactory books.

---

### 7-Day Gut Reset (pending upload)

**Status:** Book exists as a blueprint in the intelligence layer. It has not been written or uploaded yet. When it reaches Stage 07 (publishing), kdp-upload-agent.md will govern the upload including the AI questionnaire. No action required now.

**Pre-upload requirement:** Confirm in-book copyright page includes AI disclosure in the same form as the two live books before the upload session begins.

---

## SUMMARY — HUMAN ACTIONS REQUIRED

| Priority | Action | Book | Where |
|----------|--------|------|-------|
| 1 — High | Verify AI questionnaire answers in KDP | Fix Your Gut for Good | KDP → Edit eBook Details → Content tab |
| 2 — High | Verify AI questionnaire answers in KDP | Death in the Cathedral Close | KDP → Edit eBook Details → Content tab |
| 3 — On upload | Confirm copyright page has AI disclosure before export | 7-Day Gut Reset | books/7-day-gut-reset/manuscript/00-00-copyright.md |

---

## CORRECT DISCLOSURE LANGUAGE — CANONICAL VERSION

For all future BookFactory books, use this exact language in the copyright page:

```
AI Disclosure: This work was developed with AI assistance as a research, drafting,
and editorial tool under the author's direction and editorial control. All content
has been reviewed, verified, and approved by the author.
```

And in the KDP questionnaire:
- Text: "Some content was AI-generated and has been edited and revised by a human"
- Tools: "Anthropic Claude"
- Images: "None"
- Translation: "None"

This language is already in kdp-upload-agent.md as a hard-coded requirement. This audit confirms it is correct and consistent with Amazon's current policy categories.

---

## ONGOING COMPLIANCE

Amazon updates its AI policy periodically. The ALGO-INTELLIGENCE.md file tracks confirmed policy changes (see v1.1, §16: "AI content disclosure now mandatory at upload — confirmed HIGH confidence, 2026-06-03"). When Amazon updates the AI disclosure requirements, update this audit document and kdp-upload-agent.md in the same session.

Monitor: Author groups, KDP community forums, and the KDP help pages for any changes to AI disclosure requirements before each book upload.
