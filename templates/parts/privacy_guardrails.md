## 🔒 STRICT PRIVACY, PII & SECRETS PRE-FLIGHT GUARDRAILS

To prevent accidental data exfiltration or sending sensitive enterprise code to external LLM servers:

### 1. In-Memory Local Sanitization & Masking
Before ANY source code, SQL script, schema file, or configuration file is processed or transmitted to an LLM prompt context, the agent MUST locally apply regex masking to sanitize the payload while preserving exact source line numbers:
- **API Keys & Credentials:** Passwords, private keys, database connection strings, tokens, secrets → `<REDACTED_SECRET>`
- **Personal Identifiable Information (PII / IM8 Alignment):**
    - Singapore NRIC / FIN / SSN → `S****123A` / `T****567B`
    - Real Email addresses → `user@example.com`
    - Real Phone numbers → `+65-XXXX-XXXX`
    - Real Names / Physical Addresses → Synthetic Mock Placeholders
- **Local Logs Excluded:** All temporary pre-flight privacy diffs and logs written to `.openspec/preflight_logs/` MUST be ignored by Git.

### 2. Conditional Pre-Flight User Confirmation Gate
Run local in-memory sanitization before transmitting file context for Phase 3 (Capability Slicing):
- **AUTOMATIC PROCEED (No Threat / No Secret Detected):** If the local scan reveals **zero** credentials, secrets, PII, or security threats, **PROCEED AUTOMATICALLY** with analysis without pausing to ask the user.
- **CONDITIONAL PAUSE (Secret Masked or Threat Detected):** If the scan detects and masks PII/secrets or identifies a security threat,
- **HALT EXECUTION & ASK**:
  > ⚠️ **PRIVACY PRE-FLIGHT CHECK (Sensitive Items Masked / Threat Flagged):**
  > I detected sensitive data/threats in the target files. Masking applied:
  > - `<file_1>`: Redacted secret/PII on line(s) `<lines>`
  > - `<file_2>`: `<detected_threat_type>`
  >
  > Review the sanitized preview. Type **'yes'**, **'confirm'**, or **'approve'** to proceed, or **'cancel'** to abort.