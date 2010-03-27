var sys = require('sys');

global.p = sys.p;
global.puts = sys.puts;

global.php = require('../lib/ugly').createClient();
global.assert = require('assert');