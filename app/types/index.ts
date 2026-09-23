export type FormatOption = 'mp3' | 'mp4' | 'wav';
export type AudioBitrate = '128' | '192' | '256' | '320';

export interface DownloadParams {
  url: string;
  format: FormatOption;
  bitrate: AudioBitrate;
}