Caμs Tree-hole Project
==============

|  Directory/File  |         Description                   |         Content         |
| ---------------- |:-------------------------------------:| ----------------------- |
| routes/          | Controllers and routers               |                         |
| views/           | Templates based on Swig               |                         |
| public/          | static files (js, css, img)           |                         |
| config/          | Middlewares                           | All configuration files |
| test/            | Test units                            | *.spec.js               |
| app.js           | Entry point (create express server)   |                         |
| Gruntfile.js     | Makefile                              |                         |

# Development Guide
## Preperation
First install Node.js and then run
```bash
$ npm install
```
Second install [MongoDB](http://www.mongodb.org/)

## Test
Test your code.
```bash
$ grunt
```

## Preview
```bash
$ grunt serve
```

## Code Format
Please install plugin "editorconfig" to your code editor first [EditorConfig](http://editorconfig.org/)

## Setup Guide for WebStorm IDE
Create an empty project based on exist code. Then edit run/debug configurations.
Create a new Node.js configuration.
Fill "Javascript file" with "app.js", and add environment variables PORT=9000 and ENV=development.

If you are going to run test units, create a new Mocha configuration.
Select the test folder for "test directory", and add an environment variable NODE_ENV=test.

Note that MongoDB will not start automatically when you run your project.
However, you can run MongoDB as a background OS service (google how to do this for your operating system).

## Guide

Every request object has a filed `db` which stores an instance created by `MongoClient`'s `db` method.

```js
app.route('/test', function(req, res) {
  req.db.collection('holes').find().toArray(function(err, result) {
    res.status(200).send(result);
  });
});
```

[MongoDB API Documentation](http://mongodb.github.io/node-mongodb-native/1.4/contents.html)
