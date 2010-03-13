require('../test/common');
var sys = require('sys');

php.invoke('mysql_connect', '192.168.56.1', 'root', 'root', function(e, r) {
  setTimeout(function() {
    php.invoke('mysql_query', 'show databases;', r.reference, function(e, r) {
      sys.p(r.val); // => 5.0.77
    });
  }, 1000);
});