// el token no es un JWT firmado, es un base64url con un JSON adentro
function base64UrlDecode(segment) {
  const padded = segment.replace(/-/g, '+').replace(/_/g, '/');
  const withPadding = padded + '='.repeat((4 - (padded.length % 4)) % 4);
  return atob(withPadding);
}

export function decodeToken(token) {
  if (!token) return null;
  try {
    const json = base64UrlDecode(token);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getTokenExpiry(token) {
  const payload = decodeToken(token);
  if (!payload?.expiresAt) return null;
  const epoch = Date.parse(payload.expiresAt);
  return Number.isNaN(epoch) ? null : epoch;
}

export function isExpired(epochMs) {
  return epochMs == null || Date.now() >= epochMs;
}
