Title: Serverless Notifications on AWS
Summary: A tutorial to implement the Pub/Sub pattern using AWS IoT 
Tags: Serverless, Node, AWS
Date: NOV 05, 2016
URL: serverless-notifications-on-aws

## TL;DR

This post is a tutorial that uses the Serverless Framework and AWS IoT for Serverless Notifications.

Demo: [serverless-notifications.zanon.io](http://serverless-notifications.zanon.io)
Code: [GitHub](https://github.com/zanon-io/serverless-notifications)

Multiplayer Game: [demo](http://bombermon.zanon.io) and [code](https://github.com/zanon-io/serverless-multiplayer-game)

## Serverless Notifications

Implementing real-time notifications is an easy task when you use WebSockets and a dedicated server. You can make a permanent link between the user and the website and use the publish-subscribe pattern for efficiency. The browser will subscribe to automatically receive new messages without needing a polling mechanism to constantly check for updates.

But if we are going serverless, we don't have a dedicated server. We need a cloud service that will solve this problem for us providing scalability, high availability and that charges per message and not per hour. 

In this tutorial, we are going to use AWS IoT. I know that "Internet of Things" sounds strange to be used in a website, but it supports WebSockets and is very easy to use. Besides, Amazon SNS (Simple Notification Service) has a better name, but doesn't support WebSockets.

IoT is used due to its simple messaging system. You create a "topic" and make users to subscribe to them. A message sent to this topic will be automatically shared with all subscribed users. A common use case for this is a messaging system.

If you want private messages, you just need to create private topics and restrict access. Only one user will be subscribed to this topic and you can make your system (Lambda functions) to send updates to this topic to trigger this specific user.

### Architecture

In this tutorial, we are going to implement the following architecture.

![architecture](http://zanon.io/images/posts/2016-11-05-architecture.png)

1. User makes a request to Route 53 that will is configured to reference a S3 bucket.

2. S3 bucket provides the frontend code (HTML / CSS / JavaScript / images) and the IoT client code.

3. After loading the frontend code, an Ajax request is done to the API Gateway to retrieve temporary keys.

4. The API Gateway redirects the request to a Lambda function to execute our backend code.

5. The Lambda function connects to IAM to assume a role and create temporary keys.

6. Frontend code subscribe to IoT events.

### Frontend

Configuring Route 53 and Amazon S3 to serve static files is a common use case. I've already covered how to do this in another blog post. You can take a look [here](http://zanon.io/posts/building-serverless-websites-on-aws-tutorial#host-your-website) if you want.

In our frontend code, let's start creating the **index.html** and our layout.

``` html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Serverless Notifications</title>
        <link href="bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
        <div class="container">
            <div class="row">
                <h2>Serverless Notifications</h2>
            </div>
            <div class="row">
                <input id="btn-keys" type="button" class="btn btn-primary" value='Retrieve Keys'>
                <input id="btn-connect" type="button" class="btn btn-primary" value='Connect'>
            </div>
            <div class="row">
                <input id="message" type="text">
                <input id="btn-send" type="button" class="btn btn-primary" value='Send Message'>
            </div>
            <div class="row">
                <h3>Log Messages</h3>
                <ul id="log"></ul>
            </div>
        </div>    
        <script src="jquery.min.js"></script>
        <script src="bundle.js"></script> <!-- IoT -->
        <script src="app.js"></script> <!-- retrieve keys from Lambda -->
    </body>
</html>
```

Results in: 

[![layout](http://zanon.io/images/posts/2016-11-05-layout.png)](http://serverless-notifications.zanon.io)

In this demo, the user will click on "Retrieve Keys" to make an Ajax call to API Gateway / Lambda with the objective to retrieve temporary keys to connect with our IoT messaging system. With those keys, "Connect" will create a channel and subscribe to messages. The "Send Message" button will share messages with other users (open another browser tab to test).

#### app.js

The **app.js** file is responsible to make an Ajax call to retrieve the temporary keys. The URL will be created later when we deploy our Lambda function. I've used the following address in my **app.js** file: https://j81qrc8un8.execute-api.us-east-1.amazonaws.com/dev/iot/keys

``` javascript
$(document).ready(function() {

    var iotKeys;

    $('#btn-keys').on('click', function() {
        $.ajax({
            url: "https://j81qrc8un8.execute-api.us-east-1.amazonaws.com/dev/iot/keys",
            success: function(res) {
                addLog(`Endpoint: ${res.endpoint}, 
                        Region: ${res.region}, 
                        AccessKey: ${res.accessKey}, 
                        SecretKey: ${res.secretKey}, 
                        SessionToken: ${res.sessionToken}`);

                iotKeys = res; // save the keys
            }
        });
    });
});

function addLog(msg) {
    msg = '[' + (new Date()).toTimeString().slice(0, 8) + '] ' + msg;
    $("#log").prepend('<li>' + msg + '</li>');
}
```

### AWS IoT

To build our notification system, we need to use a Node module [aws-iot-device-sdk](https://github.com/aws/aws-iot-device-sdk-js) and make a bundle to use in the browser.

In this project, I've created another folder named as **iot** to develop our IoT client. It has a **package.json**, so run `npm install` to install the **aws-iot-device-sdk** dependency.

The IoT function was created as a closure where I've implemented the functions `connect` and `send`. There are other functions like `onConnect` and `onMessage` that are empty on purpose. They will be redefined in **app.js**. 

``` javascript
const awsIot = require('aws-iot-device-sdk');

const IoT = (function() { 

    var client, iotTopic;

    return { 
    
        connect: function(iotTopic, iotEndpoint, region, accessKey, secretKey, sessionToken) {

            this.iotTopic = iotTopic;

            this.client = awsIot.device({
                region: region,
                protocol: 'wss',
                accessKeyId: accessKey,
                secretKey: secretKey,
                sessionToken: sessionToken,
                port: 443,
                host: iotEndpoint
            });

            this.client.on('connect', function() {
                this.client.subscribe(this.iotTopic);
                this.onConnect();
            });

            this.client.on('message', this.onMessage);            
            this.client.on('close', this.onClose);     
        },

        onConnect: function(){},
        onMessage: function(topic, message){},
        onClose: function(){},

        send: function(message) {
            this.client.publish(this.iotTopic, message);
        }
    }
})(); 
```

Now, let's create a bundle. I had issues using webpack to bundle this module, but Browserify worked fine. Install Browserify (`npm install -g browserify`) and uglifyjs (`npm install -g uglifyjs`). Bundle running `browserify index.js | uglifyjs > bundle.js`.

This **bundle.js** will be used in our frontend code and must be in the same folder. As we have developed the IoT client, we can use it inside **app.js**. Add the following:

``` javascript
$('#btn-send').on('click', function() {
    var msg = $('#message').val();
    IoT.send(msg);    
});

IoT.onMessage = function(topic, message) {
    addLog(message);
};

IoT.onClose = function() {
    addLog('Connection failed');
};
```




### Initializer

### Serverless Framework



### Pricing

### Multiplayer Game


### Improving this demo

This sample considers that there is only one topic. It's ok if everyone is subscribed to the same channel. However, if you want to send private notifications to a specific user, you need to create a new topic per user.

To handle permissions, I suggest that you keep creating just one role with access to all topics (as we have done in the "initializer") and use the `assumeRole` command (inside Lambda) to create keys with restricted access with a specific topic. This restriction is done passing a policy document as one of the assumeRole parameters (see [docs](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/STS.html#assumeRole-property)). 

### Conclusion

This demo solved the use case of real-time notifications for serverless applications. If you have any doubts, feel free to post in comments.

