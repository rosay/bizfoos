# Bizfoos

#####An app for tracking foosball game and player statistics.

### Technologies
Bizfoos app made possible by using
* [Twitter Bootstrap]
* [Node]
* [Express]
* [AngularJS]
* [MongoDB]

### Install needed packages
Download and install [Mongo] and [Node]

Install bower (if needed)
```bash
$ npm install -g bower
```

Clone the repository and install needed front and backend packages
```bash
$ git clone https://github.com/rosay/bizfoos.git bizfoos
$ cd bizfoos
$ npm install
$ bower install
```

### Development Environment Setup
The site requires mongod and node to be running. Run the start_mongo_node.sh.
```bash
$ bash start_mongo_node.sh
```
Note: we don't currently have scripts for starting the project in Windows. We're happy to have contributors.

(Optional) Run this if it's your first time running the project or you want to clear out all existing data and repopulate
```bash
$ bash dev-data/reset_data.sh
```

Open your browser and point to http://localhost:3000

License
----

MIT

[Node]:http://nodejs.org
[Twitter Bootstrap]:http://twitter.github.com/bootstrap/
[Express]:http://expressjs.com
[AngularJS]:http://angularjs.org
[MongoDB]:http://mongodb.org
[Mongo]:https://www.mongodb.org/downloads
