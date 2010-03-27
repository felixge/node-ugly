require('./common');

var
  loopCallbacks = 0,
  xmlCallback = false;

// A little stress test
for (var i = 0; i < 10; i++) {
  (function(i) {
    php.invoke('print_r', i, true, function(e, r) {
      assert.equal(i, r.val);
      loopCallbacks++;
    });
  })(i);
}

// This is pretty bad, even by ugly standards : )
php.invoke('eval', 'return new SimpleXMLElement("<test><hello>world</hello></test>");', function(e, r) {
  php.invoke('eval', 'return $ref["'+r.reference+'"]->hello;', function(e, r) {
    assert.equal('world', r.val);
    xmlCallback = true;
    php.close();
  });
});

process.addListener('exit', function() {
  assert.ok(xmlCallback);
  assert.equal(10, loopCallbacks);
});