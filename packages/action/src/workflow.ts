import { appendFileSync } from 'node:fs';

/** Reads an action input the way the runner exposes it (`INPUT_<NAME>`). */
export function input(env: NodeJS.ProcessEnv, name: string, fallback = ''): string {
  return (env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] ?? fallback).trim();
}

export function booleanInput(env: NodeJS.ProcessEnv, name: string): boolean {
  const value = input(env, name, 'false').toLowerCase();
  if (value === 'true') return true;
  if (value === 'false' || value === '') return false;
  throw new Error(`input ${name} must be true or false`);
}

function escapeData(s: string): string {
  return s.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
}

function escapeProperty(s: string): string {
  return escapeData(s).replace(/:/g, '%3A').replace(/,/g, '%2C');
}

/**
 * Formats a workflow command such as an `::error` annotation. Property values
 * and messages are escaped so a crafted file name cannot start a new command.
 */
export function command(name: string, properties: Record<string, string | number | undefined>, message: string): string {
  const props = Object.entries(properties)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${k}=${escapeProperty(String(v))}`)
    .join(',');
  return `::${name}${props ? ` ${props}` : ''}::${escapeData(message)}\n`;
}

export function setOutput(env: NodeJS.ProcessEnv, name: string, value: string): void {
  const file = env.GITHUB_OUTPUT;
  if (!file) return;
  const delimiter = `dome_${Math.random().toString(36).slice(2)}`;
  appendFileSync(file, `${name}<<${delimiter}\n${value}\n${delimiter}\n`);
}

export function appendSummary(env: NodeJS.ProcessEnv, markdown: string): void {
  if (env.GITHUB_STEP_SUMMARY) appendFileSync(env.GITHUB_STEP_SUMMARY, markdown);
}
