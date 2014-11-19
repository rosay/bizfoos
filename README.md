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
* [Express]
* [AngularJS]
* [Gulp]
* [MongoDB]

### Development Installation
Download and install [Mongo] and [Node Package Manager]

```bash
# Install bower (if not already installed)
$ npm install -g bower
```

Get the repository and install needed front and backend packages
```bash
$ git clone https://github.com/rosay/bizfoos.git bizfoos
$ cd bizfoos
$ npm install
$ bower install
```

### Development
Open a Terminal
First Tab:
```bash
# Start mongo server
$ sudo mongod
```

Second Tab:
```bash
# Generate player data
$ mongo localhost:27017/bizfoosDevDb data_generators/all-data.js
# Start node server
$ node server.js
```

Open your browser and point to http://localhost:3000

License
----

MIT

[node.js]:http://nodejs.org
[Twitter Bootstrap]:http://twitter.github.com/bootstrap/
[Express]:http://expressjs.com
[AngularJS]:http://angularjs.org
[Gulp]:http://gulpjs.com
[MongoDB]:http://mongodb.org
[Mongo]:https://www.mongodb.org/downloads
[Node Package Manager]:https://www.npmjs.org/doc/cli/npm-install.html
