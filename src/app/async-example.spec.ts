import { fakeAsync, tick, flush, flushMicrotasks } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

xdescribe('Async test Example', () => {

  it('Async test with Jasmine done()', (done: DoneFn) => {
    let test = false;

    setTimeout(() => {
      console.log('running assertion');
      test = true;
      expect(test).toBeTruthy();
      done();
    }, 1000)
  });

  it('Async test with fakeAsync()', fakeAsync(() => {
    let test = false;

    setTimeout(() => {
      console.log('running assertion with fakeAsync()');
      test = true;
    }, 1000)

    flush();

    expect(test).toBeTruthy();
  }));

  it('Async test with promise', fakeAsync(() => {
    let test = false;

    Promise.resolve().then(() => {
      console.log('Promise evalueted successfully');
      test = true;
    })

    flushMicrotasks();

    expect(test).toBeTruthy();
  }));

  it('Async test with promise and timeout', fakeAsync(() => {
    let counter = 0;

    Promise.resolve().then(() => {
      console.log('Promise evalueted successfully');
      counter += 10;

      setTimeout(() => {
        counter += 1;
      }, 1000)
    });

    expect(counter).toBe(0);

    flushMicrotasks();
    expect(counter).toBe(10);

    flush();
    expect(counter).toBe(11);
  }));

  it('Async test with observable', fakeAsync(() => {
    let val = 0;

    const test$ = of(10).pipe(delay(1000)).subscribe(data => {
      val = data;
      expect(data).toBe(10);
    });

    tick(1000);

    expect(val).toBe(10);
  }));
})
