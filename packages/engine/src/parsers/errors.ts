/**
 * Thrown by a parser when it refuses an input rather than risk misreading it
 * (for example nesting deep enough to exhaust the stack). The scan records
 * the file as "could not check" instead of treating it as clean.
 */
export class UncheckableInput extends Error {
  override name = 'UncheckableInput';
}
