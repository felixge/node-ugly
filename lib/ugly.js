var
  childProcess = require('child_process'),
  path = require('path');

exports.createClient = function(options) {
  options = (options || {});
  options.worker = options.worker || __dirname+'/worker/php.php';
  var
    client = {
      onClose: function() {},
    },
    worker = childProcess.spawn(options.worker),
    callbacks = [],
    buffer = '',
    parse = function(chunk) {
      buffer += (chunk || '');

      var
        offset,
        response,
        callback;

      while ((offset = buffer.indexOf("\n")) >= 0) {
        response = buffer.substr(0, offset);
        // puts('< '+response);

        callback = callbacks.shift();
        if (callback === undefined) {
          throw new Error('unexpected message: '+buffer);
        }

        try {
          response = JSON.parse(response);
        } catch (e) {
          e.response = response;
          callback(e);
          return;
        }

        if (response.error) {
          var err = new Error();
          for (var key in response) {
            err[key] = response[key];
          }
          callback(err);
        } else {
          callback(null, response);
        }

        buffer = buffer.substr(offset+1);
      }
    };

  worker.stdout.setEncoding('utf8');
  worker.stdout.addListener('data', parse);
  worker.stderr.setEncoding('utf8');
  worker.stderr.addListener('data', parse);

  worker
    .addListener('exit', function(code) {
      client.onClose(code);
    });
  
  client.invoke = function() {
    var
      args = Array.prototype.slice.call(arguments),
      message,
      callback = false;

    if ((typeof args[args.length - 1]) == 'function') {
      callback = args.pop();
    }

    callbacks.push(callback);
    message = JSON.stringify(args)+"\n";

    // puts('> '+message);
    worker.stdin.write(message, 'utf8');
  };

  client.close = function() {
    worker.kill();
  };

  return client;
};