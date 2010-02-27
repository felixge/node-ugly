process.mixin(require('sys'));

global.php = require('../lib/ugly').createClient();
global.assert = require('assert');