export default class Api {
  templateNames() {
    return {
      2: 'MP3' ,
      3: 'AAC PLS' ,
      4: 'AAC M3U' ,
      5: 'AAC' ,
      10: 'HLS' ,
      11: 'DASH' ,
      12: 'DASH (again)' ,
    };
  }

  async templates()
    :Promise<{urltemplates: Array<{id: number, url: string}>}> {
    return this.fetch<{urltemplates: Array<{id: number, url: string}>}>('https://api.sr.se/api/v2/audiourltemplates/liveaudiotypes?format=json');
  }

  async channels(
    templateId: number,
    audioQuality: 'lo'|'normal'|'hi' = 'normal',
    size: number = 150
  ): Promise<{channels: Array<{id: number, name: string, channeltype: string}>}> {
    return await this.fetch<{channels: Array<{id: number, name: string, channeltype: string}>}>(`https://api.sr.se/api/v2/channels/?format=json&liveaudiotemplateid=${templateId}%audioquality=${audioQuality}&size=${size}`);
  }

  async fetch<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) {
      console.error('Failed to fetch data');
    }
    return res.json();
  }
}