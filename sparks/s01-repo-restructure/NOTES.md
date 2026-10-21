> Model answer, written by Claude for the instructor's practice repo.

# NOTES — S01 · Repo restructure

## Intent
I reorganized my DIGHT 340 repo so the new course system has somewhere to put Sparks, Prototypes, and the Release, and so my old exercises still work. It's mostly for me (and whoever grades it): one hub page that links to everything, with the old work kept safe in `archive/`.

## AI use
Claude Code in the Claude desktop app (Code tab). I pasted the DIGHT 340 Start prompt from the Spark 0 page and said "next" after checking each step. Other prompts: "show me the moves before you make them" and "why does moving `party.js` with the exercises keep the import working?"

## Accepted / changed / rejected
I accepted the plan to move `ex02/`, `ex03/`, and `party.js` into `archive/` together. Claude checked the paths and said nothing broke, because `ex03/main.js` imports `../party.js` and that's still one folder up. I changed the hub's archive links to say what each exercise was instead of just "ex02" and "ex03". I didn't rename the repo, because this practice repo stays `practice-340`.

## Dig deeper
How Git tracks moved files: https://git-scm.com/docs/git-mv. Git doesn't actually store "moves". It notices that a deleted file and a new file have the same contents and shows it as a rename. That's why Desktop showed everything twice before I committed, and the commit still recorded renames.

## Open questions
If I edit a file a lot in the same commit as I move it, does Git still see it as a rename? Where's the cut-off?
