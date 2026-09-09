import importlib.util
import json
import unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location("runner",ROOT/"tools/conformance.py")
runner=importlib.util.module_from_spec(spec); spec.loader.exec_module(runner)

class OracleTests(unittest.TestCase):
    def test_smoke_sources_are_nonempty(self):
        self.assertTrue(all(c["text"] for c in runner.smoke_cases()))

    @unittest.skipUnless(__import__("shutil").which("node") and (ROOT/"node_modules/typescript").exists(),"pinned TypeScript oracle not installed")
    def test_jsx_trivia_only_change(self):
        self.assertEqual(runner.compare("const x = <div a={1}>x</div>;","const x=<div a={1}>x</div>;")[0],"pass")

    @unittest.skipUnless(__import__("shutil").which("node") and (ROOT/"node_modules/typescript").exists(),"pinned TypeScript oracle not installed")
    def test_jsx_text_change_is_visible(self):
        self.assertEqual(runner.compare("const x=<div>a b</div>;","const x=<div>ab</div>;")[0],"token-difference")
if __name__=="__main__": unittest.main()
