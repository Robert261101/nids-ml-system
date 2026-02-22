# Threat Model

## Assets

- Trained ML model
- Prediction results
- User credentials
- Network datasets
- API endpoints

##Attack Surfaces

- REST API endpoints
- ML inference endpoint
- Authentication flow
- Database queries
- Docker containers (future stage)

## STRIDE Analysis

| Threat                 | Example                  | Mitigation           |
|------------------------|--------------------------|----------------------|
| Spoofing               | Fake user token          | JWT validation       |
| Tampering              | Modify alerts            | DB constraints       |
| Repudiation            | User denies action       | Audit logging        |
| Information Disclosure | Model leak               | Hide model internals |
| Denial of Service      | Flood /predict           | Rate limiting        |
| Privilege Escalation   | User accesses admin data | RBAC                 |