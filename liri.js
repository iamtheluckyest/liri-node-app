var keys = require('./keys.js');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs')

process.argv.splice(0,2)
console.log('');
action(process.argv);

function action(command){
    if (command[0] === 'my-tweets'){
        getTweets();
    }
    else if (command[0] === 'spotify-this-song'){
       command.splice(0,1);
        var songQuery = command.toString().replace(',', '+');
        if (songQuery === '') {
            songQuery = 'The Sign Ace of Base';
        };
        getSong(songQuery);
    }
    else if(command[0] === 'movie-this') {
        command.splice(0,1)
        var movieName = command.toString().replace(',', '+');
        if (movieName === '') {
            movieName = 'Mr. Nobody';
        };
        getMovie(movieName);
    }
    else if (command[0] === 'do-what-it-says'){
    fs.readFile("random.txt", "utf8", function(error, data){
        if (error) {
            return console.log(error);
        }
    
        var dataArr = data.split(",");
        action(dataArr);
    
    });
    }
    else {
        console.log(command)
        console.log('This is not a valid command. Valid commands are: my-tweets, spotify-this-song, movie-this, and do-what-it-says.');
    };
};

function getTweets(){
    var client = new Twitter(keys.twitterKeys);
    client.get('statuses/user_timeline',  {
        screen_name : 'AnnalisaLiriApp',
        count : '5'
    }, function(error, tweets, response){
        if (error) {
            console.log("Sorry, there was an error with your request.");
            console.log(error);
        }
        else {
            tweets.forEach(function(value, index) {
                console.log("Message: " + tweets[index].text);
                console.log("Created at: " + tweets[index].created_at);
                console.log('')
            });
        }
    })
};

function getSong(songQuery){
    var spotify = new Spotify(keys.spotifyKeys);
    spotify.search({ type: 'track', query: songQuery, limit: '1'}, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
      var songInfo = JSON.parse(JSON.stringify(data.tracks.items[0], null, 2));
      console.log('Song: ' + songInfo.name);
      var artists = ''
      songInfo.artists.forEach(function(value, index){
        if (index > 0) {
            artists += ',';
        };
        artists +=  ' ' + songInfo.artists[index].name;
      })
      if (songInfo.artists.length > 1){
        console.log('Artists:' + artists);
      }
      else {
        console.log('Artist:' + artists);
      };
      console.log('Album: ' + songInfo.album.name);
      console.log('Preview URL: ' + songInfo.preview_url)
      });
}


function getMovie(movieName){
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";
    request(queryUrl, function(error, response, body){
        if (!error && response.statusCode === 200) {
            var movieInfo = JSON.parse(body)
            console.log(movieInfo.Title);
            console.log(movieInfo.Plot)
            console.log('Actors: ' + movieInfo.Actors);
            console.log('Released in: ' + movieInfo.Year);
            console.log('Country: ' + movieInfo.Country);
            console.log('Language: ' + movieInfo.Language);
            movieInfo.Ratings.forEach(function(value, index){
                if (movieInfo.Ratings[index].Source === 'Internet Movie Database') {
                    console.log('IMDB Rating: ' + movieInfo.Ratings[0].Value);
                }
                else if (movieInfo.Ratings[index].Source === 'Rotten Tomatoes'){
                    console.log('Rotten Tomatoes Rating: ' + movieInfo.Ratings[1].Value);
                };
            });
        }
        else {
            console.log("error");
        };
    });
}