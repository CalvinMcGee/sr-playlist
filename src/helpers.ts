const generateM3UHeader = (): string => {
  return '#EXTM3U\n';
}

const generateM3UItem = (index: number = 0, item: {name: string; url: string}): string => {
  return [`#EXTINF:${index},${item.name}`,`${item.url}`].join('\n');
}

export function generateM3U (items: Array<{name: string; url: string}>): string {
  let output = generateM3UHeader();

  for (let i = 0; i < items.length; i++) {
    output = output + '\n' + generateM3UItem(i, items[i]);
  }
  return output;
}

export function formatUrl (template: string, id: string, quality: 'lo'|'normal'|'hi') {
  const qualityString: string = quality === 'normal' ? '' : quality;
  return template
    .replace('[channelid]', id)
    .replace('[quality]', qualityString)
    .replace('--', '-')
    .replace('-.', '.');
};

export function groupChannelsByType (
  channels: Array<{id: number, name: string, channeltype: string}> = []
  ): {[key: string]: Array<{id: number, name: string}>} {
  let out: {[key: string]: Array<{id: number, name: string}>} = {};
  channels.forEach((channel) => {
    if (out.hasOwnProperty(channel.channeltype)) {
      out[channel.channeltype].push(channel);
    } else {
      out[channel.channeltype] = [channel];
    }
  });
  return out;
}