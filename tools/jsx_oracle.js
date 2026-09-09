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
    return {ok:true, tokens};
  });
  process.stdout.write(JSON.stringify(results));
});
