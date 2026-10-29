<!-- Generated from packages/engine/src/rules. Run `pnpm docs:rules` after changing a rule. -->

# Rules

| ID | Category | Default level | Detects |
|---|---|---|---|
| [DOME-VSC-001](DOME-VSC-001.md) | `autorun` | 🟠 review | Task runs on folder open |
| [DOME-VSC-002](DOME-VSC-002.md) | `autorun` | 🟠 review | Automatic tasks turned on |
| [DOME-VSC-003](DOME-VSC-003.md) | `autorun` | 🟠 review | .vscode hidden from view |
| [DOME-VSC-004](DOME-VSC-004.md) | `autorun` | 🔴 block | Task runs a non-script file with Node |
| [DOME-VSC-005](DOME-VSC-005.md) | `autorun` | 🔴 block | Task downloads and runs code |
| [DOME-VSC-006](DOME-VSC-006.md) | `autorun` | ⚪ info | Task output hidden |
| [DOME-NPM-001](DOME-NPM-001.md) | `autorun` | 🟠 review | Install script added or changed |
| [DOME-NPM-002](DOME-NPM-002.md) | `autorun` | 🟠 review | Install script runs an unexpected file |
| [DOME-DEV-001](DOME-DEV-001.md) | `autorun` | 🟠 review | Dev container lifecycle command |
| [DOME-AGT-001](DOME-AGT-001.md) | `autorun` | 🟠 review | AI agent hooks or auto-approved tools |
| [DOME-GHA-001](DOME-GHA-001.md) | `autorun` | 🟠 review | Workflow added, changed or risky |
| [DOME-GIT-001](DOME-GIT-001.md) | `autorun` | ⚪ info | .gitignore stops ignoring .vscode or .env |
| [DOME-GIT-002](DOME-GIT-002.md) | `autorun` | 🟠 review | Git hooks committed to the repository |
| [DOME-AST-001](DOME-AST-001.md) | `payload` | 🟠 review | Font file is not a font |
| [DOME-AST-002](DOME-AST-002.md) | `payload` | 🔴 block | Asset in an execution position |
| [DOME-CFG-001](DOME-CFG-001.md) | `payload` | 🟠 review | Code after the module body in a config file |
| [DOME-CFG-002](DOME-CFG-002.md) | `payload` | 🟠 review | Whitespace padding or very long line in source |
| [DOME-CFG-003](DOME-CFG-003.md) | `payload` | 🟠 review | Runtime code construction in config or route code |
| [DOME-ENV-001](DOME-ENV-001.md) | `payload` | 🟠 review | Encoded URL in .env with code that sends the environment |
| [DOME-PRP-001](DOME-PRP-001.md) | `payload` | 🟠 review | Propagation script rewrites history |
| [DOME-IOC-001](DOME-IOC-001.md) | `intel` | 🔴 block | Known-bad file hash |
| [DOME-IOC-002](DOME-IOC-002.md) | `intel` | 🔴 block | Published campaign marker |
| [DOME-IOC-003](DOME-IOC-003.md) | `intel` | 🔴 block | Known malicious npm package |
| [DOME-IOC-004](DOME-IOC-004.md) | `intel` | 🔴 block | Known staging or C2 domain in an executable position |
| [DOME-STL-001](DOME-STL-001.md) | `stellar` | 🟠 review | Code reads Stellar CLI identities |
| [DOME-STL-002](DOME-STL-002.md) | `stellar` | 🟠 review | Code reads browser wallet extension storage |
| [DOME-STL-003](DOME-STL-003.md) | `stellar` | 🟠 review | Hard-coded Stellar secret key |

Default levels are before grading. In a diff scan, a payload finding plus any auto-run surface in the same
change becomes a block ("An auto-run surface in the same change can trigger it."). In a full scan, a folder-open task plus a fake font
anywhere in the tree blocks. A folder-open task, automatic tasks turned on and a hidden `.vscode` together
block in either scan. See [How findings are graded](../../README.md#how-findings-are-graded).
