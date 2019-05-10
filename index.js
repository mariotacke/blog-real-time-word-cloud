const tmi = require('tmi.js');
const redis = require('redis');
const bluebird = require('bluebird');
const express = require('express');
const path = require('path');

bluebird.promisifyAll(redis);

const options = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN,
  },
  channels: [
    process.env.CHANNEL_NAME,
  ],
};

const tmiClient = new tmi.client(options);
const redisClient = redis.createClient(process.env.REDIS_URL);

tmiClient.on('connected', onConnectedHandler);
tmiClient.on('message', onMessageHandler);

tmiClient.connect();

const app = express();

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/channel/:channel/words', async function (req, res) {
  const channel = `#${req.params.channel}`;
  const args = [channel, '0', '50', 'WITHSCORES'];
  const scores = [];

  const range = await redisClient.zrevrangeAsync(args);

  for (let i = 0; i < range.length; i += 2) {
    scores.push({ 
      key: range[i], 
      value: parseInt(range[i + 1]),
    });
  }

  res.json({ channel, scores });
});

app.listen(process.env.PORT);

async function onConnectedHandler (address, port) {
  console.log(`* Connected to ${address}:${port}`);
}

async function onMessageHandler (target, context, message, self) {
  const words = message.replace(/,/g, '').split(' ');

  for (let i = 0; i < words.length; i++) {
    await redisClient.zincrbyAsync(target, 1, words[i]);
  }
}