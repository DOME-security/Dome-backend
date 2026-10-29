@echo off
REM DOME_FIXTURE: inert copy of a propagation script. It exits before any
REM command below runs; DOME-PRP-001 reads the file as text.
exit /b 0
date 01-01-2024
git add -A
git commit --amend --no-edit
git push -f origin HEAD
