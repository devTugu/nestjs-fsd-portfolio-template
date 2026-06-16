import { TokenPair } from '@shared/types/pagination';

export type LoginResult =
  | TokenPair
  | { requiresMfa: true; mfaToken: string };

export function isMfaRequired(
  result: LoginResult,
): result is { requiresMfa: true; mfaToken: string } {
  return 'requiresMfa' in result && result.requiresMfa === true;
}
