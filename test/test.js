require('pending/node_modules/chai').should();
import pending from 'pending';

// Waits for n milliseconds and then resolves(n).
let wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(ms);
    }, ms);
  });
};

describe("pending()", () => {

  it("Performs a task that should take 300ms.", () => {

    function* task() {
      let a = yield wait(50);
      a.should.eql(50);
      let b = yield wait(100);
      b.should.eql(100);
      yield wait(150);
    }

    return pending(task()).then((time) => {
      time.should.eql(150);
    });

  });

  it("Calls a generator that yields nothing and resolves immediately.", () => {
    function* task() {}
    return pending(task()).then((data) => {
      (data === undefined).should.be.true;
    })
  });

  it("Executes a generator with args.", () => {
    function* task(first, last) {
      let name = yield Promise.resolve(first + ' ' + last);
      let upper = name.toUpperCase();
      upper.should.eql('FOO BAR');
      yield Promise.resolve(name);
    }
    return pending(task('foo', 'bar')).then((data) => {
      data.should.eql('foo bar');
    });
  });

  it("Throws an error if the generator yields a non-promise.", () => {
    (() => {
      pending(function* () {
        yield 42;
      });
    }).should.throw();
  });

  it("Executes all the code after the final yield before execution returns to pending()", () => {
    let flag = 'a';
    function* task() {
      yield Promise.resolve(1);
      yield Promise.resolve(2);
      flag.should.eql('a');
    }
    return pending(task()).then(() => {
      flag = 'b';
    });
  });

});
