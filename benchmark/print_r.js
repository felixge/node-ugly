require('../test/common');
var stress = require('node-stress');

stress.config({duration: 1000});

stress.test('print_r', function printR(iterations, cb) {
  php.invoke('print_r', 1, true, function(e, r) {
    iterations--;
    if (!iterations) {
      cb();
    } else {
      printR(iterations, cb);
    }
  });
});