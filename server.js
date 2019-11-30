// server.js
// where your node app starts

// init project
const express = require('express');
const request = require('sync-request');

const app = express();
app.use(express.json());


app.get('/', function(req,  response) {
  response.sendfile('index.html');
});
         
app.post('/', function(req,  response) {
  
  const { repository, sender } = req.body;

  const repo = repository.name;
  const stars = repository.stargazers_count;
  const username = sender.login;
  const url = sender.html_url;

  try {
    sendToSlack(repo, stars, username, url);
  } catch (err) {
    console.log(err);
    response.status(500).json({error: err});
    return;
  }
  
   response.json({
      message: "Event processed"
    });
});



const sendToSlack = (repo, stars, username, url) => {
  const text = [
    `New Github star for _${repo}_ repo!`,
    `The *${repo}* repo now has *${stars}* stars! :tada:.`,
    `Your new fan is <${url}|${username}>`
  ].join('\n');
  const resp = request('POST', process.env.WEBHOOK_URL, {
    json: { text }
  });

  resp.getBody();
}

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
