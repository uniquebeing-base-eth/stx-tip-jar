const STORAGE_PREFIX = 'stx-tip-jar:pending-create:';
const MAX_PENDING_AGE_MS = 30 * 60 * 1000;

export interface PendingTipJarCreate {
  txId: string;
  createdAt: number;
}

function getStorageKey(address: string) {
  return `${STORAGE_PREFIX}${address}`;
}

export function setPendingTipJarCreate(address: string, txId: string) {
  if (typeof window === 'undefined') return;

  const value: PendingTipJarCreate = {
    txId,
    createdAt: Date.now(),
  };

  window.sessionStorage.setItem(getStorageKey(address), JSON.stringify(value));
}

export function getPendingTipJarCreate(address: string | undefined): PendingTipJarCreate | null {
  if (typeof window === 'undefined' || !address) return null;

  const raw = window.sessionStorage.getItem(getStorageKey(address));
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as PendingTipJarCreate;
    const isExpired = Date.now() - parsed.createdAt > MAX_PENDING_AGE_MS;

    if (isExpired || !parsed.txId) {
      window.sessionStorage.removeItem(getStorageKey(address));
      return null;
    }

    return parsed;
  } catch {
    window.sessionStorage.removeItem(getStorageKey(address));
    return null;
  }
}

export function clearPendingTipJarCreate(address: string | undefined) {
  if (typeof window === 'undefined' || !address) return;
  window.sessionStorage.removeItem(getStorageKey(address));
}