# core.plugin.test

```js
let core = new require('core.constructor')();

core.plugin([
  require('core.plugin.test')
]);

// added a simple 'assert' function on core
core.assert(1 == 2); // throws an error

// define a new test called 'someTest'
core.test('someTest', () => {

  core.assert(1 == 2);

});

// core.plugin.test only fires a 'core.test' channel for each test that runs. you can tap that channel to see results.
core.tap('core.test', (test, done) => {

    test.type; // 'success', 'fail'
    test.name; // 'someTest'
    test.err; // the error if failed
    
    done(test);
    
});

// run the test 
core.test('someTest');
```
