---
name: canva-bulk-create
description: Bulk-create Canva designs from tabular data using a brand template with autofill fields, producing one design per row. Use when users say "bulk create designs from this CSV", "generate one design per row", "create a design for each product", "batch generate from a template", or "autofill a template from a spreadsheet". Accepts any tabular data source — uploaded files, pasted tables, JSON, or URLs.
---

# Canva Bulk Design Creation

Create one Canva design per row of data by autofilling a brand template with data tags.

## Workflow

### Step 1: Get the Data

Accept data in any form the user provides and extract a list of rows with named columns:

- **Uploaded file**: read the file and extract headers and rows
- **Pasted data**: parse markdown tables, tab-separated values, or JSON arrays directly from the chat
- **URL**: fetch the resource and parse the response as tabular data

Once parsed, show the user:
- Column headers found
- Number of rows (= number of designs that will be created)
- A preview of the first few rows

### Step 2: Select the Brand Template

If the user hasn't specified a template, search for autofill-capable ones:

```
Canva:search-brand-templates  dataset=non_empty
```

Show the results and ask the user to pick one.

### Step 3: Inspect the Template Schema

```
Canva:get-brand-template-dataset  template_id=<selected_id>
```

### Step 4: Map CSV Columns to Template Fields

Present a mapping table. Confirm before proceeding.

#### Image Field Handling

- **Pattern A** — CSV has Canva asset ID: use directly
- **Pattern B** — CSV has image URL: upload via `Canva:upload-asset-from-url` first
- **Pattern C** — No image column: skip or abort

### Step 5: Bulk Create — Sequential

Loop through every row, call `Canva:autofill-design` sequentially. Track results live.

### Step 6: Report Results

Summarise successes/failures with links. Offer summary CSV export.

## Notes

- Autofill requires Canva Enterprise plan.
- Warn for large batches (50+ rows) — offer 3-row test run first.
- No undo for bulk create — warn before starting.
- Skip empty rows, warn user.
