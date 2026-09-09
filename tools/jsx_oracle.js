#!/usr/bin/env node
"use strict";
const ts = require("typescript");
let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", chunk => input += chunk);
process.stdin.on("end", () => {
  const sources = JSON.parse(input);
  const results = sources.map(source => {
    const sf = ts.createSourceFile("case.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    if (sf.parseDiagnostics.length) {
      return {ok:false, diagnostics:sf.parseDiagnostics.map(d => ts.flattenDiagnosticMessageText(d.messageText, "\n"))};
    }
    const scanner = ts.createScanner(ts.ScriptTarget.Latest, false, ts.LanguageVariant.JSX, source);
    const tokens = [];
    for (;;) {
      const kind = scanner.scan();
      if (kind === ts.SyntaxKind.EndOfFileToken) break;
      if (kind > ts.SyntaxKind.LastTriviaToken) tokens.push([kind, scanner.getTokenText()]);
    }
    // JSX text is semantic: the scanner tokenizes text words as identifiers
    // with the separating whitespace as trivia, so an identical non-trivia
    // token stream can still hide a JSX text change (for example
    // `a  b` -> `a b`). Walk the AST and retain every JsxText node's exact
    // text in document order so the oracle also proves JSX text was preserved.
    const jsxTexts = [];
    const visit = node => {
      if (ts.isJsxText(node)) jsxTexts.push(node.getText(sf));
      ts.forEachChild(node, visit);
    };
    visit(sf);
    return {ok:true, tokens, jsxTexts};
  });
  process.stdout.write(JSON.stringify(results));
});