# Bizfoos

This readme is about 10% complete. I just wanted to stub something out.

This is a foosball app designed to track:
  - Player stats
  - Team stats
  - Series stats
  - Who knows what else!

### Technologies
Bizfoos app made possible by
* [node.js]
* [Twitter Bootstrap]
* [express.js]
* [AngularJS]
* [Gulp]
* [MongoDB]

### Development Installation
[Download and install MongoDB]

Get the repository and install needed front and backend packages
```bash
$ git clone https://github.com/rosay/bizfoos.git bizfoos
$ cd bizfoos
$ npm i -d
$ bower install
```

### Development
Open a Terminal
First Tab:
```bash
$ sudo mongod # Start mongo server
```

Second Tab:
```bash
$ mongo localhost:27017/bizfoosTestDb data_generators/players.js	# Generate player data
$ node server.js 													# Start node server
```

Open your browser and point to http://localhost:3000

License
----

MIT

**
[node.js]:http://nodejs.org
[Twitter Bootstrap]:http://twitter.github.com/bootstrap/
[express]:http://expressjs.com
[AngularJS]:http://angularjs.org
[Gulp]:http://gulpjs.com
[MongoDB]:http://mongodb.org
[Download and install MongoDB]:https://www.mongodb.org/downloads
