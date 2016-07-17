Title: NoSQL Injection in MongoDB
Summary: NoSQL databases can also be attacked with the equivalent of <em>SQL injection</em> for relational databases. This post shows how this is done and how to protect your application from this technique.
Tags: MongoDB, Node
Date: JUL 17, 2016
URL: nosql-injection-in-mongodb

## TL;DR

The solution is to design your application to accept only strings from your users (never allow objects by design) and sanitize the inputs before using them ([mongo-sanitize](https:
//github.com/vkarpov15/mongo-sanitize) is a good module for this).

## SQL Injection

In relational databases, SQL Injection is a widely known attack where the malicious user may fill a web form with SQL statements in order to change existing data or to obtain more info than it's allowed to. If an application builds its queries concatenating a base statement with a variable whose value is set through a input field, this application can be susceptible to this kind of attack.

For example:

```javascript
var query = "SELECT * FROM Users WHERE name = '" + userName + "';";
```

If the userName variable is set with `John Doe'; DROP TABLE Users; --`, the result would be:

```sql
SELECT * FROM Users WHERE name = 'John Doe'; DROP TABLE Users; --';
```

As a *Users* table is a pretty common table name for most websites, the attacker could guess that a table with this name would exist without knowing for sure. He would also need luck that no foreign key would prevent the *drop table* command, but the idea is that he'll *try* and we need to *prevent* those attacks. Another example is to use `' OR '' = '` to retrieve all data instead of just one record.

In the relational world, this attack can be prevented using [prepared statements](https://en.wikipedia.org/wiki/Prepared_statement), where you use placeholders for each parameter and the database engine will not execute random SQL statements.

## NoSQL Injection

NoSQL Injection is the equivalent for the NoSQL world. The attack tries to inject code when the inputs are not sanitized and the solution is simply to sanitize them before using.

For example, using Node.js and MongoDB:

```javascript
app.post('/user', function (req, res) {

	var query = {
		username: req.body.username,
		password: req.body.password
	}

	db.collection('users').findOne(query, function (err, user) {
		console.log(user);
	});
});
```

Suppose that we receive the following request:

```
POST http://www.example.com/user HTTP/1.1
Content-Type: application/json

{
    "username": {"$ne": null},
    "password": {"$ne": null}
}
```

As `$ne` is the *not equal* operator, this request would return the first user (possibly an admin) without knowing its name or password.

The solution in this case is to sanitize the input before using them. A good options is [mongo-sanitize](https://github.com/vkarpov15/mongo-sanitize):

> It will strip out any keys that start with '$' in the input, so you can pass it to MongoDB without worrying about malicious users overwriting.

**Safe**:

```javascript
var sanitize = require('mongo-sanitize');

app.post('/user', function (req, res) {

	var query = {
		username: sanitize(req.body.username),
		password: sanitize(req.body.password)
	}

	db.collection('users').findOne(query, function (err, user) {
		console.log(user);
	});
});
```

### Mongoose

If you are using Mongoose, you don't need to sanitize the inputs. In this case, you just need to set the properties to be typed as string. If someone passes an object like `{ $ne: null }`, Mongoose will convert it to a string and no harm will be done.

### The $where operator attack

The `$where` operator has a very dangerous feature: it allows you to pass a string that will be evaluated inside your server.

To reproduce the problem, suppose that you have an online store and want to find out which users have more than X canceled orders. You could query as the following:

```javascript
var query = {
	$where: "this.canceledOrders > " + req.body.canceledOrders
}

db.collection('users').find(query).each(function(err, doc) {
	console.log(doc);
})
```

In this case, mongo-sanitize will not help you if the input string is `'0; return true'`. Your where clause will be evaluated as `this.canceledOrders > 0; return true` and **all** users would be returned.

Or you could receive `'0; while(true){}'` as input and suffer a DoS attack.

It also works for string inputs, like:

```javascript
var query = {
	$where: "this.name === '" + req.body.name + "'"
}
```

The attack could be the string `'\'; return \'\' == \''` and the where clause would be evaluated to `this.name === ''; return '' == ''`, that results in returning all users instead of only those who matches the clause.

The solution here is to **never** use the `$where` operator. Why? I list it here:

1. **Performance**: since you can run arbitrary JavaScript code, the `$where` operator is not optimized. That means: indexes will be ignored.

2. **Scope is not accessible**: the solution to avoid the code injection would be to add the where clause inside a function, like the following:

  ```javascript
  var query = {
	  $where: function() {
		  return this.canceledOrders > threshold
	  }
  }
  ```

  However, it **won't** work. The local variable value is not passed to Mongo and it returns the following error if executed in shell: (thanks to [@Utaal](http://stackoverflow.com/a/15615226/1476885))

  ```javascript
  Error: error: {
    "$err" : "ReferenceError: threshold is not defined\n    at _funcs2 (_funcs2:1:45) near 's.canceledOrders > threshold }' ",
    "code" : 16722
  }
  ```

  Also, the Node.js Mongo driver version 2.1 has a bug. If you pass a function to your `$where` clause it will be completely ignored and `{}` will be used instead (which returns *everything*).

3. There is always a better solution. In this case, you could use the operators `$eq` or `$gt`.

### More

If you want to read more about this subject, I suggest [this blog post](http://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html) that contains code examples and a GitHub project to reproduce the attacks.

As a rule of thumb, always follow the [principle of least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege): to minimize the potential damage that an attacker can make, do not assign full-access to your application. Run using only the permissions that you need.
