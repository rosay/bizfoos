# Bizfoos

#####This is a foosball app designed to track: player and team stats

### Technologies
Bizfoos app made possible by using
* [node.js]
* [Twitter Bootstrap]
* [Express]
* [AngularJS]
* [Gulp]
* [MongoDB]

### Install needed packages
1. Download and install [Mongo] and [node.js]

2. Install bower (if needed)
```bash
$ npm install -g bower
```

3. Get the repository and install needed front and backend packages
```bash
$ git clone https://github.com/rosay/bizfoos.git bizfoos
$ cd bizfoos
$ npm install
$ bower install
```

### Development Environment Setup
1. The site requires mongod and node to be running. Run the start_mongo_node.sh.
```bash
$ bash start_mongo_node.sh
```

2. (Optional) Run this if it's your first time running the project or you want to clear out all existing data and repopulate
```bash
$ bash dev-data/reset_data.sh
```

3. Open your browser and point to http://localhost:3000

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
