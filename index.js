

function assert(condition, message) {
    if (!condition) throw new Error(message || 'Assertion Error');
}

function indent(num) {
    var str = '';
    for (var i = 0; i < num; i++) {
        str += '  '
    }
    return str;
}

function captureStackTrace() {
    var a = {};
    Error.captureStackTrace(a)
}

module.exports = {
    name: 'core.plugin.test',
    dependencies: [],
    channels: ['core.test'],
    extend: {
        tests: {},
        assert: assert,
        test(name, test) {

            var core = this;

            if (test) {
                return (core.tests[name] = test);
            }
            test = core.tests[name];
            if (!test) {
                throw new Error('core.test - cannot find test ' + name);
            }

            var passed = [];
            var failed = [];

            var plugin = core.plugins.test; 

            function runTest(names, test) {
                var type = core.typeOf(test);
                var length = names.length - 1;
                var name = names[length];
                var space = indent(length);

                if (type === 'function') {
                    try {
                        test.call(core);
                        core.fire('core.test', {
                            type: 'success',
                            name: name,
                            test: test,
                            depth: length
                        });
                        // console.log(`%c${ space }✔ ${ name }`, 'color: rgb(33, 172, 31);');
                        passed.push({
                            names: names
                        });
                    } catch (err) {
                        core.fire('core.test', {
                            type: 'fail',
                            name: name,
                            err: err,
                            depth: length
                        });
                        // console.log(`%c${ space }✘ ${ name }\n${ space + err.stack.split('\n').join('\n' + space) }`, 'color: red;', );
                        failed.push({
                            names: names,
                            error: err
                        });
                    }
                } else if (type === 'object') {
                    // console.log(`%c${ space + name }`, length > 0 ? 'color: blue;' : 'color: blue;font-size: 14px;', );
                    for (var m in test) {
                        runTest(names.concat([m]), test[m]);
                    }
                } else if (type === 'array') {
                    for (var i = 0; i < test.length; i++) {
                        runTest(names.concat([i]), test[i]);
                    }
                } else {
                    throw new Error('cannot run test from type ' + type);
                }
            }

            runTest([name], test);

        }
    }
};