Caμs Tree-hole Project
==============

|  目录/文件   |      说明      |      包含       |
| ------------ |:--------------:| --------------- |
| routes/      | 路由Controller |                 |
| views/       | 模板，基于Swig |                 |
| public/      | js, css, img   |                 |
| config/      | 中间件         |    所有的配置   |
| test/        | 测试            |   *.spec.js    |
| app.js       | 入口, 创建server |                 |
| Gruntfile.js | Makefile       |                 |

# Development Guide
## Preperation
First install Node.js and then run
```bash
$ npm install
```
Second install [mongodb](http://www.mongodb.org/)

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
