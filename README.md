# Minify++ JSX / TSX Conformance

Independent JSX / TSX conformance evidence for Minify++. The harness pins TypeScript JSX conformance cases, extracts an explicitly eligible corpus, minifies each case in bounded batches, and applies TypeScript parsing and exact non-trivia token comparison. Upstream sources are acquired on demand and are never committed.

```sh
make deps
make smoke test
make sync extract run
make dashboard
```

Use `python3 tools/conformance.py extract --limit 1000` for iteration. Result JSON records the exact upstream revision, extraction exclusions, minifier identity, raw non-pass evidence and timestamped history.

## Contract

The oracle parses both inputs as TSX and compares the complete non-trivia token stream. JSX text remains a semantic token, so whitespace inside rendered children is not normalized away. This establishes lexical/parse preservation; it does not claim React runtime equivalence or general TypeScript compilation.

Statuses are `pass`, `semantic-difference` or `token-difference`, `parser-rejected`, `source-rejected`, and `minify-error`. Only transformed failures fail the run. Any confirmed product defect must be minimized into Minify++'s permanent suite before a corrected complete result is published.

## Evidence policy

A smoke run proves the harness is wired correctly, not corpus conformance. Public claims require a fresh complete extraction and run at the recorded revision. Eligibility totals and every exclusion category must be published alongside the pass count. The dashboard is generated from a completed immutable result; it is not live during execution.
