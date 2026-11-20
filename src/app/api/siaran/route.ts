import { NextResponse } from 'next/server';
import { KANAL_YOUTUBE, type VideoSiaran } from '@/features/landing/siaran';

/**
 * GET /api/siaran
 * Mengambil siaran ibadah terbaru dari kanal YouTube GKJ Mijen Semarang.
 *
 * Dua sumber, dipilih otomatis:
 *  1. YouTube Data API v3 (jika YOUTUBE_API_KEY diisi di .env.local)
 *     → paling akurat: hanya siaran LIVE (yang sedang tayang, akan tayang, dan yang sudah selesai).
 *  2. Feed RSS kanal (tanpa kunci) → video terbaru, disaring judul yang mengandung "ibadah"/"live".
 * Hasil di-cache 30 menit supaya tidak membebani YouTube.
 * Bila keduanya gagal, frontend memakai data cadangan di features/landing/content.ts.
 */

const CHANNEL_ID = KANAL_YOUTUBE.id;
const CACHE_DETIK = 1800;
/** Batas tunggu ke YouTube supaya landing page tidak ikut menggantung bila YouTube lambat. */
const BATAS_MS = 6000;
const JUMLAH = 7;

const decode = (s: string) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
const urlVideo = (id: string) => `https://www.youtube.com/watch?v=${id}`;

async function dariApi(key: string): Promise<VideoSiaran[]> {
  const cari = async (eventType: 'live' | 'upcoming' | 'completed', max: number) => {
    const u = new URL('https://www.googleapis.com/youtube/v3/search');
    u.search = new URLSearchParams({ part: 'snippet', channelId: CHANNEL_ID, type: 'video', eventType, order: 'date', maxResults: String(max), key }).toString();
    const r = await fetch(u, { next: { revalidate: CACHE_DETIK }, signal: AbortSignal.timeout(BATAS_MS) });
    if (!r.ok) throw new Error(`YouTube API ${r.status}`);
    const j = (await r.json()) as { items?: { id: { videoId: string }; snippet: { title: string; publishedAt: string } }[] };
    const status: VideoSiaran['status'] = eventType === 'live' ? 'live' : eventType === 'upcoming' ? 'akan-tayang' : 'selesai';
    return (j.items ?? []).map((it) => ({
      id: it.id.videoId,
      judul: decode(it.snippet.title),
      tanggal: it.snippet.publishedAt,
      thumb: thumb(it.id.videoId),
      url: urlVideo(it.id.videoId),
      status,
    }));
  };
  const [live, akan, selesai] = await Promise.all([cari('live', 1), cari('upcoming', 1), cari('completed', JUMLAH)]);
  return [...live, ...akan, ...selesai].slice(0, JUMLAH);
}

async function dariRss(): Promise<VideoSiaran[]> {
  const r = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`, { next: { revalidate: CACHE_DETIK }, signal: AbortSignal.timeout(BATAS_MS) });
  if (!r.ok) throw new Error(`RSS ${r.status}`);
  const xml = await r.text();
  const semua = xml
    .split('<entry>')
    .slice(1)
    .map((e) => {
      const id = /<yt:videoId>([^<]+)<\/yt:videoId>/.exec(e)?.[1] ?? '';
      const judul = decode(/<title>([^<]*)<\/title>/.exec(e)?.[1] ?? '');
      const tanggal = /<published>([^<]+)<\/published>/.exec(e)?.[1] ?? '';
      const views = /<media:statistics views="(\d+)"/.exec(e)?.[1];
      return { id, judul, tanggal, thumb: thumb(id), url: urlVideo(id), status: 'selesai' as const, ditonton: views ? Number(views) : undefined };
    })
    .filter((v) => v.id);
  // Utamakan siaran ibadah; jika tidak ada yang cocok, tampilkan video terbaru apa pun
  const siaran = semua.filter((v) => /ibadah|live|siaran|kebaktian|pa[sk]kah|natal/i.test(v.judul));
  return (siaran.length ? siaran : semua).slice(0, JUMLAH);
}

export async function GET() {
  const key = process.env.YOUTUBE_API_KEY;
  try {
    const videos = key ? await dariApi(key) : await dariRss();
    return NextResponse.json(
      { sumber: key ? 'api' : 'rss', videos },
      { headers: { 'Cache-Control': `public, s-maxage=${CACHE_DETIK}, stale-while-revalidate=86400` } }
    );
  } catch (e) {
    // Jika API gagal (kuota habis dsb.), coba RSS sebelum menyerah
    if (key) {
      try {
        return NextResponse.json({ sumber: 'rss', videos: await dariRss() });
      } catch {
        /* lanjut ke cadangan */
      }
    }
    return NextResponse.json({ sumber: 'cadangan', videos: [], galat: String(e) }, { status: 200 });
  }
}
