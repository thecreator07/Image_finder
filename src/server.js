const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.get('/download', async (req, res) => {
  const imageUrl = req.query.imageUrl;

  try {
    const response = await axios.get(imageUrl, { responseType: 'stream' });
    response.data.pipe(res);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error downloading image');
  }
});
let a=5;
const s= a*a
s
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
