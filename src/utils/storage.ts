/**
 * Storage URL & Path Helpers for Supabase Storage
 */

export function getPublicStorageUrl(bucket: string, path: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

export function sanitizeFileName(fileName: string): string {
  const timestamp = Date.now();
  const cleanName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
  return `${timestamp}_${cleanName}`;
}
