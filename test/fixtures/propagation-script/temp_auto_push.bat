@echo off
REM DOME_FIXTURE: inert copy of a propagation script
date 01-01-2024
git add -A
git commit --amend --no-edit
git push -f origin HEAD
