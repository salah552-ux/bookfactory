#!/usr/bin/env node
// Tests for harvest-autocomplete.cjs. Pure unit tests over buildUrl and
// parseSuggestions ONLY — NO network, NO real intelligence/ files touched.
// Fixture bodies below mirror the real shape observed from a live
// verification call against completion.amazon.com / completion.amazon.co.uk
// during development (see .superpowers/sdd/validation-upgrades-report.md).
const assert = require("assert");
const { parseSuggestions, buildUrl } = require("../harvest-autocomplete.cjs");

// -----------------------------------------------------------------------
// buildUrl
// -----------------------------------------------------------------------

// 1. .com marketplace — correct host, mid, alias, single-word prefix.
{
  const url = buildUrl("com", "gut health");
  assert.ok(url.startsWith("https://completion.amazon.com/api/2017/suggestions?"), "com host");
  assert.ok(url.includes("mid=ATVPDKIKX0DER"), "com mid");
  assert.ok(url.includes("alias=digital-text"), "alias present");
  assert.ok(url.includes("prefix=gut%20health"), "multi-word prefix percent-encoded with %20");
}

// 2. co.uk marketplace — correct host + mid.
{
  const url = buildUrl("co.uk", "vagus nerve");
  assert.ok(url.startsWith("https://completion.amazon.co.uk/api/2017/suggestions?"), "co.uk host");
  assert.ok(url.includes("mid=A1F83G8C2ARO7P"), "co.uk mid");
  assert.ok(url.includes("prefix=vagus%20nerve"), "prefix encoded");
}

// 3. Invalid marketplace token throws rather than silently defaulting —
//    this script must not repeat fetch-live-baseline.cjs's silent-default
//    footgun (flagged in automation/prompts/job7-weekly-heartbeat.md).
{
  assert.throws(() => buildUrl("uk", "gut health"), /marketplace/i, "non-literal token 'uk' rejected");
  assert.throws(() => buildUrl("US", "gut health"), /marketplace/i, "wrong-case token rejected");
  assert.throws(() => buildUrl(undefined, "gut health"), /marketplace/i, "missing marketplace rejected");
}

// 4. Special characters in the seed are safely percent-encoded (e.g. "&").
{
  const url = buildUrl("com", "gut & health");
  assert.ok(url.includes("prefix=gut%20%26%20health"), "ampersand in seed encoded, not injected as a new query param");
}

// -----------------------------------------------------------------------
// parseSuggestions
// -----------------------------------------------------------------------

// 5. Real-shaped .com response (captured live 2026-07-11) parses to a
//    plain array of the suggestion strings, in document order.
{
  const body = JSON.stringify({
    alias: "digital-text",
    prefix: "gut health",
    suffix: "",
    suggestions: [
      { suggType: "KeywordSuggestion", type: "KEYWORD", value: "gut health", refTag: "nb_sb_ss_i_1_10" },
      { suggType: "KeywordSuggestion", type: "KEYWORD", value: "gut health for women", refTag: "nb_sb_ss_i_2_10" },
    ],
    predictiveText: null,
    suggestionTitleId: null,
    responseId: "I689RGB0WTQF",
    shuffled: false,
  });
  const r = parseSuggestions(body);
  assert.deepStrictEqual(r, ["gut health", "gut health for women"]);
}

// 6. Genuine zero-result response (real shape — Amazon returns an empty
//    array, not a missing field) must parse to [] — a real observation,
//    not a parse failure.
{
  const body = JSON.stringify({
    alias: "digital-text",
    prefix: "zzxxqqnonsensequery12345",
    suffix: "",
    suggestions: [],
    predictiveText: null,
    suggestionTitleId: null,
    responseId: "3H3EGTTU26O1U",
    shuffled: false,
  });
  const r = parseSuggestions(body);
  assert.deepStrictEqual(r, [], "empty suggestions array is a real result, not null");
}

// 7. Malformed JSON body → null (unparseable), never an invented array.
{
  const r = parseSuggestions("<html>not json</html>");
  assert.strictEqual(r, null, "malformed JSON body must parse to null, not []");
}

// 8. Valid JSON but no "suggestions" key at all (e.g. an error payload) → null.
{
  const r = parseSuggestions(JSON.stringify({ error: "throttled" }));
  assert.strictEqual(r, null, "valid JSON without a suggestions array must parse to null");
}

// 9. "suggestions" present but not an array (defensive) → null.
{
  const r = parseSuggestions(JSON.stringify({ suggestions: "gut health" }));
  assert.strictEqual(r, null, "non-array suggestions field must parse to null, not be iterated");
}

// 10. Suggestion items missing a usable "value" are skipped, not invented
//     as empty strings or [object Object].
{
  const body = JSON.stringify({
    suggestions: [
      { suggType: "KeywordSuggestion", value: "gut health" },
      { suggType: "KeywordSuggestion" }, // no value at all
      { suggType: "KeywordSuggestion", value: "" }, // blank value
      { suggType: "KeywordSuggestion", value: 12345 }, // non-string value
      { suggType: "KeywordSuggestion", value: "gut health reset" },
    ],
  });
  const r = parseSuggestions(body);
  assert.deepStrictEqual(r, ["gut health", "gut health reset"], "only well-formed string values survive, nothing invented for the malformed items");
}

// 11. null / undefined body → null (defensive against a swallowed network error
//     being passed straight through as "the body").
{
  assert.strictEqual(parseSuggestions(null), null);
  assert.strictEqual(parseSuggestions(undefined), null);
  assert.strictEqual(parseSuggestions(""), null);
}

console.log("ALL PASS — harvest-autocomplete");
