---
description: Create an Architectural Decision Record (ADR) document for AI-optimized decision documentation.
metadata:
    github-path: skills/create-architectural-decision-record
    github-ref: refs/heads/main
    github-repo: https://github.com/github/awesome-copilot
    github-tree-sha: b7a90ff5b56ab9cdc674cee2c415bee46cbbf394
name: create-architectural-decision-record
---
# Create Architectural Decision Record

Create an ADR document for `${input:DecisionTitle}` using structured formatting optimized for AI consumption and human readability.

## Inputs

- **Context**: `${input:Context}`
- **Decision**: `${input:Decision}`
- **Alternatives**: `${input:Alternatives}`
- **Stakeholders**: `${input:Stakeholders}`

## Input Validation
If any of the required inputs are not provided or cannot be determined from the conversation history, ask the user to provide the missing information before proceeding with ADR generation.
If provided inputs are too vague, off-topic for an architectural decision, or insufficient to produce meaningful Context/Decision/Consequences sections, ask clarifying questions before generating the ADR.

## Requirements

- Use precise, unambiguous language
- Follow standardized ADR format with front matter
- Include both positive and negative consequences
- Document alternatives with rejection rationale
- Structure for machine parsing and human reference
- Use coded bullet points (3-4 letter codes + 3-digit zero-padded numbers, e.g., POS-001) in all bulleted sections regardless of item count: Positive, Negative, Alternatives, Implementation Notes, References

The ADR must be saved in the `/docs/adr/` directory using the naming convention: `adr-NNNN-[title-slug].md`, where NNNN is the next sequential 4-digit number (e.g., `adr-0001-database-selection.md`).
If the `/docs/adr/` directory does not exist, create it before writing the file.
Before generating the file, list existing files in `/docs/adr/` matching the pattern `adr-NNNN-*.md`, find the highest NNNN, and use NNNN+1 (zero-padded to 4 digits). If the directory does not exist or is empty, start at 0001.
If a file with the computed name already exists, do not overwrite it; increment NNNN and retry, or report the conflict to the user.
Use today's date in ISO 8601 format (YYYY-MM-DD) for the `date` field.
Leave `supersedes` and `superseded_by` empty unless the user explicitly indicates this ADR replaces a prior decision; in that case set `supersedes` to the prior ADR ID (e.g., ADR-0003).
Render only the current status in bold (e.g., **Proposed**). Do not include the other status options in the output.

## Required Documentation Structure

The documentation file must follow the template below, ensuring that all sections are filled out appropriately. The front matter for the markdown should be structured correctly as per the example following:

```md
---
title: "ADR-NNNN: [Decision Title]"
status: "Proposed"
date: "YYYY-MM-DD"
authors: "[Stakeholder Names/Roles]"
tags: ["architecture", "decision"]
supersedes: ""
superseded_by: ""
---

# ADR-NNNN: [Decision Title]

## Status

**Proposed**

## Context

[Problem statement, technical constraints, business requirements, and environmental factors requiring this decision.]

## Decision

[Chosen solution with clear rationale for selection.]

## Consequences

### Positive

- **POS-001**: [Beneficial outcomes and advantages]
- **POS-002**: [Performance, maintainability, scalability improvements]
- **POS-003**: [Alignment with architectural principles]

### Negative

- **NEG-001**: [Trade-offs, limitations, drawbacks]
- **NEG-002**: [Technical debt or complexity introduced]
- **NEG-003**: [Risks and future challenges]

## Alternatives Considered

### [Alternative 1 Name]

- **ALT-001**: **Description**: [Brief technical description]
- **ALT-002**: **Rejection Reason**: [Why this option was not selected]

### [Alternative 2 Name]

- **ALT-003**: **Description**: [Brief technical description]
- **ALT-004**: **Rejection Reason**: [Why this option was not selected]

## Implementation Notes

- **IMP-001**: [Key implementation considerations]
- **IMP-002**: [Migration or rollout strategy if applicable]
- **IMP-003**: [Monitoring and success criteria]

## References

- **REF-001**: [Related ADRs]
- **REF-002**: [External documentation]
- **REF-003**: [Standards or frameworks referenced]
```
