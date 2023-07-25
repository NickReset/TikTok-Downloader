const axios = require('axios');

const express = require('express');

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.get('/video/download', async (req, res) => {

    const { url } = req.query;

    if(!url) return res.status(400).json({ error: 'Missing URL parameter' });

    const vaildUrls = [ "https://www.tiktok.com/", "http://www.tiktok.com", "https://tiktok.com", "http://tiktok.com/"]

    if(!vaildUrls.some(vaildUrl => url.includes(vaildUrl))) return res.status(400).json({ error: 'Invalid URL' });

    try {
        const id = url.split("/")[5].split("?")[0];
        const respone = await axios.get(`https://api16-normal-c-useast1a.tiktokv.com/aweme/v1/feed/?aweme_id=${id}`);
        
        const json = respone.data;
        const video = json.aweme_list[0].video.play_addr.url_list[0];
        const videoID = json.aweme_list[0].aweme_id;

        res.setHeader('Content-Type', 'video/mp4');
        res.setHeader('Content-Disposition', `attachment; filename=${videoID}.mp4`);

        const response = await axios.get(video, { responseType: 'stream' });
        response.data.pipe(res);
    } catch(err) {
        return res.status(400).json({ error: 'Invalid URL' });
    }
});
app.listen(3000, () => console.log('Server started'));