# Node Ugly

Ugly is the worst foreign function interface ever created. Only use it in times of great despair.

## What does it do?

Ugly allows you to run PHP from within node.js:

    var
      sys = require('sys'),
      php = require('ugly').createClient();

    php.invoke('sprintf', '%s %s', 'hello', 'world', function(e, r) {
      sys.p(r.val); // => 'hello world'
    });

## How does it work?

When creating a client, ugly spawns a PHP child process that is running a specific worker script. The worker script listens to messages via stdin. When you call the invoke() function, ugly dispatches it to the worker script and passes the evaluated return value to your callback.

## How does it deal with objects / resources?

PHP Objects and resources are generally not easy to serialize. To avoid unexpected behavior, ugly creates a unique reference for each of those variables. Example:

    php.invoke('mysql_connect', 'localhost', 'root', 'root', function(e, r) {
      php.invoke('mysql_get_server_info', r.reference, function(e, r) {
        sys.p(r.val); // => 5.0.77
      });
    });

## What is the purpose of this?

This hack is meant as a temporary solution to get access to libraries (such as MySql) that are not yet natively available for node.js.

## Why PHP and not Ruby, Python, ...?

PHP has a few characteristics that make it very appealing choice for this ugly crime:

* PHP is available pretty much everywhere
* PHP has a huge standard library included by default
* PHP is one big pile of functions, no namespaces, not much object orientation
* PHP is reasonably fast
* PHP is very easy to learn & use

That being said, there is no reason you couldn't contribute workers for other languages. Check out lib/worker/php.php as a starting point if you feel like enslaving your favorite language.

## What about performance?

I will publish some benchmarks when I find the time, meanwhile you can spawn multiple clients if you hit performance issues.