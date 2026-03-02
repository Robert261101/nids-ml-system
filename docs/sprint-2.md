# Sprint 2 — Sandbox Execution + Isolation Hardening (Mar 9–Mar 22)

## What was implemented
- Docker-based service isolation (backend public, ML internal-only network).
- Upload sandbox in backend: size limits, MIME gating, temp storage, forced cleanup.
- Defense-in-depth: ML service also enforces payload constraints.
- Hardening controls: read-only containers, dropped Linux capabilities, tmpfs for /tmp.
- API abuse mitigation: rate limiting and secure HTTP headers.
- Traceability: request IDs and minimal audit logging.

## Security impact
- Reduced attack surface: ML service not reachable from outside the internal network.
- Reduced persistence risk: uploaded files are temporary and always deleted.
- Reduced DoS risk: capped file sizes + request timeouts + rate limiting.