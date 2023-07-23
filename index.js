
const axios = require('axios');

const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.get('/video/download', async (req, res) => {

    const { url } = req.query;

    if(!url) return res.status(400).json({ error: 'Missing URL parameter' });

    const vaildUrls = [ "https://www.tiktok.com/", "http://www.tiktok.com", "https://www.tiktok.com", "http://www.tiktok.com/"]

    if(!vaildUrls.some(vaildUrl => url.includes(vaildUrl))) return res.status(400).json({ error: 'Invalid URL' });

    const id = url.split("/")[5].split("?")[0];
    const respone = await axios.get(`https://api16-normal-c-useast1a.tiktokv.com/aweme/v1/feed/?aweme_id=${id}`);
    
    const json = respone.data;
    const video = json.aweme_list[0].video.play_addr.url_list[0];

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', `attachment; filename=${id}.mp4`);
    const videoResponse = await axios.get(video, { responseType: 'stream' });
    videoResponse.data.pipe(res);
});

app.listen(3000, () => console.log('Server started'));
