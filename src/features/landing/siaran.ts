/** Data kanal YouTube GKJ Mijen + tipe video, dipakai bersama oleh API /api/siaran dan komponen landing. */
export const KANAL_YOUTUBE = {
  id: 'UC9yDMX-0sadi5-PV2U-GilQ',
  handle: '@gkjmijensemarang7380',
  url: 'https://www.youtube.com/@gkjmijensemarang7380',
  urlLive: 'https://www.youtube.com/@gkjmijensemarang7380/streams',
};

export interface VideoSiaran {
  id: string;
  judul: string;
  /** ISO 8601 */
  tanggal: string;
  thumb: string;
  url: string;
  status: 'selesai' | 'live' | 'akan-tayang';
  ditonton?: number;
}

export interface SiaranResponse {
  sumber: 'api' | 'rss' | 'cadangan';
  videos: VideoSiaran[];
}
