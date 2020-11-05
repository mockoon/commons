# Contributing to Mockoon-commons

> **[Guidelines from Mockoon's main repository](https://github.com/mockoon/mockoon/blob/master/CONTRIBUTING.md) must be followed.**
> **Specific guidelines below applies to this repository:**

## Application dependence

`@mockoon/commons` is a library used by Mockoon [main application](https://github.com/mockoon/mockoon) and [Mockoon's CLI](https://github.com/mockoon/cli).

Dependence between the three projects is highly probable, and having to contribute solely to this repository may be rare. 

Therefore, contributions to this repository should always stem from a parent's issue opened in the main application's or the CLI's repositories. 

## Contribution rules

The following rules apply to all contributions:

- Always search among the opened and closed issues. Assigned issues are already being worked on, and, most of the time, cannot be reassigned.
- Bug reports, enhancements, and features must be discussed with the maintainers regarding the implementation, changes to the UI, etc.
- Pull requests must refer to an open issue which must itself stem from a main repository's issue. Pull requests not solving existing issues may not be accepted.
- Issues and PR must follow the provided templates.

## Work on your feature or bugfix

- Start your `feature` or `fix` from `main`
- Preferably squash your commits, except when it makes sense to keep them separate (one refactoring + feature development)
- Do not forget to add "Closes #xx" in one of the commit messages or in the pull request description (where xx is the GitHub issue number)

Branches naming convention:
- features and enhancements: `feature/name-or-issue-number`
- bug fixes: `fix/name-or-issue-number`

## Open a pull request

Open a pull request to be merge in the `main` branch. All branches should start from `main` and must be merged into `main`.
Ask maintainers to review the code and be prepared to rework your code if it does not match the style or do not follow the way it's usually done (typing, reducer, etc).
