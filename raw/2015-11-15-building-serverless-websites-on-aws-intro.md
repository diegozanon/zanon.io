Title: Building Serverless Websites on AWS - Intro
Summary: A serverless website is the one which the developer doesn't need to worry about the servers that will host the website. A third-party managed service is responsible for handling requests on-demand, charging per request and not 24/7. This post explains about this concept.
Tags: Serverless, AWS, Node
Date: NOV 15, 2015
URL: building-serverless-websites-on-aws-intro

## Serverless Websites

Serverless is a concept of web applications which the developer doesn't need to worry about servers. The application is deployed to a cloud provider which is responsible to provide high availability, fast scalability and charges per request and not for 24/7. There is no dedicated server to host your application.

The frontend code (HTML/CSS/JS) is hosted in a storage service, like Amazon S3, and the DNS is configured to redirect requests to this storage which will serve the static files.

The backend code is broken into many small packages, so when a request is made, a third-party service loads the package responsible for the specific kind of request, executes the code, answers the request and unloads the package.

This approach has three main benefits:

- **Infinite scalability**: as you aren't managing a server instance, you don't need to worry about adding/removing new machines to your farm as your traffic grows/shrink. It will be smoothly handled by your cloud service and your site will always be served with the same low latency and high bandwidth.
- **High availability**: as your cloud provider is responsible to handle the availability of your site, you can expect more than 99 % of uptime over a given month.
- **Cost efficiency**: if you have an inconsistent traffic pattern, you would need to start and shutdown machines all the time to follow the usage and be efficient. Also, you would still need to pay for one machine even if no one is accessing to keep the site available. In serverless, you pay only per request which means that if no one is using, you pay nothing.

So, that's great. But does it work for every kind of website? At least, for most use cases. It's possible to handle authentication, page routing, server-side business rules, notifications and even database requests.

As an interesting real case of building a serverless website, I recommend you to read this [Reddit](https://www.reddit.com/r/webdev/comments/3oiilb/our_company_did_a_collab_with_valve_for_some_new/) post.

Summary: an e-commerce website built with traditional tools/infra completely broke after being advertised by Valve in a blog post. After some rework using JAWS (later renamed as Serverless Framework), AWS Lambda, S3 and DynamoDB, Valve advertised it again and they were able to handle 60k users requests in 2 hours with the cost of only US$ 0.07.

Quoting [one of the comments](https://www.reddit.com/r/webdev/comments/3oiilb/our_company_did_a_collab_with_valve_for_some_new/cvyf5s5):
> It's a cheap cheap setup when you're not doing anything, and it only gets expensive when you're making a lot of money. That's a great thing for a business.

## Serverless Framework

![serverless-logo](http://zanon.io/images/posts/2015-11-15-serverless-logo.png)

The [Serverless Framework](https://github.com/serverless/serverless) is an open-source framework that was created to help developers to build serverless apps using AWS features, mainly AWS Lambda (for code execution) and Amazon API Gateway (for Routing).

Instead of spinning up a full-blown server, the developer is invited to use a command line tool to deploy code-blocks to Amazon. Since each lambda function acts like a microservice and your app may end up with dozens of them distributed between multiple regions and managed by multi-developer teams in multi-stage environments, the Serverless Framework targets a better setup to avoid a messy solution.

I've created another [blog post](http://zanon.io/posts/building-serverless-websites-on-aws-tutorial) to show a simple example of how to use Serverless, but first you need to know what AWS technologies are involved.

The first thing that you need to be aware is that this solution is highly dependent on AWS. Usually, we would avoid being highly attached to a third-party solution. If AWS breaks forever, you will need some days to adapt your code to be able to deploy it again at another host. However, AWS is so reliable and the benefits of serverless apps are so great that I would not be so worried about it.

## AWS Lambda (Code Execution)

![lambda](http://zanon.io/images/posts/2015-11-15-lambda.png)

Lambda is a service where you can host your code and it will be executed when triggered by events. Lambda supports, currently, code written in JavaScript (Node.js), Python or Java.

Lambda is a managed service. It means that AWS is responsible for allocating machines on demand to execute your code and is responsible for high availability and to scale following your needs.

The code you run on AWS Lambda is called a "Lambda function". It needs to be stateless with no affinity to the underlying infrastructure. This prerequisite is what enables Amazon to rapidly launch many copies of the function to serve *infinite scalability* (infinite and fast).

As everything on AWS, Lambda also have a "Pay Per Use" model. You will only pay for the computer resources that you use, but in this case, its much better than EC2 because your EC2 machines will always have some computer resources that are allocated for you but not necessarily in use and this allocation is charged. Regarding Lambda, you will allocate resources only for the duration of your Lambda function execution. That's why its a much cheaper solution.

In Lambda, you pay for the number of requests and the amount of memory-time you allocate for your requests. Currently, it [costs](https://aws.amazon.com/lambda/pricing/) US$ 0.0000002 per request (or US$ 0.20 per 1 million requests) and US$ 0.00001667 for every GB-second used (billing is metered in increments of 100 milliseconds). Also, the free tier includes 1M free requests and 400,000 GB-seconds of compute time per month and this bonus is given even if you have expired your 12 month AWS Free Tier term.

For example, if you allocated 512 MB of memory for a function that was executed 10 million times in one month and it ran for 500 milliseconds each time, you would pay only US$ 36.81.

How many server-side requests your user makes to access your site per visit? I would guess something like 100 requests. It means that US$ 36.81 served 100,000 users and each user has cost only US$ 0.0004 (not including data transfer costs).

## Amazon API Gateway (Routing)

![api-gateway](http://zanon.io/images/posts/2015-11-15-api-gateway.png)

API Gateway is a service that lets you build RESTful APIs that acts like the "front door" of your application. It's the service that will receive all incoming requests, check authorization and route them to the underlying system that is responsible to handle it. In our case, it'll be AWS Lambda. API Gateway is also fully managed by AWS what means again high availability and scalability.

The following image shows an example of website that is fully serverless. The static content (HTML/CSS/JS) are hosted in S3, an user browses the page and click to see its local weather information, the API Gateway receives the request and triggers a Lambda function that will process it calling a DynamoDB database.

[![lambda-web-apps](http://zanon.io/images/posts/2015-11-15-lambda-web-apps.png)](https://aws.amazon.com/lambda/)

The pricing model is also "Pay Per Use". It currently [costs](https://aws.amazon.com/api-gateway/pricing/) US$ 3.50 per million API calls received plus US$ 0.09 per GB of data transferred.

## Authentication

Amazon API Gateway has three options to handle authentication: [Amazon Cognito](https://aws.amazon.com/cognito), [AWS Identity and Access Management (IAM)](https://aws.amazon.com/iam) or [OAuth 2.0](http://oauth.net/).

Amazon Cognito is a service that allows you to safely store user credentials and these can be used in API Gateway as a token based authentication system.

IAM is the authentication system that is used for all AWS services. What API Gateway offers is a way to easily create API Keys, with fine-grained access permissions, to be distributed to third-party developers or simply to generate keys that will be used by your client devices (website or mobile app) to consume your API methods.

OAuth 2.0 is an authorization framework that enables your application to authenticate your users based on credentials controlled by third-party applications, like Facebook, Twitter or GitHub.

## Serverless Databases

Amazon offers a service called [RDS](https://aws.amazon.com/rds). It's fully managed and you don't need to worry about availability. However, it does not satisfy our objective to "Pay Per Use" and is not so easy to scale. As you have to allocate a database to run it, you'll pay per hour even if nobody is using your app.

The remaining options that we have are [DynamoDB](https://aws.amazon.com/dynamodb) and [SimpleDB](https://aws.amazon.com/simpledb).

DynamoDB solves the scalability difficulties that you would have using RDS and is a much more robust solution than SimpleDB. However, its pricing model also requires fixed costs to provision per-hour capacity. No usage means that you will still have some costs to handle.

SimpleDB have also a fixed cost of how much data you have stored, but the main cost is dependent on your usage. Your usage is measured in how many machine hours you spend to process your queries. Also, scalability is graciously handled by AWS and you can have bursts of increased usage without delays. If your app does not require complex queries and you have a very unpredictable usage, this solution may be best cost-effective.

So far, I would suggest [Firebase](https://www.firebase.com/) as the best serverless database. It's not an Amazon product, but is a Google one and it allows much more complex apps than SimpleDB.

## To sum up

Below follows what we usually have in a dynamic website and what AWS feature we can use to build a serverless webapp.

- **Static Content**: the HTML / CSS / JavaScript code that runs at the client-side can be hosted in S3.
- **Routing**: API Gateway is responsible for receiving requests and to call the correspondent Lambda function.
- **Authentication**: IAM, Incognito or OAuth 2.0.
- **Server-Side Code**: Lambda functions handle each request.
- **Database**: SimpleDB is a pretty scalable NoSQL database, but consider using Google's Firebase.

## UPDATE: Dec 27, 2015

> Replaced the JAWS reference to Serverless since it was rebranded.
