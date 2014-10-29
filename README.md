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


## WebStorm Setup Guide

0. Choose `Open...`, and select the project root.
0. From `Run->Edit Configuration`, click add new configuration and choose Node.js.
0. Type `app.js` in `Javascript file`, click `...` of Environment settings, add `PORT=9000` and `NODE_ENV=development`. Click `apply`.
0. Again click add new configuration and choose mocha. Add environment variables `NODE_ENV=test`. Click `apply`.

** Notes **: you need to run an extern MongoDB service to get this work.

[WebStorm](https://www.jetbrains.com/webstorm/)
