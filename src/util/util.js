const fetch = require('node-fetch');

const url = `https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${process.env.GAMEID}/scores`;

const refreshLeaderBoard = async () => {
  const resp = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await resp.json();
  return data.result;
};

module.exports = refreshLeaderBoard;