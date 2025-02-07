import { AvailableTheme, availableThemes, Theme } from './variables';
import { webcrypto } from 'crypto';

function isAvailableTheme(theme: Theme): theme is AvailableTheme {
  return availableThemes.includes(theme as AvailableTheme);
}

export function resolveTheme(theme: Theme): Theme {
  if (!theme) return 'light';
  if (isAvailableTheme(theme)) return theme;
  return 'custom';
}

export function getThemeUrl(resolvedTheme: Theme, theme: Theme): Theme {
  return resolvedTheme === 'custom' ? theme : `/themes/${resolvedTheme}.css`;
}

export function getOriginHost(origin: string) {
  try {
    const url = new URL(origin);
    url.searchParams.delete('giscus');
    return { origin: url.toString(), originHost: url.origin };
  } catch (err) {
    return { origin: '', originHost: '' };
  }
}

export function cleanAnchor(origin: string) {
  // Make sure the anchor is not followed by / as it means the website probably
  // is an SPA that uses anchor-based routing.
  let length = origin.length;
  const split = origin.split(/#(?!\/)/);
  if (split.length > 1) {
    length -= split.pop().length + 1;
  }
  return origin.substring(0, length);
}

export function cleanSessionParam(url: string) {
  try {
    const newUrl = new URL(url);
    newUrl.searchParams.delete('giscus');
    return newUrl.toString();
  } catch (err) {
    return url;
  }
}

export function isEmpty(v: unknown) {
  return v === null || v === undefined || v === '' || Number.isNaN(v);
}

export async function clipboardCopy(text: string) {
  await navigator.clipboard.writeText(text);
}

export function parseRepoWithOwner(repoWithOwner: string) {
  const [owner, name] = repoWithOwner.split('/');
  return { owner, name };
}

export function resizeTextArea(textarea: HTMLTextAreaElement) {
  const maxHeight = 270;
  textarea.style.height = `0px`;
  const height = textarea.scrollHeight <= maxHeight ? textarea.scrollHeight : maxHeight;
  textarea.style.height = `${height}px`;
}

export async function digestMessage(message: string, algorithm: AlgorithmIdentifier = 'SHA-1') {
  const crypto = webcrypto as unknown as Crypto;

  // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#converting_a_digest_to_a_hex_string
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest(algorithm, msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}
