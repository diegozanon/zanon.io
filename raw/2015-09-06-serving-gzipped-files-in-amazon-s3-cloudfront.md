Title: Serving gzipped files in Amazon S3 / CloudFront
Summary: If you want to serve web content in the cloud, you need to gzip it first to reduce the download size and get a faster website. This guide shows how you can do it using AWS.
Tags: AWS
Date: SEP 06, 2015
URL: serving-gzipped-files-in-amazon-s3-cloudfront

If you are sharing your website static content using Amazon Web Services, you can gzip your content and save some bandwidth. The size of your files will be reduced and your website will load faster for your users.

If you have a static website in Amazon, you should really consider using CloudFront since it is very cheap and is a [CDN](http://stackoverflow.com/q/2145277/1476885) service. However, this guide is not a tutorial of how to configure your website to use CloudFront (or S3) because there are already [many](http://docs.aws.amazon.com/gettingstarted/latest/swh/getting-started-create-cfdist.html) [good](http://www.michaelgallego.fr/blog/2013/08/27/static-website-on-s3-cloudfront-and-route-53-the-right-way/) [tutorials](http://blog.celingest.com/en/2013/07/19/tutorial-creating-cdn-wordpress-cloudfront-s3/) for that.

Since CloudFront uses an Origin Server to find your files and to distribute them among their servers, what I want to show here is that all you need to serve gzipped content in CloudFront is serving gzipped content at your Origin Server.

In a Custom Origin Server, like an IIS or Apache server, this is very easy to accomplish because you have just to set some configurations and you're ready to serve gzipped content. However, if your Origin Server is Amazon S3, you need to manually gzip each content and I will show how this is done.

## So, what is gzip? 
[gzip](http://www.gzip.org/) is a file format and a software application used for compression and decompression. It is also the web standard used by your browser to download static content like HTML/CSS/JS. You can read more about it in this [Better Explained](http://betterexplained.com/articles/how-to-optimize-your-site-with-gzip-compression/) guide, but if you don't want, look those following extracted images that sums it up:

![http-request](http://zanon.io/images/posts/2015-09-06-http-request.png)
![http-request-compressed](http://zanon.io/images/posts/2015-09-06-http-request-compressed.png)

## Serving gzipped files
There is a tricky part serving gzipped files in Amazon S3. Since gzip is commonly done by the web server that zips (and caches) the content, S3 will not do it for you to save their CPU time avoiding compressing content. So, what you need to do is to gzip it upfront and set the file **Content-Encoding** to **gzip**. The following guide shows how to do it.

First, download a gzip program. You can use the [official](http://www.gzip.org/) application or find another one that fits you better.

You can execute the program using the command line typing: 

```xml
> gzip myscrypt.min.js
```

The file **myscrypt.min.js.gz** will be created. The command `> gzip -9 filename` will compress the file with the highest compression level. You can set up your deployment scripts to automate this process and execute the compression for all files (HTML/CSS/JS). However, do not gzip your images or other binaries contents. They are already highly compressed and the CPU cost to decompress them will not be worth it.

The last step is to remove the **gz** part of the name and upload it to Amazon S3 setting the file **Content-Encoding** to **gzip**. 

Since you'll need to do the same action for many files for each deploy, I highly recommend that you automate this process using Amazon APIs to upload your content. However, if you are just testing, you can change the **Content-Enconding** using Amazon's S3 Console.

![gzip-s3](http://zanon.io/images/posts/2015-09-06-gzip-s3.png)

To verify if your content is being gzipped, open your developer tool and check the **Content-Enconding** at the network tab.

![dev-tools](http://zanon.io/images/posts/2015-09-06-dev-tools.png)

