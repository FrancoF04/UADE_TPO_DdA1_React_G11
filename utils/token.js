function base64UrlDecode(segment) {
  const padded = segment.replace(/-/g, '+').replace(/_/g, '/');
  const withPadding = padded + '='.repeat((4 - (padded.length % 4)) % 4);
  return atob(withPadding);
}

export function decodeToken(token) {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    return JSON.parse(base64UrlDecode(payload));
  } catch {
    return null;
  }
}

// exp viene en segundos epoch
export function getTokenExpiry(token) {
  const payload = decodeToken(token);
  return payload?.exp ? payload.exp * 1000 : null;
}

export function isExpired(epochMs) {
  return epochMs == null || Date.now() >= epochMs;
}
