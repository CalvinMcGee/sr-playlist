import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Api from '../api';
import { formatUrl, generateM3U, groupChannelsByType } from '../helpers';
import { Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, NativeSelect } from '@mui/material';

const api = new Api();

const generatedM3U = (
  template: {id: number, url: string},
  quality: 'lo'|'normal'|'hi',
  channels: Array<{id: number, name: string, channeltype: string}>
): string => {
  return generateM3U(channels.map((channel) => {
    return {
      name: channel.name,
      url: formatUrl(template.url, channel.id.toFixed(), quality),
    };
  }));
}

// Example
console.log(generatedM3U(
  {id: 2, url: "https://sverigesradio.se/topsy/direkt/srapi/[channelid]-[quality].mp3"},
  'normal',
  [
    {id: 132 ,name: 'P1', channeltype: 'Riks',},
    {id: 163 ,name: 'P2', channeltype: 'Riks',},
  ]
));

export default async function Home() {
  const templates = await api.templates();
  const channelsRaw = await api.channels(2);
  const channels = groupChannelsByType(channelsRaw?.channels);

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h2" component="h1">
          SR channels
        </Typography>
        <FormControl fullWidth>
          <InputLabel variant="standard" htmlFor="uncontrolled-native">
            Välj ljudformat
          </InputLabel>
          <NativeSelect
            defaultValue={templates?.urltemplates?.[0]}
            inputProps={{
              name: 'template',
              id: 'uncontrolled-native',
            }}
          >
            {templates?.urltemplates?.map((template) =>
              <option key={template.id} value={template.id}>{template.url}</option>
            )}
          </NativeSelect>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel variant="standard" htmlFor="uncontrolled-native">
            Välj ljudkvalitet
          </InputLabel>
          <NativeSelect
            defaultValue='normal'
            inputProps={{
              name: 'quality',
              id: 'uncontrolled-native',
            }}
          >
            <option value="lo">Låg kvalitet</option>
            <option value="normal">Normal kvalitet</option>
            <option value="hi">Hög kvalitet</option>
          </NativeSelect>
        </FormControl>
        {Object.keys(channels).map((type) =>
          <div>
            <Typography variant="h3" component="h2">{type}</Typography>
            <FormGroup>
              {channels[type].map((channel) =>
                <FormControlLabel control={<Checkbox id={channel.id.toString()} />} label={channel.name} />
              )}
            </FormGroup>
          </div>
        )}
      </Box>
    </Container>
  );
}
