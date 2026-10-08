const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

const MANIFEST = {
  id: 'org.cizgimax.nuvio',
  version: '1.0.0',
  name: 'ÇizgiMax Scraper',
  description: 'ÇizgiMax sitesindeki çizgi film ve animeleri Nuvio ile izleyin.',
  resources: ['stream'],
  types: ['series', 'anime'],
  idPrefixes: ['tt', 'cizgimax']
};

app.get('/manifest.json', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json(MANIFEST);
});

app.get('/stream/:type/:id.json', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { type, id } = req.params;

  try {
    const targetUrl = `https://cizgimax.online/${id}`; 
    const response = await axios.get(targetUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });

    const $ = cheerio.load(response.data);
    const iframeSrc = $('iframe').attr('src');

    if (iframeSrc) {
      return res.json({
        streams: [
          {
            title: 'ÇizgiMax - Türkçe Dublaj',
            url: iframeSrc.startsWith('//') ? `https:${iframeSrc}` : iframeSrc
          }
        ]
      });
    }
  } catch (error) {
    console.error('ÇizgiMax Stream Hatası:', error.message);
  }

  res.json({ streams: [] });
});

app.listen(7000, () => console.log('ÇizgiMax Nuvio Eklentisi 7000 portunda aktif!'));
