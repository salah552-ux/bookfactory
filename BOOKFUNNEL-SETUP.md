# BookFunnel Setup Guide
## Human action required — pipeline cannot complete this step

**Status:** BLOCKING — both live books have `[BOOKFUNNEL_LINK]` placeholders in their back matter and email sequences. Email capture is not live. Reader magnet delivery is not live.

**Books affected:**
- Fix Your Gut for Good — Lead magnet: The Gut Trigger Cheat Sheet
- Death in the Cathedral Close — Lead magnet: Who's Who in Wychford Close

---

## WHAT IS BOOKFUNNEL

BookFunnel is the standard delivery platform for reader magnets and lead magnets in the publishing industry. It handles:
- Hosting the PDF/EPUB file
- Delivering it to readers on any device (no friction)
- Capturing the reader's email address before delivery
- Passing that email to your email platform (MailerLite) automatically

You need a BookFunnel account. Plans start at $20/year (standard) or $100/year (pro, needed for MailerLite integration). The pro plan is required.

**Sign up at:** https://bookfunnel.com

---

## STEP 1 — CONVERT THE LEAD MAGNET TO PDF

Each LEAD-MAGNET.md file needs to become a formatted PDF before upload.

### Option A — Use the pipeline build script (preferred)
```bash
# From the BookFactory root directory
bash build-pdf.sh fix-your-gut-for-good
bash build-pdf.sh death-in-the-cathedral-close
```
This will create a styled PDF in `books/{slug}/exports/`. Check the output looks clean.

### Option B — Manual Markdown-to-PDF conversion
1. Open LEAD-MAGNET.md in a Markdown editor (Typora, Obsidian, VS Code with extension)
2. Export as PDF
3. Check the formatting — the table in the Gut Trigger Cheat Sheet needs to render cleanly

**Files to convert:**
- `C:\Users\salah\BookFactory\books\fix-your-gut-for-good\LEAD-MAGNET.md`
- `C:\Users\salah\BookFactory\books\death-in-the-cathedral-close\LEAD-MAGNET.md`

Both files are complete and ready for conversion. No content edits needed.

---

## STEP 2 — CREATE A BOOKFUNNEL ACCOUNT

1. Go to https://bookfunnel.com
2. Sign up with salah552@gmail.com (or whichever email you use for the S.A. Ibrahim brand)
3. Choose **Pro plan** ($100/year) — required for MailerLite integration
4. Set your author name to **S. A. Ibrahim**

---

## STEP 3 — CONNECT MAILERLITE

1. In BookFunnel: go to **Account Settings → Integrations**
2. Select **MailerLite**
3. Follow the OAuth or API key connection flow
4. Test the connection

You will need your MailerLite account active with the two groups already created:
- "Fix Your Gut for Good Readers"
- "Cathedral Close Mysteries Readers"

These groups are specified in both EMAIL-SEQUENCE.md files. Create them in MailerLite if they don't exist.

---

## STEP 4 — CREATE BOOK PAGES ON BOOKFUNNEL

### For Fix Your Gut for Good

1. In BookFunnel: click **+ Add Book**
2. Book title: **The Gut Trigger Cheat Sheet**
3. Author: **S. A. Ibrahim**
4. Upload the PDF you created in Step 1 (LEAD-MAGNET.md for fix-your-gut-for-good)
5. Set delivery type: **Free — require email**
6. Under "Email Integration": select MailerLite → Group: **Fix Your Gut for Good Readers**
7. Landing page text (copy this exactly):

```
The Gut Trigger Cheat Sheet

One page. Five triggers. What they are, how to recognise them, and what to do about each one — during the SIBO protocol and after.

Free for readers of Fix Your Gut for Good.
```

8. Click **Publish**
9. Copy the BookFunnel link (will look like: bookfunnel.com/[alphanumeric])

### For Death in the Cathedral Close

1. In BookFunnel: click **+ Add Book**
2. Book title: **Who's Who in Wychford Close**
3. Author: **S. A. Ibrahim**
4. Upload the PDF (LEAD-MAGNET.md for death-in-the-cathedral-close)
5. Set delivery type: **Free — require email**
6. Under "Email Integration": select MailerLite → Group: **Cathedral Close Mysteries Readers**
7. Landing page text (copy this exactly):

```
Who's Who in Wychford Close

A companion guide to Death in the Cathedral Close. Every major character, what they're concealing, and a map of the close. Plus five questions to hold while you read — with very different answers the second time through.

Free for readers of Death in the Cathedral Close.
```

8. Click **Publish**
9. Copy the BookFunnel link

---

## STEP 5 — PASS THE LINKS BACK TO THE PIPELINE

Once you have both BookFunnel links, tell Claude:

```
BookFunnel links are ready:
- Fix Your Gut for Good: [paste link]
- Death in the Cathedral Close: [paste link]
```

The pipeline-orchestrator will then:
1. Replace `[BOOKFUNNEL_LINK]` in both LEAD-MAGNET.md files with the live URLs
2. Replace `[BOOKFUNNEL_LINK]` in both EMAIL-SEQUENCE.md files with the live URLs
3. Generate updated EPUB exports for both books with the live back matter CTA
4. Update pipeline-state.json for both books: `bookfunnel_link_live: true`
5. Log the update to both AGENT-LOG.md files

**Do not try to replace the links manually — let the orchestrator do it to ensure all instances are caught across all files.**

---

## STEP 6 — SET UP MAILERLITE AUTOMATIONS

For each book's email sequence:

1. Log into MailerLite
2. Create a new **Automation**
3. Trigger: **Subscriber joins a group** → select the matching group
4. Add emails in sequence:
   - Email 1: copy from EMAIL-SEQUENCE.md → delay: 0 minutes (immediate)
   - Email 2: copy from EMAIL-SEQUENCE.md → delay: 48 hours
   - Email 3: copy from EMAIL-SEQUENCE.md → delay: 7 days
5. Set **From name:** S. A. Ibrahim
6. Set **Reply-to:** [your email address]
7. Enable **double opt-in** (GDPR required for UK readers)
8. Activate the automation

Both EMAIL-SEQUENCE.md files have complete email copy ready to paste. The only remaining variables are:
- `[BOOKFUNNEL_LINK]` → replace with live URL after Step 4
- `[author email]` in the reply-to field → use salah552@gmail.com or your preferred author contact

---

## STATUS TRACKING

Once done, tell Claude which steps are complete. The pipeline will update pipeline-state accordingly.

| Step | Status |
|------|--------|
| PDFs converted | pending |
| BookFunnel account created | pending |
| MailerLite connected | pending |
| Fix Your Gut book page live | pending |
| Cathedral Close book page live | pending |
| BookFunnel links sent to pipeline | pending |
| EPUB back matter updated | pending — blocked on links |
| MailerLite automations active | pending |

---

## PIPELINE STATE FLAGS (current)

Both `pipeline-state.json` files are flagged:
- `bookfunnel_link_live: false`
- `bookfunnel_gap_flagged: true`
- Stage 08 marked `in_progress` (Fix Your Gut) / `not_started` (Cathedral Close)

The orchestrator will surface this gap in every session until `bookfunnel_link_live` is set to `true` in both files. See GAP 6 milestone alerts.
