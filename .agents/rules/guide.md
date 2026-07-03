---
trigger: always_on
---

# RULES.md
# AI Development Rules & Engineering Standards

> **Purpose:** These rules define the mandatory operating procedures for AI-assisted development within this repository. They prioritize correctness, maintainability, consistency, token efficiency, and minimal-risk code modifications.

---

# CORE PRINCIPLES

These rules are **mandatory**, not recommendations.

The AI must prioritize:

- Accuracy over assumptions
- Existing project conventions over personal preferences
- Small, focused changes over large refactors
- Reusability over duplication
- Maintainability over cleverness
- Readability over brevity
- Consistency across the entire codebase

When uncertain:

**Never invent behavior.**

Instead:

- Inspect existing code
- Follow existing implementation patterns
- Ask for clarification if required

Never hallucinate APIs, functions, database schemas, components, routes, libraries, or business logic.

---

# DOCUMENTATION FIRST (MANDATORY)

Before making **any implementation**, the AI **must always inspect the `/docs` directory first**.

The `/docs` folder is the primary source of truth for:

- System architecture
- Feature documentation
- Database design
- API contracts
- UI standards
- Coding conventions
- Business rules
- Workflows
- Folder structure
- Naming conventions

Never implement features that contradict the documentation.

If documentation conflicts with code:

- Prefer the documentation
- Inform the user about the inconsistency
- Do not silently choose one

If documentation does not exist for a requested feature:

State that documentation is unavailable instead of fabricating behavior.

---

# AGENT SKILLS (MANDATORY)

Before solving any problem, always review the available skills inside:

```
.agents/
```

Applicable skills must always be reused before inventing a new implementation.

The AI should:

- Reuse documented workflows
- Follow established engineering practices
- Apply existing coding patterns
- Reuse helper utilities
- Reuse services
- Reuse shared components

Never duplicate logic that already exists.

If multiple skills apply:

Use the most specialized skill first.

---

# EXISTING CODE HAS PRIORITY

Before writing new code:

Search for existing:

- Components
- Services
- Hooks
- Utilities
- Types
- Constants
- API handlers
- Validation logic

Reuse them whenever possible.

Never duplicate functionality.

---

# NO HALLUCINATIONS

Strictly prohibited:

- Inventing APIs
- Inventing endpoints
- Inventing database columns
- Inventing environment variables
- Inventing configuration files
- Inventing package capabilities
- Inventing framework features
- Inventing business rules

Every implementation must be supported by:

- Documentation
- Existing code
- Official framework behavior
- Explicit user instruction

If uncertain:

Stop and explain the missing information.

---

# TOKEN OPTIMIZATION

Always optimize for minimal token usage without sacrificing quality.

Avoid:

- Repeating explanations
- Repeating code
- Repeating documentation
- Restating obvious information

Prefer:

- Existing utilities
- Existing abstractions
- Shared constants
- Shared types
- Shared hooks

Responses should be concise while remaining complete.

---

# IMPLEMENTATION STRATEGY

Before coding:

1. Read `/docs`
2. Review `.agents`
3. Inspect existing implementation
4. Identify reusable code
5. Implement only the requested changes

Never skip these steps.

---

# UI DEVELOPMENT RULES

All UI must be:

- Minimalist
- Modern
- Clean
- Accessible
- Responsive
- Professional
- Consistent

Preferred stack:

- shadcn/ui
- Radix UI
- Tailwind CSS
- Lucide Icons

Design principles:

- Strong spacing
- Clear hierarchy
- Minimal borders
- Consistent typography
- Flat surfaces
- Subtle shadows only
- High contrast
- Large click targets

Avoid:

- Decorative gradients
- Glassmorphism
- Neumorphism
- Heavy animations
- Inconsistent spacing
- Random color usage

Every screen should look like it belongs to the same design system.

---

# BACKEND DEVELOPMENT RULES

Backend code must be:

- Modular
- Predictable
- Secure
- Testable
- Maintainable

Separate concerns into:

- Controllers
- Services
- Repositories
- Validators
- DTOs
- Middleware
- Utilities
- Types

Business logic must never exist inside:

- Routes
- Controllers
- UI Components

Keep controllers thin.

Move logic into services.

---

# DATABASE RULES

Never duplicate data.

Always:

- Normalize appropriately
- Reuse relationships
- Validate inputs
- Handle null cases
- Consider indexing
- Respect foreign keys

Never assume schema changes.

---

# API RULES

API endpoints must:

- Validate input
- Return consistent responses
- Handle errors gracefully
- Use meaningful status codes
- Never expose sensitive information

Keep response structures consistent across the project.

---

# FILE SIZE LIMITS (STRICT)

Target limits:

Component/File

≤ 500 lines

Preferred

≤ 300 lines

If approaching 500 lines:

- Split components
- Extract hooks
- Extract utilities
- Extract services
- Extract constants
- Extract reusable UI
- Extract helper functions

Never create massive files.

---

# EDITING RULES

Modify only what is necessary.

Do NOT:

- Rewrite entire files unnecessarily
- Refactor unrelated code
- Rename unrelated files
- Change architecture without request
- Reformat unrelated sections

Preserve existing behavior.

Keep changes:

- Small
- Focused
- Reviewable

---

# CLEAN CODE STANDARDS

Use:

- Clear naming
- Small functions
- Single responsibility
- Predictable structure
- Consistent formatting
- Explicit logic

Avoid:

- Deep nesting
- Long functions
- Large switch statements
- Duplicate logic
- Hidden side effects
- Magic numbers
- Premature optimization

Code should explain itself.

---

# COMMENTING RULES

Every new function, class, hook, service, and complex logic block should include concise, meaningful comments.

Comments should explain:

- Purpose
- Intent
- Non-obvious decisions
- Edge cases
- Important assumptions

Do **not** comment trivial code.

Good:

```ts
// Prevent duplicate archive numbers during concurrent uploads.
```

Bad:

```ts
// Increment i.
i++;
```

Favor self-documenting code supported by meaningful comments where they add value.

---

# ERROR HANDLING

Always:

- Validate inputs
- Handle null values
- Handle undefined values
- Catch expected failures
- Return informative errors
- Log meaningful debugging information when appropriate

Never swallow errors silently.

---

# PERFORMANCE

Prefer:

- Memoization when appropriate
- Lazy loading
- Pagination
- Virtualization for large datasets
- Efficient queries
- Reusable computations

Avoid:

- Unnecessary renders
- Duplicate requests
- Expensive loops
- Recomputing values repeatedly

---

# SECURITY

Never expose:

- Secrets
- API keys
- Passwords
- Tokens
- Internal identifiers

Always:

- Validate inputs
- Sanitize user data
- Escape unsafe output
- Follow least-privilege principles

---

# TESTING AWARENESS

When modifying functionality:

Consider:

- Existing tests
- Edge cases
- Failure scenarios
- Empty states
- Invalid inputs
- Permission handling

Never introduce breaking changes without necessity.

---

# TERMINAL RULES (STRICT)

The AI must **never execute terminal commands**.

The user controls the terminal.

When terminal interaction is required:

Provide commands inside code blocks.

Example:

```bash
npm install
npm run dev
```

Wait for the user to execute commands.

Never assume output.

Never claim success.

Never fabricate terminal logs.

---

# RESPONSE FORMAT

Unless otherwise requested, structure responses as:

1. Findings (if applicable)
2. Implementation
3. Required Commands (if applicable)
4. Next Action

Keep responses concise.

Avoid unnecessary summaries.

---

# REPOSITORY SAFETY

Do not:

- Modify unrelated files
- Create unnecessary files
- Delete files without instruction
- Change project architecture without approval
- Introduce unnecessary dependencies

Maintain repository consistency.

---

# CONSISTENCY CHECK

Every implementation should match:

- Existing folder structure
- Existing naming conventions
- Existing coding style
- Existing architecture
- Existing design system

Never introduce a second way of doing the same thing.

---

# DEPENDENCY RULES

Before adding a dependency:

Verify whether the functionality already exists.

Do not introduce new packages without clear justification.

Prefer native framework capabilities whenever practical.

---

# QUALITY GATE

Before finishing any implementation, verify:

- Documentation reviewed
- Relevant `.agents` skills applied
- Existing implementation inspected
- Existing utilities reused
- Existing services reused
- Existing components reused
- Existing patterns followed
- No hallucinated implementation
- File size limits respected
- Clean architecture maintained
- Responsive UI preserved (if applicable)
- Accessibility maintained (if applicable)
- Minimal changes made
- No unnecessary files created
- No unnecessary dependencies added
- Meaningful comments included
- Terminal left to the user

If any check fails:

Revise the implementation before responding.

---

# GOLDEN RULE

**Read first. Reuse second. Implement third. Verify last.**

The AI should behave like a senior software engineer contributing to a production codebase—delivering precise, minimal, maintainable, and well-documented changes that respect the project's existing architecture and standards.