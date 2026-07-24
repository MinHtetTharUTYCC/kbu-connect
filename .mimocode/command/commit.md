---
description: Generate a conventional git commit from current changes. Runs lint/format/test/build first if requested, then analyzes diff and shows the commit command for approval.
---

# Git Commit Workflow

## Steps

1. **Optional pre-checks** (if `$ARGUMENTS` contains `--check` or `--ci`):
   - Run `pnpm lint` (or project equivalent)
   - Run `pnpm format` (or project equivalent)
   - Run `pnpm test` (or project equivalent)
   - Run `pnpm build` (or project equivalent)
   - If any step fails, stop and report the error. Do NOT proceed to commit.

2. **Analyze changes**:
   - Run `git diff HEAD` to see all staged and unstaged changes
   - Run `git status` to see which files are modified/added/deleted
   - Run `git log --oneline -5` to check recent commit message style

3. **Generate commit command**:
   - Use conventional commit types: `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`, `perf`, `ci`, `build`
   - Write a short summary line (imperative mood, no period, no capitalized first word)
   - Add bullet-pointed file-level changes (concrete, specific)
   - Format as a single command:
     ```
     git add . && git commit -m "<type>: <short summary>

     - <change 1>
     - <change 2>
     - <change 3>" && git push
     ```

4. **Show for approval** — do NOT execute. Let the user review and approve first.

## Notes

- If the user says `@commit.md` without `--check`, skip straight to step 2 (no pre-checks).
- If the user provides extra context (e.g., "include auth.service.ts" or "dev is new branch"), incorporate it into the commit message or command.
- Match the repository's existing commit message style (check `git log`).
