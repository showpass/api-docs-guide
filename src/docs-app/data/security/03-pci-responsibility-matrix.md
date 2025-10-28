# PCI DSS Responsibilities — Showpass vs. Client

## Purpose
Clarify PCI DSS responsibilities by integration scenario, highlight conditional client obligations, and list evidence to retain for audit.

## Audience / Scope
For clients, auditors, and implementers using Showpass checkout. Applies to SAQ A scenarios only; Showpass operates all systems that process, transmit, or store CHD.

## Why any client controls exist (threat model)
If a page you control links to or embeds a payment form, an attacker could tamper with that page and skim data before it reaches Showpass. PCI assigns light-weight hygiene to your page (configs, patching, script governance, and—for embedded—tamper detection). Showpass owns all card-data processing, storage, logging, and platform security.

## Scenarios (least → most client scope)
1) **No hosted touchpoint** — Customers arrive on Showpass from email/social/QR/3rd-party listings; you host no purchase page.  
2) **Hosted link (redirect-only)** — You host a page with a hyperlink to Showpass; no Showpass code runs on your domain.  
3) **Embedded checkout (iframe/widget/JS)** — You host a page that embeds the Showpass checkout or launches it via JS.

**Select your scenario**

```
Host any page in the purchase flow?  
└─ No → Scenario 1  
└─ Yes → Is it only a hyperlink to Showpass (no checkout code)?  
    └─ Yes → Scenario 2  
    └─ No → Scenario 3  
```


## Legend
- **Applies When** — condition under which a control applies.  
- **Client Action** — **(Policy)** write/maintain brief policy/record · **(Configure)** one-time hardening/setup · **(Monitor)** periodic checks (patching cadence, quarterly scans).  
- **Effective 2025-03-31** — items move from best practice to required on that date.

---

## Scenario 1 — No hosted touchpoint
*You host no page involved in checkout or redirection.*

| PCI Requirement | Client | Showpass | Applies When | Client Action | Notes |
|---|:---:|:---:|---|---|---|
| Network security controls | — | ✓ | Always | — | Perimeter/CDN/firewalls by Showpass. |
| Secure configurations (no vendor defaults) | — | ✓ | — | — | No client web server in scope. |
| Protect stored CHD | — | ✓ | Always | — | Tokenization/encryption by Showpass/Stripe. |
| Encrypt CHD in transit | — | ✓ | Always | — | TLS 1.2+ end-to-end on platform side. |
| Anti-virus / EDR | — | ✓ | Always | — | In-scope endpoints managed by Showpass. |
| Secure systems & software (patching) | — | ✓ | — | — | Showpass patches its CDE. |
| Need-to-know access (RBAC) | — | ✓ | Always | — | Enforced on Showpass platforms. |
| Unique IDs & authentication | — | ✓ | Always | — | Showpass back-office auth is Showpass-managed. *(Best practice: no shared accounts when accessing Showpass portals.)* |
| Physical security of CHD (paper) | **Conditional** | ✓ | If you print reports | (Policy) | Lock/shred printed reports (even masked PANs). If not printing, N/A. |
| Logging & monitoring | — | ✓ | Always | — | Lives on Showpass infrastructure. |
| Security testing | — | ✓ | Always | — | Platform-level testing by Showpass. |
| Vendor oversight (12.8) | ✓ | ✓ | Always | (Policy/Monitor) | Track Showpass as TPSP; keep AOC; annual review. |
| Incident response (12.10) | ✓ | ✓ | Always | (Policy) | 1-page IR plan (who/when/how). |

**Scenario 1 summary (client):** Keep Showpass AOC in your TPSP program, maintain a brief IR plan, and handle paper only if you print.

---

## Scenario 2 — Hosted link (redirect-only)
*You host a page with a hyperlink to Showpass; no Showpass code runs on your domain.*

| PCI Requirement | Client | Showpass | Applies When | Client Action | Notes |
|---|:---:|:---:|---|---|---|
| Network security controls | — | ✓ | Always | — | Showpass-operated. |
| Secure configurations (no vendor defaults) | ✓ | ✓ | You host link page | (Configure) | Scope limited to the web server rendering the redirect page. |
| Protect stored CHD | — | ✓ | Always | — | As above. |
| Encrypt CHD in transit | — | ✓ | Always | — | As above. |
| Anti-virus / EDR | — | ✓ | Always | — | As above. |
| Secure systems & software (patching) | ✓ | ✓ | You host link page | (Configure/Monitor) | Patch CMS/OS/plugins; Showpass patches its CDE. |
| Need-to-know access (RBAC) | — | ✓ | Always | — | As above. |
| Unique IDs & authentication | ✓ | ✓ | Always | (Policy) | Unique staff logins for CMS/Showpass portal (no shared accounts). Showpass enforces MFA/RBAC. |
| Physical security of CHD (paper) | **Conditional** | ✓ | If you print reports | (Policy) | Lock/shred printed reports. |
| Logging & monitoring | — | ✓ | Always | — | As above. |
| Security testing (ASV scans) | ✓ | ✓ | Public-facing link page | (Monitor) | Quarterly ASV scans for any Internet-facing redirect host. |
| Vendor oversight (12.8) | ✓ | ✓ | Always | (Policy/Monitor) | Retain AOC; annual review. |
| Incident response (12.10) | ✓ | ✓ | Always | (Policy) | Brief IR plan. |

**Scenario 2 summary (client):** Harden/patch the host serving the purchase link; keep quarterly ASV scans passing; ensure unique staff logins; retain AOC; paper handling only if you print.

---

## Scenario 3 — Embedded checkout (iframe/widget/JS)
*You host a page that embeds Showpass checkout or launches it via JS.*

| PCI Requirement | Client | Showpass | Applies When | Client Action | Notes |
|---|:---:|:---:|---|---|---|
| Network security controls | — | ✓ | Always | — | As above. |
| Secure configurations (no vendor defaults) | ✓ | ✓ | Embedded page | (Configure) | Harden CMS/OS; remove defaults. |
| Protect stored CHD | — | ✓ | Always | — | As above. |
| Encrypt CHD in transit | — | ✓ | Always | — | As above. |
| Anti-virus / EDR | — | ✓ | Always | — | As above. |
| Secure systems & software (patching) | ✓ | ✓ | Embedded page | (Configure/Monitor) | Patch CMS/OS/plugins; Showpass patches its CDE. |
| **Payment-page scripts (6.4.3)** | ✓ | ✓ | Embedded page | (Configure/Monitor) | Inventory/authorize each script; ensure integrity. **Effective 2025-03-31.** |
| Need-to-know access (RBAC) | — | ✓ | Always | — | As above. |
| Unique IDs & authentication | ✓ | ✓ | Always | (Policy) | As Scenario 2. |
| Physical security of CHD (paper) | **Conditional** | ✓ | If you print reports | (Policy) | As above. |
| Logging & monitoring | — | ✓ | Always | — | As above. |
| **Tamper/change detection (11.6.1)** | ✓ | ✓ | Embedded page | (Configure/Monitor) | Detect unauthorized changes to headers/page content as received in the browser. **Effective 2025-03-31.** |
| Vendor oversight (12.8) | ✓ | ✓ | Always | (Policy/Monitor) | As above. |
| Incident response (12.10) | ✓ | ✓ | Always | (Policy) | As above. |

**Scenario 3 summary (client):** Scenario 2 items **plus** 6.4.3 (script inventory/authorization/integrity) and 11.6.1 (client-side tamper detection) on embedded pages (required from 2025-03-31).

---

## Control Guidance — Do / Evidence / N/A (compact)

**Req 2 — Secure configurations**  
- **Do:** Remove defaults; harden CMS/OS; disable unused services.  
- **Evidence:** Hardening checklist; CMS/plugin inventory; config baseline.  
- **N/A:** “No merchant web server participates in checkout or redirection (Scenario 1).”

**Req 3 / 9 — Paper handling**  
- **Do:** If printing, define retention and secure destruction; lock or shred.  
- **Evidence:** Paper policy; destruction log.  
- **N/A:** “Client does not print or retain reports containing account data.”

**Req 6 — Patching & script governance**  
- **Do:** Patch CMS/OS/plugins; for Scenario 3, maintain script inventory/authorization and integrity checks (6.4.3).  
- **Evidence:** Patch logs; script register; approvals; integrity reports.  
- **N/A:** “No client-hosted page participates in checkout (Scenario 1).”

**Req 8 — Unique IDs & authentication**  
- **Do:** Unique staff logins for CMS/any admin publishing link/embedded page; avoid shared accounts.  
- **Evidence:** Access roster; joiner/mover/leaver log; password standard.

**Req 11 — ASV & tamper detection**  
- **Do:** Scenario 2/3: quarterly ASV scans on public-facing host; Scenario 3: 11.6.1 tamper/change detection with actionable alerts.  
- **Evidence:** ASV attestation & re-scan; tamper alerts/tests.  
- **N/A:** “No public-facing merchant host participates (Scenario 1).” / “No embedded checkout used (11.6.1 N/A).”

**Req 12 — Vendor oversight & incident response**  
- **Do:** Keep Showpass in TPSP inventory; retain AOC; annual review; maintain brief IR plan (who/when/how).  
- **Evidence:** TPSP record; latest AOC; IR plan; review note.

---

## Implementation quick wins

**6.4.3 (scripts) — Good / Better / Best**  
- **Good:** Script Register; CSP `script-src` limited to your domain + Showpass; SRI on static tags.  
- **Better:** Nonce-based CSP; build-time SRI; PR approval to add scripts; scheduled URL validation.  
- **Best:** Above + commercial client-side integrity monitoring tied to alerting.

**11.6.1 (tamper detection) — Acceptance criteria**  
- Detects unauthorized modification of HTTP headers and page content **as received in the browser**.  
- Sends actionable alerts (timestamp, URL, diff) to on-call.  
- Tested monthly via benign change to confirm detection + alerting.

---

## RACI Matrix

**Legend:** R = Responsible · A = Accountable · C = Consulted · I = Informed

| Area / Control                                                       | Client | Showpass |
|----------------------------------------------------------------------|:------:|:--------:|
| **Platform security (CDE, storage, encryption, MFA/RBAC)**           |   I    | **A/R**  |
| Payment processing & tokenization                                    |   I    | **A/R**  |
| **Client web server hardening & patching** *(Scenarios 2/3)*         | **A/R**|    C     |
| Payment-page scripts (Req 6.4.3) on embedded pages *(Scenario 3)*    | **A/R**|    C     |
| Tamper / change detection (Req 11.6.1) *(Scenario 3)*                | **A/R**|    C     |
| ASV scans on client public-facing hosts *(Scenarios 2/3)*            | **A/R**|    C     |
| Unique IDs & authentication on client CMS / site                     | **A/R**|    C     |
| Authentication, MFA & RBAC within Showpass portals                   |   I    | **A/R**  |
| Physical security of printed reports (paper)                         | **A/R**|    C     |
| Vendor oversight (Req 12.8) & AOC retention                          | **A/R**|    C     |
| Incident response on client-hosted pages *(Scenarios 2/3)*           | **A/R**|    C     |
| Platform logging, monitoring & penetration testing                   |   I    | **A/R**  |


---

## Scenario Checklists (Client)

### 1 — No hosted touchpoint
- [ ] TPSP record lists Showpass; latest AOC on file
- [ ] Annual TPSP review scheduled
- [ ] 1-page Incident Response (IR) plan in place (who/when/how)
- [ ] *(If printing)* Paper-handling policy and destruction log

### 2 — Hosted link (redirect-only)
- [ ] Scenario 1 items
- [ ] CMS/OS hardened; vendor defaults removed
- [ ] Patch cadence defined; plugin inventory maintained
- [ ] Quarterly ASV scan passing for any Internet-facing redirect host; remediation & re-scan documented
- [ ] Unique staff logins (no shared accounts) for CMS and Showpass portal

### 3 — Embedded checkout (iframe/widget/JS)
- [ ] Scenario 2 items
- [ ] Script Register maintained; additions/changes approved (Req 6.4.3) **(Effective 2025-03-31)**
- [ ] CSP + SRI (or nonce-based CSP) live on embedded pages (Req 6.4.3)
- [ ] Client-side tamper/change detection configured on embedded pages; alerts tested monthly (Req 11.6.1) **(Effective 2025-03-31)**


## Conclusion

Scenarios **1 (No hosted touchpoint)** and **2 (Hosted link / redirect-only)** align with industry **security best practices**: Showpass operates the entire card-data environment, while the client’s role is limited to baseline hygiene on their own site and identities (unique logins, basic hardening/patching for Scenario 2, optional paper handling, and standard TPSP oversight with the Showpass AOC). Implemented as described, most organizations meet **SAQ A** expectations without additional tooling or complex processes.

**Scenario 3 (Embedded checkout)** introduces more client scope on the webpage itself. To maintain an equivalent risk posture, add:
- **Req 6.4.3** — script inventory/authorization and integrity controls on embedded pages, and  
- **Req 11.6.1** — client-side tamper/change detection with actionable alerting.  
Both become fully required on **2025-03-31**.

If uncertain which model to adopt, prefer **Scenario 1 or 2** to minimize client scope while preserving user experience, and move to **Scenario 3** only when embedding is a product requirement and the additional controls are in place. For audit traceability, retain the artifacts listed above (TPSP record + AOC, ASV reports where applicable, Script Register, CSP/SRI configuration, tamper-detection test evidence, and a brief IR plan).
