Title: AngularJS with Pretty URLs: Removing the # in Amazon S3
Summary: Angular uses the # (hashtag) by default when routing pages because it requires no server side configuration. If you want to get rid of it, you need to configure a server rewrite rule or pre-render your pages.
Tags: AWS, Angular
Date: AUG 09, 2015
URL: angularjs-with-pretty-urls-removing-the-in-amazon-s3

## Angular URLs

Angular ngRoute uses the # (hashtag) by default when routing pages. For example, if you have an "about" page, your URL will look like `http://mywebsite.com/#/about`. With this, the # looks misplaced since we are used to see URLs like `http://mywebsite.com/about`.

The reason for this ugly character to be used is to avoid the need of a server-side rewrite rule. With this, learning and using ngRoute is easier.

To prettify your URLs, the first step is to prepare your Angular app:

 1. Add a `base` URL
 2. Configure the `$locationProvider`
 3. Fix your application links

## Add a base URL

The base URL is not mandatory, but it's better to add it to [avoid some extra configurations and to add support for old browsers](https://docs.angularjs.org/error/$location/nobase).

To add this, just place the `base` element inside your page's `head`.

``` html
<!doctype html>
<html>
  <head>
    <title>My Page</title>
    <base href="/">
  </head>
  (...)
```

Note: some websites hosts more than one application. If that's your case, the root of your app may be something like `http://mywebsite.com/myapp`. In this example, your base will be:

``` html
<base href="/myapp/">
```

## Configure the Location Provider

When configuring your ngRoute rules, just inject the `$locationProvider` and configure it with `$locationProvider.html5Mode(true)`. With this, you're telling your Angular app to use [HTML5 history.pushState()](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Manipulating_the_browser_history) feature to control routing and to change URLs without refreshing the pages.

``` javascript
angular
  .module('myApp')
  .config([
    '$routeProvider',
    '$locationProvider',
    function($routeProvider, $locationProvider) {
      $routeProvider
      .when('/', {
        templateUrl: 'home.html'
      })
      .when('/about', {
        templateUrl: 'about.html'
      });

      // Add HTML5 History API support
      $locationProvider.html5Mode(true);
  }
]);
```

## Fix your application links

If your application was working with #, probably you have many links starting with `#/` and you need to remove them now. Search through all files to locate things like `<a href="#/">About</a>` and change to `<a href="/">About</a>`.


## Server URL Rewrite

You have adjusted the client-side. Now you need to adjust the server-side. Otherwise, when you browse for `http://mywebsite.com/about`, the server will try to locate a file named "about" at your root level and will return a 404 error. You don't want to create a "about" file. What you want is to redirect to the main file where your Angular app is defined (usually index.html) and retrieve the "about" information maintaining the URL with `/about`.

To configure this, each server has its own guide. You can follow this [link](https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions#how-to-configure-your-server-to-work-with-html5mode) to see how this is done for Apache, IIS and others. For Amazon S3, read below.

## Amazon S3 URL Rewrite

First, open the AWS Management Console and browse to S3. Next, click on your website bucket in the left panel and see its properties in the right panel. Clicking on "Static Website Hosting" gives you the following options:

![s3-configuration](https://zanon.io/images/posts/2015-08-09-s3.png)

You'll edit the redirection rules using the following XML:

``` xml
<RoutingRules>
  <RoutingRule>
    <Condition>
      <HttpErrorCodeReturnedEquals>404</HttpErrorCodeReturnedEquals>
    </Condition>
    <Redirect>
      <HostName>zanon.io</HostName> <!-- add your domain name here -->
      <ReplaceKeyPrefixWith>#/</ReplaceKeyPrefixWith>
    </Redirect>
  </RoutingRule>
</RoutingRules>
```

**Note**: after saving, you may need up to 5 minutes to see the configuration taking effect.

In this configuration, you're telling AWS that when a user browses for an URL that does not exist (404 error), instead of showing the error, AWS will redirect the user to another page replacing the key prefix `/` with `#/`.  This means that if your user browses for `http://mywebsite.com/about`, Amazon will redirect to `http://mywebsite.com/#/about`, but since we have configured HTML5 push state, Angular will handle the request and rewrite again the URL to `http://mywebsite.com/about`.

## UPDATE: Sep 06, 2015

> This solution works pretty well, but configuring this S3 URL Rewrite is **not** SEO-friendly as I've discovered later. You can read why in my Stack Overflow [question/answer](http://stackoverflow.com/q/32429488/1476885). If you want an application SEO-friendly and with pretty URLs in Amazon, you need to avoid this S3 rewrite rule and pre-render all of your pages before uploading them. You can read more about this in my blog post: [Angular: How to create a SPA crawlable and SEO friendly?](https://zanon.io/posts/angularjs-how-to-create-a-spa-crawlable-and-seo-friendly)
