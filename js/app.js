(function () {
'use strict';

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function Stream(source) {
  this.source = source;
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */

// Non-mutating array operations

// cons :: a -> [a] -> [a]
// a with x prepended
function cons(x, a) {
  var l = a.length;
  var b = new Array(l + 1);
  b[0] = x;
  for (var i = 0; i < l; ++i) {
    b[i + 1] = a[i];
  }
  return b;
}

// append :: a -> [a] -> [a]
// a with x appended
function append(x, a) {
  var l = a.length;
  var b = new Array(l + 1);
  for (var i = 0; i < l; ++i) {
    b[i] = a[i];
  }

  b[l] = x;
  return b;
}

// drop :: Int -> [a] -> [a]
// drop first n elements
function drop(n, a) {
  // eslint-disable-line complexity
  if (n < 0) {
    throw new TypeError('n must be >= 0');
  }

  var l = a.length;
  if (n === 0 || l === 0) {
    return a;
  }

  if (n >= l) {
    return [];
  }

  return unsafeDrop(n, a, l - n);
}

// unsafeDrop :: Int -> [a] -> Int -> [a]
// Internal helper for drop
function unsafeDrop(n, a, l) {
  var b = new Array(l);
  for (var i = 0; i < l; ++i) {
    b[i] = a[n + i];
  }
  return b;
}

// tail :: [a] -> [a]
// drop head element
function tail(a) {
  return drop(1, a);
}

// copy :: [a] -> [a]
// duplicate a (shallow duplication)
function copy(a) {
  var l = a.length;
  var b = new Array(l);
  for (var i = 0; i < l; ++i) {
    b[i] = a[i];
  }
  return b;
}

// map :: (a -> b) -> [a] -> [b]
// transform each element with f
function map(f, a) {
  var l = a.length;
  var b = new Array(l);
  for (var i = 0; i < l; ++i) {
    b[i] = f(a[i]);
  }
  return b;
}

// reduce :: (a -> b -> a) -> a -> [b] -> a
// accumulate via left-fold
function reduce(f, z, a) {
  var r = z;
  for (var i = 0, l = a.length; i < l; ++i) {
    r = f(r, a[i], i);
  }
  return r;
}

// replace :: a -> Int -> [a]
// replace element at index
function replace(x, i, a) {
  // eslint-disable-line complexity
  if (i < 0) {
    throw new TypeError('i must be >= 0');
  }

  var l = a.length;
  var b = new Array(l);
  for (var j = 0; j < l; ++j) {
    b[j] = i === j ? x : a[j];
  }
  return b;
}

// remove :: Int -> [a] -> [a]
// remove element at index
function remove(i, a) {
  // eslint-disable-line complexity
  if (i < 0) {
    throw new TypeError('i must be >= 0');
  }

  var l = a.length;
  if (l === 0 || i >= l) {
    // exit early if index beyond end of array
    return a;
  }

  if (l === 1) {
    // exit early if index in bounds and length === 1
    return [];
  }

  return unsafeRemove(i, a, l - 1);
}

// unsafeRemove :: Int -> [a] -> Int -> [a]
// Internal helper to remove element at index
function unsafeRemove(i, a, l) {
  var b = new Array(l);
  var j;
  for (j = 0; j < i; ++j) {
    b[j] = a[j];
  }
  for (j = i; j < l; ++j) {
    b[j] = a[j + 1];
  }

  return b;
}

// removeAll :: (a -> boolean) -> [a] -> [a]
// remove all elements matching a predicate
function removeAll(f, a) {
  var l = a.length;
  var b = new Array(l);
  var j = 0;
  for (var x, i = 0; i < l; ++i) {
    x = a[i];
    if (!f(x)) {
      b[j] = x;
      ++j;
    }
  }

  b.length = j;
  return b;
}

// findIndex :: a -> [a] -> Int
// find index of x in a, from the left
function findIndex(x, a) {
  for (var i = 0, l = a.length; i < l; ++i) {
    if (x === a[i]) {
      return i;
    }
  }
  return -1;
}

// isArrayLike :: * -> boolean
// Return true iff x is array-like
function isArrayLike(x) {
  return x != null && typeof x.length === 'number' && typeof x !== 'function';
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */

// id :: a -> a
var id = function (x) { return x; };

// compose :: (b -> c) -> (a -> b) -> (a -> c)
var compose = function (f, g) { return function (x) { return f(g(x)); }; };

// apply :: (a -> b) -> a -> b
var apply = function (f, x) { return f(x); };

// curry2 :: ((a, b) -> c) -> (a -> b -> c)
function curry2(f) {
  function curried(a, b) {
    switch (arguments.length) {
      case 0:
        return curried;
      case 1:
        return function (b) { return f(a, b); };
      default:
        return f(a, b);
    }
  }
  return curried;
}

// curry3 :: ((a, b, c) -> d) -> (a -> b -> c -> d)

/** @license MIT License (c) copyright 2016 original author or authors */

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Create a new Disposable which will dispose its underlying resource.
 * @param {function} dispose function
 * @param {*?} data any data to be passed to disposer function
 * @constructor
 */
function Disposable(dispose, data) {
  this._dispose = dispose;
  this._data = data;
}

Disposable.prototype.dispose = function () {
  return this._dispose(this._data);
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function SettableDisposable() {
  this.disposable = void 0;
  this.disposed = false;
  this._resolve = void 0;

  var self = this;
  this.result = new Promise(function (resolve) {
    self._resolve = resolve;
  });
}

SettableDisposable.prototype.setDisposable = function (disposable) {
  if (this.disposable !== void 0) {
    throw new Error('setDisposable called more than once');
  }

  this.disposable = disposable;

  if (this.disposed) {
    this._resolve(disposable.dispose());
  }
};

SettableDisposable.prototype.dispose = function () {
  if (this.disposed) {
    return this.result;
  }

  this.disposed = true;

  if (this.disposable !== void 0) {
    this.result = this.disposable.dispose();
  }

  return this.result;
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function isPromise(p) {
  return p !== null && typeof p === 'object' && typeof p.then === 'function';
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */
var map$1 = map;
var identity = id;

/**
 * Call disposable.dispose.  If it returns a promise, catch promise
 * error and forward it through the provided sink.
 * @param {number} t time
 * @param {{dispose: function}} disposable
 * @param {{error: function}} sink
 * @return {*} result of disposable.dispose
 */
function tryDispose(t, disposable, sink) {
  var result = disposeSafely(disposable);
  return isPromise(result) ? result.catch(function (e) {
    sink.error(t, e);
  }) : result;
}

/**
 * Create a new Disposable which will dispose its underlying resource
 * at most once.
 * @param {function} dispose function
 * @param {*?} data any data to be passed to disposer function
 * @return {Disposable}
 */
function create(dispose, data) {
  return once(new Disposable(dispose, data));
}

/**
 * Create a noop disposable. Can be used to satisfy a Disposable
 * requirement when no actual resource needs to be disposed.
 * @return {Disposable|exports|module.exports}
 */
function empty$1() {
  return new Disposable(identity, void 0);
}

/**
 * Create a disposable that will dispose all input disposables in parallel.
 * @param {Array<Disposable>} disposables
 * @return {Disposable}
 */
function all(disposables) {
  return create(disposeAll, disposables);
}

function disposeAll(disposables) {
  return Promise.all(map$1(disposeSafely, disposables));
}

function disposeSafely(disposable) {
  try {
    return disposable.dispose();
  } catch (e) {
    return Promise.reject(e);
  }
}

/**
 * Create a disposable from a promise for another disposable
 * @param {Promise<Disposable>} disposablePromise
 * @return {Disposable}
 */


function disposePromise(disposablePromise) {
  return disposablePromise.then(disposeOne);
}

function disposeOne(disposable) {
  return disposable.dispose();
}

/**
 * Create a disposable proxy that allows its underlying disposable to
 * be set later.
 * @return {SettableDisposable}
 */
function settable() {
  return new SettableDisposable();
}

/**
 * Wrap an existing disposable (which may not already have been once()d)
 * so that it will only dispose its underlying resource at most once.
 * @param {{ dispose: function() }} disposable
 * @return {Disposable} wrapped disposable
 */
function once(disposable) {
  return new Disposable(disposeMemoized, memoized(disposable));
}

function disposeMemoized(memoized) {
  if (!memoized.disposed) {
    memoized.disposed = true;
    memoized.value = disposeSafely(memoized.disposable);
    memoized.disposable = void 0;
  }

  return memoized.value;
}

function memoized(disposable) {
  return { disposed: false, disposable: disposable, value: void 0 };
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function fatalError(e) {
  setTimeout(function () {
    throw e;
  }, 0);
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function PropagateTask(run, value, sink) {
  this._run = run;
  this.value = value;
  this.sink = sink;
  this.active = true;
}

PropagateTask.event = function (value, sink) {
  return new PropagateTask(emit, value, sink);
};

PropagateTask.end = function (value, sink) {
  return new PropagateTask(end$1, value, sink);
};

PropagateTask.error = function (value, sink) {
  return new PropagateTask(error$1, value, sink);
};

PropagateTask.prototype.dispose = function () {
  this.active = false;
};

PropagateTask.prototype.run = function (t) {
  if (!this.active) {
    return;
  }
  this._run(t, this.value, this.sink);
};

PropagateTask.prototype.error = function (t, e) {
  if (!this.active) {
    return fatalError(e);
  }
  this.sink.error(t, e);
};

function error$1(t, e, sink) {
  sink.error(t, e);
}

function emit(t, x, sink) {
  sink.event(t, x);
}

function end$1(t, x, sink) {
  sink.end(t, x);
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Stream containing only x
 * @param {*} x
 * @returns {Stream}
 */
function of(x) {
  return new Stream(new Just(x));
}

function Just(x) {
  this.value = x;
}

Just.prototype.run = function (sink, scheduler) {
  return scheduler.asap(new PropagateTask(runJust, this.value, sink));
};

function runJust(t, x, sink) {
  sink.event(t, x);
  sink.end(t, void 0);
}

/**
 * Stream containing no events and ends immediately
 * @returns {Stream}
 */
function empty$$1() {
  return EMPTY;
}

function EmptySource() {}

EmptySource.prototype.run = function (sink, scheduler) {
  var task = PropagateTask.end(void 0, sink);
  scheduler.asap(task);

  return create(disposeEmpty, task);
};

function disposeEmpty(task) {
  return task.dispose();
}

var EMPTY = new Stream(new EmptySource());

/**
 * Stream containing no events and never ends
 * @returns {Stream}
 */


function NeverSource() {}

NeverSource.prototype.run = function () {
  return empty$1();
};

var NEVER = new Stream(new NeverSource());

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function fromArray(a) {
  return new Stream(new ArraySource(a));
}

function ArraySource(a) {
  this.array = a;
}

ArraySource.prototype.run = function (sink, scheduler) {
  return scheduler.asap(new PropagateTask(runProducer, this.array, sink));
};

function runProducer(t, array, sink) {
  for (var i = 0, l = array.length; i < l && this.active; ++i) {
    sink.event(t, array[i]);
  }

  this.active && end(t);

  function end(t) {
    sink.end(t);
  }
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/*global Set, Symbol*/
var iteratorSymbol;
// Firefox ships a partial implementation using the name @@iterator.
// https://bugzilla.mozilla.org/show_bug.cgi?id=907077#c14
if (typeof Set === 'function' && typeof new Set()['@@iterator'] === 'function') {
  iteratorSymbol = '@@iterator';
} else {
  iteratorSymbol = typeof Symbol === 'function' && Symbol.iterator || '_es6shim_iterator_';
}

function isIterable(o) {
  return typeof o[iteratorSymbol] === 'function';
}

function getIterator(o) {
  return o[iteratorSymbol]();
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function fromIterable(iterable) {
  return new Stream(new IterableSource(iterable));
}

function IterableSource(iterable) {
  this.iterable = iterable;
}

IterableSource.prototype.run = function (sink, scheduler) {
  return scheduler.asap(new PropagateTask(runProducer$1, getIterator(this.iterable), sink));
};

function runProducer$1(t, iterator, sink) {
  var r = iterator.next();

  while (!r.done && this.active) {
    sink.event(t, r.value);
    r = iterator.next();
  }

  sink.end(t, r.value);
}

function symbolObservablePonyfill(root) {
	var result;
	var Symbol = root.Symbol;

	if (typeof Symbol === 'function') {
		if (Symbol.observable) {
			result = Symbol.observable;
		} else {
			result = Symbol('observable');
			Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
}

/* global window */
var root$1;

if (typeof self !== 'undefined') {
  root$1 = self;
} else if (typeof window !== 'undefined') {
  root$1 = window;
} else if (typeof global !== 'undefined') {
  root$1 = global;
} else if (typeof module !== 'undefined') {
  root$1 = module;
} else {
  root$1 = Function('return this')();
}

var result = symbolObservablePonyfill(root$1);

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function getObservable(o) {
  // eslint-disable-line complexity
  var obs = null;
  if (o) {
    // Access foreign method only once
    var method = o[result];
    if (typeof method === 'function') {
      obs = method.call(o);
      if (!(obs && typeof obs.subscribe === 'function')) {
        throw new TypeError('invalid observable ' + obs);
      }
    }
  }

  return obs;
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function fromObservable(observable) {
  return new Stream(new ObservableSource(observable));
}

function ObservableSource(observable) {
  this.observable = observable;
}

ObservableSource.prototype.run = function (sink, scheduler) {
  var sub = this.observable.subscribe(new SubscriberSink(sink, scheduler));
  if (typeof sub === 'function') {
    return create(sub);
  } else if (sub && typeof sub.unsubscribe === 'function') {
    return create(unsubscribe, sub);
  }

  throw new TypeError('Observable returned invalid subscription ' + String(sub));
};

function SubscriberSink(sink, scheduler) {
  this.sink = sink;
  this.scheduler = scheduler;
}

SubscriberSink.prototype.next = function (x) {
  this.sink.event(this.scheduler.now(), x);
};

SubscriberSink.prototype.complete = function (x) {
  this.sink.end(this.scheduler.now(), x);
};

SubscriberSink.prototype.error = function (e) {
  this.sink.error(this.scheduler.now(), e);
};

function unsubscribe(subscription) {
  return subscription.unsubscribe();
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function from(a) {
  // eslint-disable-line complexity
  if (a instanceof Stream) {
    return a;
  }

  var observable = getObservable(a);
  if (observable != null) {
    return fromObservable(observable);
  }

  if (Array.isArray(a) || isArrayLike(a)) {
    return fromArray(a);
  }

  if (isIterable(a)) {
    return fromIterable(a);
  }

  throw new TypeError('from(x) must be observable, iterable, or array-like: ' + a);
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Create a stream that emits the current time periodically
 * @param {Number} period periodicity of events in millis
 * @param {*} deprecatedValue @deprecated value to emit each period
 * @returns {Stream} new stream that emits the current time every period
 */

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function ScheduledTask(delay, period, task, scheduler) {
  this.time = delay;
  this.period = period;
  this.task = task;
  this.scheduler = scheduler;
  this.active = true;
}

ScheduledTask.prototype.run = function () {
  return this.task.run(this.time);
};

ScheduledTask.prototype.error = function (e) {
  return this.task.error(this.time, e);
};

ScheduledTask.prototype.dispose = function () {
  this.scheduler.cancel(this);
  return this.task.dispose();
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function defer(task) {
  return Promise.resolve(task).then(runTask);
}

function runTask(task) {
  try {
    return task.run();
  } catch (e) {
    return task.error(e);
  }
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function Scheduler(timer, timeline) {
  this.timer = timer;
  this.timeline = timeline;

  this._timer = null;
  this._nextArrival = Infinity;

  var self = this;
  this._runReadyTasksBound = function () {
    self._runReadyTasks(self.now());
  };
}

Scheduler.prototype.now = function () {
  return this.timer.now();
};

Scheduler.prototype.asap = function (task) {
  return this.schedule(0, -1, task);
};

Scheduler.prototype.delay = function (delay, task) {
  return this.schedule(delay, -1, task);
};

Scheduler.prototype.periodic = function (period, task) {
  return this.schedule(0, period, task);
};

Scheduler.prototype.schedule = function (delay, period, task) {
  var now = this.now();
  var st = new ScheduledTask(now + Math.max(0, delay), period, task, this);

  this.timeline.add(st);
  this._scheduleNextRun(now);
  return st;
};

Scheduler.prototype.cancel = function (task) {
  task.active = false;
  if (this.timeline.remove(task)) {
    this._reschedule();
  }
};

Scheduler.prototype.cancelAll = function (f) {
  this.timeline.removeAll(f);
  this._reschedule();
};

Scheduler.prototype._reschedule = function () {
  if (this.timeline.isEmpty()) {
    this._unschedule();
  } else {
    this._scheduleNextRun(this.now());
  }
};

Scheduler.prototype._unschedule = function () {
  this.timer.clearTimer(this._timer);
  this._timer = null;
};

Scheduler.prototype._scheduleNextRun = function (now) {
  // eslint-disable-line complexity
  if (this.timeline.isEmpty()) {
    return;
  }

  var nextArrival = this.timeline.nextArrival();

  if (this._timer === null) {
    this._scheduleNextArrival(nextArrival, now);
  } else if (nextArrival < this._nextArrival) {
    this._unschedule();
    this._scheduleNextArrival(nextArrival, now);
  }
};

Scheduler.prototype._scheduleNextArrival = function (nextArrival, now) {
  this._nextArrival = nextArrival;
  var delay = Math.max(0, nextArrival - now);
  this._timer = this.timer.setTimer(this._runReadyTasksBound, delay);
};

Scheduler.prototype._runReadyTasks = function (now) {
  this._timer = null;
  this.timeline.runTasks(now, runTask);
  this._scheduleNextRun(this.now());
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/*global setTimeout, clearTimeout*/

function ClockTimer() {}

ClockTimer.prototype.now = Date.now;

ClockTimer.prototype.setTimer = function (f, dt) {
  return dt <= 0 ? runAsap(f) : setTimeout(f, dt);
};

ClockTimer.prototype.clearTimer = function (t) {
  return t instanceof Asap ? t.cancel() : clearTimeout(t);
};

function Asap(f) {
  this.f = f;
  this.active = true;
}

Asap.prototype.run = function () {
  return this.active && this.f();
};

Asap.prototype.error = function (e) {
  throw e;
};

Asap.prototype.cancel = function () {
  this.active = false;
};

function runAsap(f) {
  var task = new Asap(f);
  defer(task);
  return task;
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function Timeline() {
  this.tasks = [];
}

Timeline.prototype.nextArrival = function () {
  return this.isEmpty() ? Infinity : this.tasks[0].time;
};

Timeline.prototype.isEmpty = function () {
  return this.tasks.length === 0;
};

Timeline.prototype.add = function (st) {
  insertByTime(st, this.tasks);
};

Timeline.prototype.remove = function (st) {
  var i = binarySearch(st.time, this.tasks);

  if (i >= 0 && i < this.tasks.length) {
    var at = findIndex(st, this.tasks[i].events);
    if (at >= 0) {
      this.tasks[i].events.splice(at, 1);
      return true;
    }
  }

  return false;
};

Timeline.prototype.removeAll = function (f) {
  var this$1 = this;

  for (var i = 0, l = this.tasks.length; i < l; ++i) {
    removeAllFrom(f, this$1.tasks[i]);
  }
};

Timeline.prototype.runTasks = function (t, runTask) {
  var this$1 = this;

  var tasks = this.tasks;
  var l = tasks.length;
  var i = 0;

  while (i < l && tasks[i].time <= t) {
    ++i;
  }

  this.tasks = tasks.slice(i);

  // Run all ready tasks
  for (var j = 0; j < i; ++j) {
    this$1.tasks = runTasks(runTask, tasks[j], this$1.tasks);
  }
};

function runTasks(runTask, timeslot, tasks) {
  // eslint-disable-line complexity
  var events = timeslot.events;
  for (var i = 0; i < events.length; ++i) {
    var task = events[i];

    if (task.active) {
      runTask(task);

      // Reschedule periodic repeating tasks
      // Check active again, since a task may have canceled itself
      if (task.period >= 0 && task.active) {
        task.time = task.time + task.period;
        insertByTime(task, tasks);
      }
    }
  }

  return tasks;
}

function insertByTime(task, timeslots) {
  // eslint-disable-line complexity
  var l = timeslots.length;

  if (l === 0) {
    timeslots.push(newTimeslot(task.time, [task]));
    return;
  }

  var i = binarySearch(task.time, timeslots);

  if (i >= l) {
    timeslots.push(newTimeslot(task.time, [task]));
  } else if (task.time === timeslots[i].time) {
    timeslots[i].events.push(task);
  } else {
    timeslots.splice(i, 0, newTimeslot(task.time, [task]));
  }
}

function removeAllFrom(f, timeslot) {
  timeslot.events = removeAll(f, timeslot.events);
}

function binarySearch(t, sortedArray) {
  // eslint-disable-line complexity
  var lo = 0;
  var hi = sortedArray.length;
  var mid, y;

  while (lo < hi) {
    mid = Math.floor((lo + hi) / 2);
    y = sortedArray[mid];

    if (t === y.time) {
      return mid;
    } else if (t < y.time) {
      hi = mid;
    } else {
      lo = mid + 1;
    }
  }
  return hi;
}

function newTimeslot(t, events) {
  return { time: t, events: events };
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

var defaultScheduler = new Scheduler(new ClockTimer(), new Timeline());

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function subscribe(subscriber, stream) {
  if (subscriber == null || typeof subscriber !== 'object') {
    throw new TypeError('subscriber must be an object');
  }

  var disposable = settable();
  var observer = new SubscribeObserver(fatalError, subscriber, disposable);

  disposable.setDisposable(stream.source.run(observer, defaultScheduler));

  return new Subscription(disposable);
}

function SubscribeObserver(fatalError$$1, subscriber, disposable) {
  this.fatalError = fatalError$$1;
  this.subscriber = subscriber;
  this.disposable = disposable;
}

SubscribeObserver.prototype.event = function (t, x) {
  if (!this.disposable.disposed && typeof this.subscriber.next === 'function') {
    this.subscriber.next(x);
  }
};

SubscribeObserver.prototype.end = function (t, x) {
  if (!this.disposable.disposed) {
    var s = this.subscriber;
    doDispose(this.fatalError, s, s.complete, s.error, this.disposable, x);
  }
};

SubscribeObserver.prototype.error = function (t, e) {
  var s = this.subscriber;
  doDispose(this.fatalError, s, s.error, s.error, this.disposable, e);
};

function Subscription(disposable) {
  this.disposable = disposable;
}

Subscription.prototype.unsubscribe = function () {
  this.disposable.dispose();
};

function doDispose(fatal, subscriber, complete, error, disposable, x) {
  Promise.resolve(disposable.dispose()).then(function () {
    if (typeof complete === 'function') {
      complete.call(subscriber, x);
    }
  }).catch(function (e) {
    if (typeof error === 'function') {
      error.call(subscriber, e);
    }
  }).catch(fatal);
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function thru(f, stream) {
  return f(stream);
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function tryEvent(t, x, sink) {
  try {
    sink.event(t, x);
  } catch (e) {
    sink.error(t, e);
  }
}

function tryEnd(t, x, sink) {
  try {
    sink.end(t, x);
  } catch (e) {
    sink.error(t, e);
  }
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function EventTargetSource(event, source, capture) {
  this.event = event;
  this.source = source;
  this.capture = capture;
}

EventTargetSource.prototype.run = function (sink, scheduler) {
  function addEvent(e) {
    tryEvent(scheduler.now(), e, sink);
  }

  this.source.addEventListener(this.event, addEvent, this.capture);

  return create(disposeEventTarget, { target: this, addEvent: addEvent });
};

function disposeEventTarget(info) {
  var target = info.target;
  target.source.removeEventListener(target.event, info.addEvent, target.capture);
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function DeferredSink(sink) {
  this.sink = sink;
  this.events = [];
  this.active = true;
}

DeferredSink.prototype.event = function (t, x) {
  if (!this.active) {
    return;
  }

  if (this.events.length === 0) {
    defer(new PropagateAllTask(this.sink, t, this.events));
  }

  this.events.push({ time: t, value: x });
};

DeferredSink.prototype.end = function (t, x) {
  if (!this.active) {
    return;
  }

  this._end(new EndTask(t, x, this.sink));
};

DeferredSink.prototype.error = function (t, e) {
  this._end(new ErrorTask(t, e, this.sink));
};

DeferredSink.prototype._end = function (task) {
  this.active = false;
  defer(task);
};

function PropagateAllTask(sink, time, events) {
  this.sink = sink;
  this.events = events;
  this.time = time;
}

PropagateAllTask.prototype.run = function () {
  var this$1 = this;

  var events = this.events;
  var sink = this.sink;
  var event;

  for (var i = 0, l = events.length; i < l; ++i) {
    event = events[i];
    this$1.time = event.time;
    sink.event(event.time, event.value);
  }

  events.length = 0;
};

PropagateAllTask.prototype.error = function (e) {
  this.sink.error(this.time, e);
};

function EndTask(t, x, sink) {
  this.time = t;
  this.value = x;
  this.sink = sink;
}

EndTask.prototype.run = function () {
  this.sink.end(this.time, this.value);
};

EndTask.prototype.error = function (e) {
  this.sink.error(this.time, e);
};

function ErrorTask(t, e, sink) {
  this.time = t;
  this.value = e;
  this.sink = sink;
}

ErrorTask.prototype.run = function () {
  this.sink.error(this.time, this.value);
};

ErrorTask.prototype.error = function (e) {
  throw e;
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function EventEmitterSource(event, source) {
  this.event = event;
  this.source = source;
}

EventEmitterSource.prototype.run = function (sink, scheduler) {
  // NOTE: Because EventEmitter allows events in the same call stack as
  // a listener is added, use a DeferredSink to buffer events
  // until the stack clears, then propagate.  This maintains most.js's
  // invariant that no event will be delivered in the same call stack
  // as an observer begins observing.
  var dsink = new DeferredSink(sink);

  function addEventVariadic(a) {
    var arguments$1 = arguments;

    var l = arguments.length;
    if (l > 1) {
      var arr = new Array(l);
      for (var i = 0; i < l; ++i) {
        arr[i] = arguments$1[i];
      }
      tryEvent(scheduler.now(), arr, dsink);
    } else {
      tryEvent(scheduler.now(), a, dsink);
    }
  }

  this.source.addListener(this.event, addEventVariadic);

  return create(disposeEventEmitter, { target: this, addEvent: addEventVariadic });
};

function disposeEventEmitter(info) {
  var target = info.target;
  target.source.removeListener(target.event, info.addEvent);
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Create a stream from an EventTarget, such as a DOM Node, or EventEmitter.
 * @param {String} event event type name, e.g. 'click'
 * @param {EventTarget|EventEmitter} source EventTarget or EventEmitter
 * @param {*?} capture for DOM events, whether to use
 *  capturing--passed as 3rd parameter to addEventListener.
 * @returns {Stream} stream containing all events of the specified type
 * from the source.
 */

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function withDefaultScheduler(source) {
  return withScheduler(source, defaultScheduler);
}

function withScheduler(source, scheduler) {
  return new Promise(function (resolve, reject) {
    runSource(source, scheduler, resolve, reject);
  });
}

function runSource(source, scheduler, resolve, reject) {
  var disposable = settable();
  var observer = new Drain(resolve, reject, disposable);

  disposable.setDisposable(source.run(observer, scheduler));
}

function Drain(end, error, disposable) {
  this._end = end;
  this._error = error;
  this._disposable = disposable;
  this.active = true;
}

Drain.prototype.event = function (t, x) {};

Drain.prototype.end = function (t, x) {
  if (!this.active) {
    return;
  }
  this.active = false;
  disposeThen(this._end, this._error, this._disposable, x);
};

Drain.prototype.error = function (t, e) {
  this.active = false;
  disposeThen(this._error, this._error, this._disposable, e);
};

function disposeThen(end, error, disposable, x) {
  Promise.resolve(disposable.dispose()).then(function () {
    end(x);
  }, error);
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * A sink mixin that simply forwards event, end, and error to
 * another sink.
 * @param sink
 * @constructor
 */
function Pipe(sink) {
  this.sink = sink;
}

Pipe.prototype.event = function (t, x) {
  return this.sink.event(t, x);
};

Pipe.prototype.end = function (t, x) {
  return this.sink.end(t, x);
};

Pipe.prototype.error = function (t, e) {
  return this.sink.error(t, e);
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function Filter(p, source) {
  this.p = p;
  this.source = source;
}

/**
 * Create a filtered source, fusing adjacent filter.filter if possible
 * @param {function(x:*):boolean} p filtering predicate
 * @param {{run:function}} source source to filter
 * @returns {Filter} filtered source
 */
Filter.create = function createFilter(p, source) {
  if (source instanceof Filter) {
    return new Filter(and(source.p, p), source.source);
  }

  return new Filter(p, source);
};

Filter.prototype.run = function (sink, scheduler) {
  return this.source.run(new FilterSink(this.p, sink), scheduler);
};

function FilterSink(p, sink) {
  this.p = p;
  this.sink = sink;
}

FilterSink.prototype.end = Pipe.prototype.end;
FilterSink.prototype.error = Pipe.prototype.error;

FilterSink.prototype.event = function (t, x) {
  var p = this.p;
  p(x) && this.sink.event(t, x);
};

function and(p, q) {
  return function (x) {
    return p(x) && q(x);
  };
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function FilterMap(p, f, source) {
  this.p = p;
  this.f = f;
  this.source = source;
}

FilterMap.prototype.run = function (sink, scheduler) {
  return this.source.run(new FilterMapSink(this.p, this.f, sink), scheduler);
};

function FilterMapSink(p, f, sink) {
  this.p = p;
  this.f = f;
  this.sink = sink;
}

FilterMapSink.prototype.event = function (t, x) {
  var f = this.f;
  var p = this.p;
  p(x) && this.sink.event(t, f(x));
};

FilterMapSink.prototype.end = Pipe.prototype.end;
FilterMapSink.prototype.error = Pipe.prototype.error;

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function Map(f, source) {
  this.f = f;
  this.source = source;
}

/**
 * Create a mapped source, fusing adjacent map.map, filter.map,
 * and filter.map.map if possible
 * @param {function(*):*} f mapping function
 * @param {{run:function}} source source to map
 * @returns {Map|FilterMap} mapped source, possibly fused
 */
Map.create = function createMap(f, source) {
  if (source instanceof Map) {
    return new Map(compose(f, source.f), source.source);
  }

  if (source instanceof Filter) {
    return new FilterMap(source.p, f, source.source);
  }

  return new Map(f, source);
};

Map.prototype.run = function (sink, scheduler) {
  // eslint-disable-line no-extend-native
  return this.source.run(new MapSink(this.f, sink), scheduler);
};

function MapSink(f, sink) {
  this.f = f;
  this.sink = sink;
}

MapSink.prototype.end = Pipe.prototype.end;
MapSink.prototype.error = Pipe.prototype.error;

MapSink.prototype.event = function (t, x) {
  var f = this.f;
  this.sink.event(t, f(x));
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Transform each value in the stream by applying f to each
 * @param {function(*):*} f mapping function
 * @param {Stream} stream stream to map
 * @returns {Stream} stream containing items transformed by f
 */
function map$2(f, stream) {
  return new Stream(Map.create(f, stream.source));
}

/**
* Replace each value in the stream with x
* @param {*} x
* @param {Stream} stream
* @returns {Stream} stream containing items replaced with x
*/
function constant(x, stream) {
  return map$2(function () {
    return x;
  }, stream);
}

/**
* Perform a side effect for each item in the stream
* @param {function(x:*):*} f side effect to execute for each item. The
*  return value will be discarded.
* @param {Stream} stream stream to tap
* @returns {Stream} new stream containing the same items as this stream
*/
function tap(f, stream) {
  return new Stream(new Tap(f, stream.source));
}

function Tap(f, source) {
  this.source = source;
  this.f = f;
}

Tap.prototype.run = function (sink, scheduler) {
  return this.source.run(new TapSink(this.f, sink), scheduler);
};

function TapSink(f, sink) {
  this.sink = sink;
  this.f = f;
}

TapSink.prototype.end = Pipe.prototype.end;
TapSink.prototype.error = Pipe.prototype.error;

TapSink.prototype.event = function (t, x) {
  var f = this.f;
  f(x);
  this.sink.event(t, x);
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Observe all the event values in the stream in time order. The
 * provided function `f` will be called for each event value
 * @param {function(x:T):*} f function to call with each event value
 * @param {Stream<T>} stream stream to observe
 * @return {Promise} promise that fulfills after the stream ends without
 *  an error, or rejects if the stream ends with an error.
 */
function observe(f, stream) {
  return drain(tap(f, stream));
}

/**
 * "Run" a stream by creating demand and consuming all events
 * @param {Stream<T>} stream stream to drain
 * @return {Promise} promise that fulfills after the stream ends without
 *  an error, or rejects if the stream ends with an error.
 */
function drain(stream) {
  return withDefaultScheduler(stream.source);
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Generalized feedback loop. Call a stepper function for each event. The stepper
 * will be called with 2 params: the current seed and the an event value.  It must
 * return a new { seed, value } pair. The `seed` will be fed back into the next
 * invocation of stepper, and the `value` will be propagated as the event value.
 * @param {function(seed:*, value:*):{seed:*, value:*}} stepper loop step function
 * @param {*} seed initial seed value passed to first stepper call
 * @param {Stream} stream event stream
 * @returns {Stream} new stream whose values are the `value` field of the objects
 * returned by the stepper
 */
function loop(stepper, seed, stream) {
  return new Stream(new Loop(stepper, seed, stream.source));
}

function Loop(stepper, seed, source) {
  this.step = stepper;
  this.seed = seed;
  this.source = source;
}

Loop.prototype.run = function (sink, scheduler) {
  return this.source.run(new LoopSink(this.step, this.seed, sink), scheduler);
};

function LoopSink(stepper, seed, sink) {
  this.step = stepper;
  this.seed = seed;
  this.sink = sink;
}

LoopSink.prototype.error = Pipe.prototype.error;

LoopSink.prototype.event = function (t, x) {
  var result = this.step(this.seed, x);
  this.seed = result.seed;
  this.sink.event(t, result.value);
};

LoopSink.prototype.end = function (t) {
  this.sink.end(t, this.seed);
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Create a stream containing successive reduce results of applying f to
 * the previous reduce result and the current stream item.
 * @param {function(result:*, x:*):*} f reducer function
 * @param {*} initial initial value
 * @param {Stream} stream stream to scan
 * @returns {Stream} new stream containing successive reduce results
 */
function scan(f, initial, stream) {
  return new Stream(new Scan(f, initial, stream.source));
}

function Scan(f, z, source) {
  this.source = source;
  this.f = f;
  this.value = z;
}

Scan.prototype.run = function (sink, scheduler) {
  var d1 = scheduler.asap(PropagateTask.event(this.value, sink));
  var d2 = this.source.run(new ScanSink(this.f, this.value, sink), scheduler);
  return all([d1, d2]);
};

function ScanSink(f, z, sink) {
  this.f = f;
  this.value = z;
  this.sink = sink;
}

ScanSink.prototype.event = function (t, x) {
  var f = this.f;
  this.value = f(this.value, x);
  this.sink.event(t, this.value);
};

ScanSink.prototype.error = Pipe.prototype.error;
ScanSink.prototype.end = Pipe.prototype.end;

/**
* Reduce a stream to produce a single result.  Note that reducing an infinite
* stream will return a Promise that never fulfills, but that may reject if an error
* occurs.
* @param {function(result:*, x:*):*} f reducer function
* @param {*} initial initial value
* @param {Stream} stream to reduce
* @returns {Promise} promise for the file result of the reduce
*/
function reduce$1(f, initial, stream) {
  return withDefaultScheduler(new Reduce(f, initial, stream.source));
}

function Reduce(f, z, source) {
  this.source = source;
  this.f = f;
  this.value = z;
}

Reduce.prototype.run = function (sink, scheduler) {
  return this.source.run(new ReduceSink(this.f, this.value, sink), scheduler);
};

function ReduceSink(f, z, sink) {
  this.f = f;
  this.value = z;
  this.sink = sink;
}

ReduceSink.prototype.event = function (t, x) {
  var f = this.f;
  this.value = f(this.value, x);
  this.sink.event(t, this.value);
};

ReduceSink.prototype.error = Pipe.prototype.error;

ReduceSink.prototype.end = function (t) {
  this.sink.end(t, this.value);
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Compute a stream by unfolding tuples of future values from a seed value
 * Event times may be controlled by returning a Promise from f
 * @param {function(seed:*):{value:*, seed:*, done:boolean}|Promise<{value:*, seed:*, done:boolean}>} f unfolding function accepts
 *  a seed and returns a new tuple with a value, new seed, and boolean done flag.
 *  If tuple.done is true, the stream will end.
 * @param {*} seed seed value
 * @returns {Stream} stream containing all value of all tuples produced by the
 *  unfolding function.
 */


function stepUnfold(unfold, x) {
  var f = unfold.f;
  return Promise.resolve(f(x)).then(function (tuple) {
    return continueUnfold(unfold, tuple);
  });
}

function continueUnfold(unfold, tuple) {
  if (tuple.done) {
    unfold.sink.end(unfold.scheduler.now(), tuple.value);
    return tuple.value;
  }

  unfold.sink.event(unfold.scheduler.now(), tuple.value);

  if (!unfold.active) {
    return tuple.value;
  }
  return stepUnfold(unfold, tuple.seed);
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Compute a stream by iteratively calling f to produce values
 * Event times may be controlled by returning a Promise from f
 * @param {function(x:*):*|Promise<*>} f
 * @param {*} x initial value
 * @returns {Stream}
 */


function stepIterate(iterate, x) {
  iterate.sink.event(iterate.scheduler.now(), x);

  if (!iterate.active) {
    return x;
  }

  var f = iterate.f;
  return Promise.resolve(f(x)).then(function (y) {
    return continueIterate(iterate, y);
  });
}

function continueIterate(iterate, x) {
  return !iterate.active ? iterate.value : stepIterate(iterate, x);
}

/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Compute a stream using an *async* generator, which yields promises
 * to control event times.
 * @param f
 * @returns {Stream}
 */


function GenerateSource(f, args) {
  this.f = f;
  this.args = args;
}

GenerateSource.prototype.run = function (sink, scheduler) {
  return new Generate(this.f.apply(void 0, this.args), sink, scheduler);
};

function Generate(iterator, sink, scheduler) {
  this.iterator = iterator;
  this.sink = sink;
  this.scheduler = scheduler;
  this.active = true;

  var self = this;
  function err(e) {
    self.sink.error(self.scheduler.now(), e);
  }

  Promise.resolve(this).then(next).catch(err);
}

function next(generate, x) {
  return generate.active ? handle(generate, generate.iterator.next(x)) : x;
}

function handle(generate, result) {
  if (result.done) {
    return generate.sink.end(generate.scheduler.now(), result.value);
  }

  return Promise.resolve(result.value).then(function (x) {
    return emit$1(generate, x);
  }, function (e) {
    return error$2(generate, e);
  });
}

function emit$1(generate, x) {
  generate.sink.event(generate.scheduler.now(), x);
  return next(generate, x);
}

function error$2(generate, e) {
  return handle(generate, generate.iterator.throw(e));
}

Generate.prototype.dispose = function () {
  this.active = false;
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function continueWith(f, stream) {
  return new Stream(new ContinueWith(f, stream.source));
}

function ContinueWith(f, source) {
  this.f = f;
  this.source = source;
}

ContinueWith.prototype.run = function (sink, scheduler) {
  return new ContinueWithSink(this.f, this.source, sink, scheduler);
};

function ContinueWithSink(f, source, sink, scheduler) {
  this.f = f;
  this.sink = sink;
  this.scheduler = scheduler;
  this.active = true;
  this.disposable = once(source.run(this, scheduler));
}

ContinueWithSink.prototype.error = Pipe.prototype.error;

ContinueWithSink.prototype.event = function (t, x) {
  if (!this.active) {
    return;
  }
  this.sink.event(t, x);
};

ContinueWithSink.prototype.end = function (t, x) {
  if (!this.active) {
    return;
  }

  tryDispose(t, this.disposable, this.sink);
  this._startNext(t, x, this.sink);
};

ContinueWithSink.prototype._startNext = function (t, x, sink) {
  try {
    this.disposable = this._continue(this.f, x, sink);
  } catch (e) {
    sink.error(t, e);
  }
};

ContinueWithSink.prototype._continue = function (f, x, sink) {
  return f(x).source.run(sink, this.scheduler);
};

ContinueWithSink.prototype.dispose = function () {
  this.active = false;
  return this.disposable.dispose();
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * @param {*} x value to prepend
 * @param {Stream} stream
 * @returns {Stream} new stream with x prepended
 */
function cons$1(x, stream) {
  return concat(of(x), stream);
}

/**
* @param {Stream} left
* @param {Stream} right
* @returns {Stream} new stream containing all events in left followed by all
*  events in right.  This *timeshifts* right to the end of left.
*/
function concat(left, right) {
  return continueWith(function () {
    return right;
  }, left);
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function IndexSink(i, sink) {
  this.sink = sink;
  this.index = i;
  this.active = true;
  this.value = void 0;
}

IndexSink.prototype.event = function (t, x) {
  if (!this.active) {
    return;
  }
  this.value = x;
  this.sink.event(t, this);
};

IndexSink.prototype.end = function (t, x) {
  if (!this.active) {
    return;
  }
  this.active = false;
  this.sink.end(t, { index: this.index, value: x });
};

IndexSink.prototype.error = Pipe.prototype.error;

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function invoke(f, args) {
  /*eslint complexity: [2,7]*/
  switch (args.length) {
    case 0:
      return f();
    case 1:
      return f(args[0]);
    case 2:
      return f(args[0], args[1]);
    case 3:
      return f(args[0], args[1], args[2]);
    case 4:
      return f(args[0], args[1], args[2], args[3]);
    case 5:
      return f(args[0], args[1], args[2], args[3], args[4]);
    default:
      return f.apply(void 0, args);
  }
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

var map$3 = map;
var tail$1 = tail;

/**
 * Combine latest events from all input streams
 * @param {function(...events):*} f function to combine most recent events
 * @returns {Stream} stream containing the result of applying f to the most recent
 *  event of each input stream, whenever a new event arrives on any stream.
 */
function combine(f /*, ...streams */) {
  return combineArray(f, tail$1(arguments));
}

/**
* Combine latest events from all input streams
* @param {function(...events):*} f function to combine most recent events
* @param {[Stream]} streams most recent events
* @returns {Stream} stream containing the result of applying f to the most recent
*  event of each input stream, whenever a new event arrives on any stream.
*/
function combineArray(f, streams) {
  var l = streams.length;
  return l === 0 ? empty$$1() : l === 1 ? map$2(f, streams[0]) : new Stream(combineSources(f, streams));
}

function combineSources(f, streams) {
  return new Combine(f, map$3(getSource, streams));
}

function getSource(stream) {
  return stream.source;
}

function Combine(f, sources) {
  this.f = f;
  this.sources = sources;
}

Combine.prototype.run = function (sink, scheduler) {
  var this$1 = this;

  var l = this.sources.length;
  var disposables = new Array(l);
  var sinks = new Array(l);

  var mergeSink = new CombineSink(disposables, sinks, sink, this.f);

  for (var indexSink, i = 0; i < l; ++i) {
    indexSink = sinks[i] = new IndexSink(i, mergeSink);
    disposables[i] = this$1.sources[i].run(indexSink, scheduler);
  }

  return all(disposables);
};

function CombineSink(disposables, sinks, sink, f) {
  var this$1 = this;

  this.sink = sink;
  this.disposables = disposables;
  this.sinks = sinks;
  this.f = f;

  var l = sinks.length;
  this.awaiting = l;
  this.values = new Array(l);
  this.hasValue = new Array(l);
  for (var i = 0; i < l; ++i) {
    this$1.hasValue[i] = false;
  }

  this.activeCount = sinks.length;
}

CombineSink.prototype.error = Pipe.prototype.error;

CombineSink.prototype.event = function (t, indexedValue) {
  var i = indexedValue.index;
  var awaiting = this._updateReady(i);

  this.values[i] = indexedValue.value;
  if (awaiting === 0) {
    this.sink.event(t, invoke(this.f, this.values));
  }
};

CombineSink.prototype._updateReady = function (index) {
  if (this.awaiting > 0) {
    if (!this.hasValue[index]) {
      this.hasValue[index] = true;
      this.awaiting -= 1;
    }
  }
  return this.awaiting;
};

CombineSink.prototype.end = function (t, indexedValue) {
  tryDispose(t, this.disposables[indexedValue.index], this.sink);
  if (--this.activeCount === 0) {
    this.sink.end(t, indexedValue.value);
  }
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Assume fs is a stream containing functions, and apply the latest function
 * in fs to the latest value in xs.
 * fs:         --f---------g--------h------>
 * xs:         -a-------b-------c-------d-->
 * ap(fs, xs): --fa-----fb-gb---gc--hc--hd->
 * @param {Stream} fs stream of functions to apply to the latest x
 * @param {Stream} xs stream of values to which to apply all the latest f
 * @returns {Stream} stream containing all the applications of fs to xs
 */
function ap(fs, xs) {
  return combine(apply, fs, xs);
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Transform a stream by passing its events through a transducer.
 * @param  {function} transducer transducer function
 * @param  {Stream} stream stream whose events will be passed through the
 *  transducer
 * @return {Stream} stream of events transformed by the transducer
 */
function transduce(transducer, stream) {
  return new Stream(new Transduce(transducer, stream.source));
}

function Transduce(transducer, source) {
  this.transducer = transducer;
  this.source = source;
}

Transduce.prototype.run = function (sink, scheduler) {
  var xf = this.transducer(new Transformer(sink));
  return this.source.run(new TransduceSink(getTxHandler(xf), sink), scheduler);
};

function TransduceSink(adapter, sink) {
  this.xf = adapter;
  this.sink = sink;
}

TransduceSink.prototype.event = function (t, x) {
  var next = this.xf.step(t, x);

  return this.xf.isReduced(next) ? this.sink.end(t, this.xf.getResult(next)) : next;
};

TransduceSink.prototype.end = function (t, x) {
  return this.xf.result(x);
};

TransduceSink.prototype.error = function (t, e) {
  return this.sink.error(t, e);
};

function Transformer(sink) {
  this.time = -Infinity;
  this.sink = sink;
}

Transformer.prototype['@@transducer/init'] = Transformer.prototype.init = function () {};

Transformer.prototype['@@transducer/step'] = Transformer.prototype.step = function (t, x) {
  if (!isNaN(t)) {
    this.time = Math.max(t, this.time);
  }
  return this.sink.event(this.time, x);
};

Transformer.prototype['@@transducer/result'] = Transformer.prototype.result = function (x) {
  return this.sink.end(this.time, x);
};

/**
* Given an object supporting the new or legacy transducer protocol,
* create an adapter for it.
* @param {object} tx transform
* @returns {TxAdapter|LegacyTxAdapter}
*/
function getTxHandler(tx) {
  return typeof tx['@@transducer/step'] === 'function' ? new TxAdapter(tx) : new LegacyTxAdapter(tx);
}

/**
* Adapter for new official transducer protocol
* @param {object} tx transform
* @constructor
*/
function TxAdapter(tx) {
  this.tx = tx;
}

TxAdapter.prototype.step = function (t, x) {
  return this.tx['@@transducer/step'](t, x);
};
TxAdapter.prototype.result = function (x) {
  return this.tx['@@transducer/result'](x);
};
TxAdapter.prototype.isReduced = function (x) {
  return x != null && x['@@transducer/reduced'];
};
TxAdapter.prototype.getResult = function (x) {
  return x['@@transducer/value'];
};

/**
* Adapter for older transducer protocol
* @param {object} tx transform
* @constructor
*/
function LegacyTxAdapter(tx) {
  this.tx = tx;
}

LegacyTxAdapter.prototype.step = function (t, x) {
  return this.tx.step(t, x);
};
LegacyTxAdapter.prototype.result = function (x) {
  return this.tx.result(x);
};
LegacyTxAdapter.prototype.isReduced = function (x) {
  return x != null && x.__transducers_reduced__;
};
LegacyTxAdapter.prototype.getResult = function (x) {
  return x.value;
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Doubly linked list
 * @constructor
 */
function LinkedList() {
  this.head = null;
  this.length = 0;
}

/**
 * Add a node to the end of the list
 * @param {{prev:Object|null, next:Object|null, dispose:function}} x node to add
 */
LinkedList.prototype.add = function (x) {
  if (this.head !== null) {
    this.head.prev = x;
    x.next = this.head;
  }
  this.head = x;
  ++this.length;
};

/**
 * Remove the provided node from the list
 * @param {{prev:Object|null, next:Object|null, dispose:function}} x node to remove
 */
LinkedList.prototype.remove = function (x) {
  // eslint-disable-line  complexity
  --this.length;
  if (x === this.head) {
    this.head = this.head.next;
  }
  if (x.next !== null) {
    x.next.prev = x.prev;
    x.next = null;
  }
  if (x.prev !== null) {
    x.prev.next = x.next;
    x.prev = null;
  }
};

/**
 * @returns {boolean} true iff there are no nodes in the list
 */
LinkedList.prototype.isEmpty = function () {
  return this.length === 0;
};

/**
 * Dispose all nodes
 * @returns {Promise} promise that fulfills when all nodes have been disposed,
 *  or rejects if an error occurs while disposing
 */
LinkedList.prototype.dispose = function () {
  if (this.isEmpty()) {
    return Promise.resolve();
  }

  var promises = [];
  var x = this.head;
  this.head = null;
  this.length = 0;

  while (x !== null) {
    promises.push(x.dispose());
    x = x.next;
  }

  return Promise.all(promises);
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function mergeConcurrently(concurrency, stream) {
  return mergeMapConcurrently(id, concurrency, stream);
}

function mergeMapConcurrently(f, concurrency, stream) {
  return new Stream(new MergeConcurrently(f, concurrency, stream.source));
}

function MergeConcurrently(f, concurrency, source) {
  this.f = f;
  this.concurrency = concurrency;
  this.source = source;
}

MergeConcurrently.prototype.run = function (sink, scheduler) {
  return new Outer(this.f, this.concurrency, this.source, sink, scheduler);
};

function Outer(f, concurrency, source, sink, scheduler) {
  this.f = f;
  this.concurrency = concurrency;
  this.sink = sink;
  this.scheduler = scheduler;
  this.pending = [];
  this.current = new LinkedList();
  this.disposable = once(source.run(this, scheduler));
  this.active = true;
}

Outer.prototype.event = function (t, x) {
  this._addInner(t, x);
};

Outer.prototype._addInner = function (t, x) {
  if (this.current.length < this.concurrency) {
    this._startInner(t, x);
  } else {
    this.pending.push(x);
  }
};

Outer.prototype._startInner = function (t, x) {
  try {
    this._initInner(t, x);
  } catch (e) {
    this.error(t, e);
  }
};

Outer.prototype._initInner = function (t, x) {
  var innerSink = new Inner(t, this, this.sink);
  innerSink.disposable = mapAndRun(this.f, x, innerSink, this.scheduler);
  this.current.add(innerSink);
};

function mapAndRun(f, x, sink, scheduler) {
  return f(x).source.run(sink, scheduler);
}

Outer.prototype.end = function (t, x) {
  this.active = false;
  tryDispose(t, this.disposable, this.sink);
  this._checkEnd(t, x);
};

Outer.prototype.error = function (t, e) {
  this.active = false;
  this.sink.error(t, e);
};

Outer.prototype.dispose = function () {
  this.active = false;
  this.pending.length = 0;
  return Promise.all([this.disposable.dispose(), this.current.dispose()]);
};

Outer.prototype._endInner = function (t, x, inner) {
  this.current.remove(inner);
  tryDispose(t, inner, this);

  if (this.pending.length === 0) {
    this._checkEnd(t, x);
  } else {
    this._startInner(t, this.pending.shift());
  }
};

Outer.prototype._checkEnd = function (t, x) {
  if (!this.active && this.current.isEmpty()) {
    this.sink.end(t, x);
  }
};

function Inner(time, outer, sink) {
  this.prev = this.next = null;
  this.time = time;
  this.outer = outer;
  this.sink = sink;
  this.disposable = void 0;
}

Inner.prototype.event = function (t, x) {
  this.sink.event(Math.max(t, this.time), x);
};

Inner.prototype.end = function (t, x) {
  this.outer._endInner(Math.max(t, this.time), x, this);
};

Inner.prototype.error = function (t, e) {
  this.outer.error(Math.max(t, this.time), e);
};

Inner.prototype.dispose = function () {
  return this.disposable.dispose();
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Map each value in the stream to a new stream, and merge it into the
 * returned outer stream. Event arrival times are preserved.
 * @param {function(x:*):Stream} f chaining function, must return a Stream
 * @param {Stream} stream
 * @returns {Stream} new stream containing all events from each stream returned by f
 */
function flatMap(f, stream) {
  return mergeMapConcurrently(f, Infinity, stream);
}

/**
 * Monadic join. Flatten a Stream<Stream<X>> to Stream<X> by merging inner
 * streams to the outer. Event arrival times are preserved.
 * @param {Stream<Stream<X>>} stream stream of streams
 * @returns {Stream<X>} new stream containing all events of all inner streams
 */
function join(stream) {
  return mergeConcurrently(Infinity, stream);
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Map each value in stream to a new stream, and concatenate them all
 * stream:              -a---b---cX
 * f(a):                 1-1-1-1X
 * f(b):                        -2-2-2-2X
 * f(c):                                -3-3-3-3X
 * stream.concatMap(f): -1-1-1-1-2-2-2-2-3-3-3-3X
 * @param {function(x:*):Stream} f function to map each value to a stream
 * @param {Stream} stream
 * @returns {Stream} new stream containing all events from each stream returned by f
 */
function concatMap(f, stream) {
  return mergeMapConcurrently(f, 1, stream);
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

var copy$1 = copy;
var reduce$2 = reduce;

/**
 * @returns {Stream} stream containing events from all streams in the argument
 * list in time order.  If two events are simultaneous they will be merged in
 * arbitrary order.
 */
function merge() /* ...streams*/{
  return mergeArray(copy$1(arguments));
}

/**
 * @param {Array} streams array of stream to merge
 * @returns {Stream} stream containing events from all input observables
 * in time order.  If two events are simultaneous they will be merged in
 * arbitrary order.
 */
function mergeArray(streams) {
  var l = streams.length;
  return l === 0 ? empty$$1() : l === 1 ? streams[0] : new Stream(mergeSources(streams));
}

/**
 * This implements fusion/flattening for merge.  It will
 * fuse adjacent merge operations.  For example:
 * - a.merge(b).merge(c) effectively becomes merge(a, b, c)
 * - merge(a, merge(b, c)) effectively becomes merge(a, b, c)
 * It does this by concatenating the sources arrays of
 * any nested Merge sources, in effect "flattening" nested
 * merge operations into a single merge.
 */
function mergeSources(streams) {
  return new Merge(reduce$2(appendSources, [], streams));
}

function appendSources(sources, stream) {
  var source = stream.source;
  return source instanceof Merge ? sources.concat(source.sources) : sources.concat(source);
}

function Merge(sources) {
  this.sources = sources;
}

Merge.prototype.run = function (sink, scheduler) {
  var this$1 = this;

  var l = this.sources.length;
  var disposables = new Array(l);
  var sinks = new Array(l);

  var mergeSink = new MergeSink(disposables, sinks, sink);

  for (var indexSink, i = 0; i < l; ++i) {
    indexSink = sinks[i] = new IndexSink(i, mergeSink);
    disposables[i] = this$1.sources[i].run(indexSink, scheduler);
  }

  return all(disposables);
};

function MergeSink(disposables, sinks, sink) {
  this.sink = sink;
  this.disposables = disposables;
  this.activeCount = sinks.length;
}

MergeSink.prototype.error = Pipe.prototype.error;

MergeSink.prototype.event = function (t, indexValue) {
  this.sink.event(t, indexValue.value);
};

MergeSink.prototype.end = function (t, indexedValue) {
  tryDispose(t, this.disposables[indexedValue.index], this.sink);
  if (--this.activeCount === 0) {
    this.sink.end(t, indexedValue.value);
  }
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * When an event arrives on sampler, emit the result of calling f with the latest
 * values of all streams being sampled
 * @param {function(...values):*} f function to apply to each set of sampled values
 * @param {Stream} sampler streams will be sampled whenever an event arrives
 *  on sampler
 * @returns {Stream} stream of sampled and transformed values
 */


/**
 * When an event arrives on sampler, emit the latest event value from stream.
 * @param {Stream} sampler stream of events at whose arrival time
 *  stream's latest value will be propagated
 * @param {Stream} stream stream of values
 * @returns {Stream} sampled stream of values
 */
function sampleWith(sampler, stream) {
  return new Stream(new Sampler(id, sampler.source, [stream.source]));
}

function sampleArray(f, sampler, streams) {
  return new Stream(new Sampler(f, sampler.source, map(getSource$1, streams)));
}

function getSource$1(stream) {
  return stream.source;
}

function Sampler(f, sampler, sources) {
  this.f = f;
  this.sampler = sampler;
  this.sources = sources;
}

Sampler.prototype.run = function (sink, scheduler) {
  var this$1 = this;

  var l = this.sources.length;
  var disposables = new Array(l + 1);
  var sinks = new Array(l);

  var sampleSink = new SampleSink(this.f, sinks, sink);

  for (var hold, i = 0; i < l; ++i) {
    hold = sinks[i] = new Hold(sampleSink);
    disposables[i] = this$1.sources[i].run(hold, scheduler);
  }

  disposables[i] = this.sampler.run(sampleSink, scheduler);

  return all(disposables);
};

function Hold(sink) {
  this.sink = sink;
  this.hasValue = false;
}

Hold.prototype.event = function (t, x) {
  this.value = x;
  this.hasValue = true;
  this.sink._notify(this);
};

Hold.prototype.end = function () {};
Hold.prototype.error = Pipe.prototype.error;

function SampleSink(f, sinks, sink) {
  this.f = f;
  this.sinks = sinks;
  this.sink = sink;
  this.active = false;
}

SampleSink.prototype._notify = function () {
  if (!this.active) {
    this.active = this.sinks.every(hasValue);
  }
};

SampleSink.prototype.event = function (t) {
  if (this.active) {
    this.sink.event(t, invoke(this.f, map(getValue, this.sinks)));
  }
};

SampleSink.prototype.end = Pipe.prototype.end;
SampleSink.prototype.error = Pipe.prototype.error;

function hasValue(hold) {
  return hold.hasValue;
}

function getValue(hold) {
  return hold.value;
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

// Based on https://github.com/petkaantonov/deque

function Queue(capPow2) {
  this._capacity = capPow2 || 32;
  this._length = 0;
  this._head = 0;
}

Queue.prototype.push = function (x) {
  var len = this._length;
  this._checkCapacity(len + 1);

  var i = this._head + len & this._capacity - 1;
  this[i] = x;
  this._length = len + 1;
};

Queue.prototype.shift = function () {
  var head = this._head;
  var x = this[head];

  this[head] = void 0;
  this._head = head + 1 & this._capacity - 1;
  this._length--;
  return x;
};

Queue.prototype.isEmpty = function () {
  return this._length === 0;
};

Queue.prototype.length = function () {
  return this._length;
};

Queue.prototype._checkCapacity = function (size) {
  if (this._capacity < size) {
    this._ensureCapacity(this._capacity << 1);
  }
};

Queue.prototype._ensureCapacity = function (capacity) {
  var oldCapacity = this._capacity;
  this._capacity = capacity;

  var last = this._head + this._length;

  if (last > oldCapacity) {
    copy$2(this, 0, this, oldCapacity, last & oldCapacity - 1);
  }
};

function copy$2(src, srcIndex, dst, dstIndex, len) {
  for (var j = 0; j < len; ++j) {
    dst[j + dstIndex] = src[j + srcIndex];
    src[j + srcIndex] = void 0;
  }
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

var map$4 = map;
var tail$2 = tail;

/**
 * Combine streams pairwise (or tuple-wise) by index by applying f to values
 * at corresponding indices.  The returned stream ends when any of the input
 * streams ends.
 * @param {function} f function to combine values
 * @returns {Stream} new stream with items at corresponding indices combined
 *  using f
 */


/**
* Combine streams pairwise (or tuple-wise) by index by applying f to values
* at corresponding indices.  The returned stream ends when any of the input
* streams ends.
* @param {function} f function to combine values
* @param {[Stream]} streams streams to zip using f
* @returns {Stream} new stream with items at corresponding indices combined
*  using f
*/
function zipArray(f, streams) {
  return streams.length === 0 ? empty$$1() : streams.length === 1 ? map$2(f, streams[0]) : new Stream(new Zip(f, map$4(getSource$2, streams)));
}

function getSource$2(stream) {
  return stream.source;
}

function Zip(f, sources) {
  this.f = f;
  this.sources = sources;
}

Zip.prototype.run = function (sink, scheduler) {
  var this$1 = this;

  var l = this.sources.length;
  var disposables = new Array(l);
  var sinks = new Array(l);
  var buffers = new Array(l);

  var zipSink = new ZipSink(this.f, buffers, sinks, sink);

  for (var indexSink, i = 0; i < l; ++i) {
    buffers[i] = new Queue();
    indexSink = sinks[i] = new IndexSink(i, zipSink);
    disposables[i] = this$1.sources[i].run(indexSink, scheduler);
  }

  return all(disposables);
};

function ZipSink(f, buffers, sinks, sink) {
  this.f = f;
  this.sinks = sinks;
  this.sink = sink;
  this.buffers = buffers;
}

ZipSink.prototype.event = function (t, indexedValue) {
  // eslint-disable-line complexity
  var buffers = this.buffers;
  var buffer = buffers[indexedValue.index];

  buffer.push(indexedValue.value);

  if (buffer.length() === 1) {
    if (!ready(this.buffers)) {
      return;
    }

    emitZipped(this.f, t, buffers, this.sink);

    if (ended(this.buffers, this.sinks)) {
      this.sink.end(t, void 0);
    }
  }
};

ZipSink.prototype.end = function (t, indexedValue) {
  var buffer = this.buffers[indexedValue.index];
  if (buffer.isEmpty()) {
    this.sink.end(t, indexedValue.value);
  }
};

ZipSink.prototype.error = Pipe.prototype.error;

function emitZipped(f, t, buffers, sink) {
  sink.event(t, invoke(f, map$4(head, buffers)));
}

function head(buffer) {
  return buffer.shift();
}

function ended(buffers, sinks) {
  for (var i = 0, l = buffers.length; i < l; ++i) {
    if (buffers[i].isEmpty() && !sinks[i].active) {
      return true;
    }
  }
  return false;
}

function ready(buffers) {
  for (var i = 0, l = buffers.length; i < l; ++i) {
    if (buffers[i].isEmpty()) {
      return false;
    }
  }
  return true;
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Given a stream of streams, return a new stream that adopts the behavior
 * of the most recent inner stream.
 * @param {Stream} stream of streams on which to switch
 * @returns {Stream} switching stream
 */
function switchLatest(stream) {
  return new Stream(new Switch(stream.source));
}

function Switch(source) {
  this.source = source;
}

Switch.prototype.run = function (sink, scheduler) {
  var switchSink = new SwitchSink(sink, scheduler);
  return all([switchSink, this.source.run(switchSink, scheduler)]);
};

function SwitchSink(sink, scheduler) {
  this.sink = sink;
  this.scheduler = scheduler;
  this.current = null;
  this.ended = false;
}

SwitchSink.prototype.event = function (t, stream) {
  this._disposeCurrent(t); // TODO: capture the result of this dispose
  this.current = new Segment(t, Infinity, this, this.sink);
  this.current.disposable = stream.source.run(this.current, this.scheduler);
};

SwitchSink.prototype.end = function (t, x) {
  this.ended = true;
  this._checkEnd(t, x);
};

SwitchSink.prototype.error = function (t, e) {
  this.ended = true;
  this.sink.error(t, e);
};

SwitchSink.prototype.dispose = function () {
  return this._disposeCurrent(this.scheduler.now());
};

SwitchSink.prototype._disposeCurrent = function (t) {
  if (this.current !== null) {
    return this.current._dispose(t);
  }
};

SwitchSink.prototype._disposeInner = function (t, inner) {
  inner._dispose(t); // TODO: capture the result of this dispose
  if (inner === this.current) {
    this.current = null;
  }
};

SwitchSink.prototype._checkEnd = function (t, x) {
  if (this.ended && this.current === null) {
    this.sink.end(t, x);
  }
};

SwitchSink.prototype._endInner = function (t, x, inner) {
  this._disposeInner(t, inner);
  this._checkEnd(t, x);
};

SwitchSink.prototype._errorInner = function (t, e, inner) {
  this._disposeInner(t, inner);
  this.sink.error(t, e);
};

function Segment(min, max, outer, sink) {
  this.min = min;
  this.max = max;
  this.outer = outer;
  this.sink = sink;
  this.disposable = empty$1();
}

Segment.prototype.event = function (t, x) {
  if (t < this.max) {
    this.sink.event(Math.max(t, this.min), x);
  }
};

Segment.prototype.end = function (t, x) {
  this.outer._endInner(Math.max(t, this.min), x, this);
};

Segment.prototype.error = function (t, e) {
  this.outer._errorInner(Math.max(t, this.min), e, this);
};

Segment.prototype._dispose = function (t) {
  this.max = t;
  tryDispose(t, this.disposable, this.sink);
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Retain only items matching a predicate
 * @param {function(x:*):boolean} p filtering predicate called for each item
 * @param {Stream} stream stream to filter
 * @returns {Stream} stream containing only items for which predicate returns truthy
 */
function filter(p, stream) {
  return new Stream(Filter.create(p, stream.source));
}

/**
 * Skip repeated events, using === to detect duplicates
 * @param {Stream} stream stream from which to omit repeated events
 * @returns {Stream} stream without repeated events
 */
function skipRepeats(stream) {
  return skipRepeatsWith(same, stream);
}

/**
 * Skip repeated events using the provided equals function to detect duplicates
 * @param {function(a:*, b:*):boolean} equals optional function to compare items
 * @param {Stream} stream stream from which to omit repeated events
 * @returns {Stream} stream without repeated events
 */
function skipRepeatsWith(equals, stream) {
  return new Stream(new SkipRepeats(equals, stream.source));
}

function SkipRepeats(equals, source) {
  this.equals = equals;
  this.source = source;
}

SkipRepeats.prototype.run = function (sink, scheduler) {
  return this.source.run(new SkipRepeatsSink(this.equals, sink), scheduler);
};

function SkipRepeatsSink(equals, sink) {
  this.equals = equals;
  this.sink = sink;
  this.value = void 0;
  this.init = true;
}

SkipRepeatsSink.prototype.end = Pipe.prototype.end;
SkipRepeatsSink.prototype.error = Pipe.prototype.error;

SkipRepeatsSink.prototype.event = function (t, x) {
  if (this.init) {
    this.init = false;
    this.value = x;
    this.sink.event(t, x);
  } else if (!this.equals(this.value, x)) {
    this.value = x;
    this.sink.event(t, x);
  }
};

function same(a, b) {
  return a === b;
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * @param {number} n
 * @param {Stream} stream
 * @returns {Stream} new stream containing only up to the first n items from stream
 */
function take(n, stream) {
  return slice(0, n, stream);
}

/**
 * @param {number} n
 * @param {Stream} stream
 * @returns {Stream} new stream with the first n items removed
 */
function skip(n, stream) {
  return slice(n, Infinity, stream);
}

/**
 * Slice a stream by index. Negative start/end indexes are not supported
 * @param {number} start
 * @param {number} end
 * @param {Stream} stream
 * @returns {Stream} stream containing items where start <= index < end
 */
function slice(start, end, stream) {
  return end <= start ? empty$$1() : new Stream(sliceSource(start, end, stream.source));
}

function sliceSource(start, end, source) {
  return source instanceof Map ? commuteMapSlice(start, end, source) : source instanceof Slice ? fuseSlice(start, end, source) : new Slice(start, end, source);
}

function commuteMapSlice(start, end, source) {
  return Map.create(source.f, sliceSource(start, end, source.source));
}

function fuseSlice(start, end, source) {
  start += source.min;
  end = Math.min(end + source.min, source.max);
  return new Slice(start, end, source.source);
}

function Slice(min, max, source) {
  this.source = source;
  this.min = min;
  this.max = max;
}

Slice.prototype.run = function (sink, scheduler) {
  return new SliceSink(this.min, this.max - this.min, this.source, sink, scheduler);
};

function SliceSink(skip, take, source, sink, scheduler) {
  this.sink = sink;
  this.skip = skip;
  this.take = take;
  this.disposable = once(source.run(this, scheduler));
}

SliceSink.prototype.end = Pipe.prototype.end;
SliceSink.prototype.error = Pipe.prototype.error;

SliceSink.prototype.event = function (t, x) {
  // eslint-disable-line complexity
  if (this.skip > 0) {
    this.skip -= 1;
    return;
  }

  if (this.take === 0) {
    return;
  }

  this.take -= 1;
  this.sink.event(t, x);
  if (this.take === 0) {
    this.dispose();
    this.sink.end(t, x);
  }
};

SliceSink.prototype.dispose = function () {
  return this.disposable.dispose();
};

function takeWhile(p, stream) {
  return new Stream(new TakeWhile(p, stream.source));
}

function TakeWhile(p, source) {
  this.p = p;
  this.source = source;
}

TakeWhile.prototype.run = function (sink, scheduler) {
  return new TakeWhileSink(this.p, this.source, sink, scheduler);
};

function TakeWhileSink(p, source, sink, scheduler) {
  this.p = p;
  this.sink = sink;
  this.active = true;
  this.disposable = once(source.run(this, scheduler));
}

TakeWhileSink.prototype.end = Pipe.prototype.end;
TakeWhileSink.prototype.error = Pipe.prototype.error;

TakeWhileSink.prototype.event = function (t, x) {
  if (!this.active) {
    return;
  }

  var p = this.p;
  this.active = p(x);
  if (this.active) {
    this.sink.event(t, x);
  } else {
    this.dispose();
    this.sink.end(t, x);
  }
};

TakeWhileSink.prototype.dispose = function () {
  return this.disposable.dispose();
};

function skipWhile(p, stream) {
  return new Stream(new SkipWhile(p, stream.source));
}

function SkipWhile(p, source) {
  this.p = p;
  this.source = source;
}

SkipWhile.prototype.run = function (sink, scheduler) {
  return this.source.run(new SkipWhileSink(this.p, sink), scheduler);
};

function SkipWhileSink(p, sink) {
  this.p = p;
  this.sink = sink;
  this.skipping = true;
}

SkipWhileSink.prototype.end = Pipe.prototype.end;
SkipWhileSink.prototype.error = Pipe.prototype.error;

SkipWhileSink.prototype.event = function (t, x) {
  if (this.skipping) {
    var p = this.p;
    this.skipping = p(x);
    if (this.skipping) {
      return;
    }
  }

  this.sink.event(t, x);
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function takeUntil(signal, stream) {
  return new Stream(new Until(signal.source, stream.source));
}

function skipUntil(signal, stream) {
  return new Stream(new Since(signal.source, stream.source));
}

function during(timeWindow, stream) {
  return takeUntil(join(timeWindow), skipUntil(timeWindow, stream));
}

function Until(maxSignal, source) {
  this.maxSignal = maxSignal;
  this.source = source;
}

Until.prototype.run = function (sink, scheduler) {
  var min = new Bound(-Infinity, sink);
  var max = new UpperBound(this.maxSignal, sink, scheduler);
  var disposable = this.source.run(new TimeWindowSink(min, max, sink), scheduler);

  return all([min, max, disposable]);
};

function Since(minSignal, source) {
  this.minSignal = minSignal;
  this.source = source;
}

Since.prototype.run = function (sink, scheduler) {
  var min = new LowerBound(this.minSignal, sink, scheduler);
  var max = new Bound(Infinity, sink);
  var disposable = this.source.run(new TimeWindowSink(min, max, sink), scheduler);

  return all([min, max, disposable]);
};

function Bound(value, sink) {
  this.value = value;
  this.sink = sink;
}

Bound.prototype.error = Pipe.prototype.error;
Bound.prototype.event = noop;
Bound.prototype.end = noop;
Bound.prototype.dispose = noop;

function TimeWindowSink(min, max, sink) {
  this.min = min;
  this.max = max;
  this.sink = sink;
}

TimeWindowSink.prototype.event = function (t, x) {
  if (t >= this.min.value && t < this.max.value) {
    this.sink.event(t, x);
  }
};

TimeWindowSink.prototype.error = Pipe.prototype.error;
TimeWindowSink.prototype.end = Pipe.prototype.end;

function LowerBound(signal, sink, scheduler) {
  this.value = Infinity;
  this.sink = sink;
  this.disposable = signal.run(this, scheduler);
}

LowerBound.prototype.event = function (t /*, x */) {
  if (t < this.value) {
    this.value = t;
  }
};

LowerBound.prototype.end = noop;
LowerBound.prototype.error = Pipe.prototype.error;

LowerBound.prototype.dispose = function () {
  return this.disposable.dispose();
};

function UpperBound(signal, sink, scheduler) {
  this.value = Infinity;
  this.sink = sink;
  this.disposable = signal.run(this, scheduler);
}

UpperBound.prototype.event = function (t, x) {
  if (t < this.value) {
    this.value = t;
    this.sink.end(t, x);
  }
};

UpperBound.prototype.end = noop;
UpperBound.prototype.error = Pipe.prototype.error;

UpperBound.prototype.dispose = function () {
  return this.disposable.dispose();
};

function noop() {}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * @param {Number} delayTime milliseconds to delay each item
 * @param {Stream} stream
 * @returns {Stream} new stream containing the same items, but delayed by ms
 */
function delay(delayTime, stream) {
  return delayTime <= 0 ? stream : new Stream(new Delay(delayTime, stream.source));
}

function Delay(dt, source) {
  this.dt = dt;
  this.source = source;
}

Delay.prototype.run = function (sink, scheduler) {
  var delaySink = new DelaySink(this.dt, sink, scheduler);
  return all([delaySink, this.source.run(delaySink, scheduler)]);
};

function DelaySink(dt, sink, scheduler) {
  this.dt = dt;
  this.sink = sink;
  this.scheduler = scheduler;
}

DelaySink.prototype.dispose = function () {
  var self = this;
  this.scheduler.cancelAll(function (task) {
    return task.sink === self.sink;
  });
};

DelaySink.prototype.event = function (t, x) {
  this.scheduler.delay(this.dt, PropagateTask.event(x, this.sink));
};

DelaySink.prototype.end = function (t, x) {
  this.scheduler.delay(this.dt, PropagateTask.end(x, this.sink));
};

DelaySink.prototype.error = Pipe.prototype.error;

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function timestamp(stream) {
  return new Stream(new Timestamp(stream.source));
}

function Timestamp(source) {
  this.source = source;
}

Timestamp.prototype.run = function (sink, scheduler) {
  return this.source.run(new TimestampSink(sink), scheduler);
};

function TimestampSink(sink) {
  this.sink = sink;
}

TimestampSink.prototype.end = Pipe.prototype.end;
TimestampSink.prototype.error = Pipe.prototype.error;

TimestampSink.prototype.event = function (t, x) {
  this.sink.event(t, { time: t, value: x });
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Limit the rate of events by suppressing events that occur too often
 * @param {Number} period time to suppress events
 * @param {Stream} stream
 * @returns {Stream}
 */
function throttle(period, stream) {
  return new Stream(throttleSource(period, stream.source));
}

function throttleSource(period, source) {
  return source instanceof Map ? commuteMapThrottle(period, source) : source instanceof Throttle ? fuseThrottle(period, source) : new Throttle(period, source);
}

function commuteMapThrottle(period, source) {
  return Map.create(source.f, throttleSource(period, source.source));
}

function fuseThrottle(period, source) {
  return new Throttle(Math.max(period, source.period), source.source);
}

function Throttle(period, source) {
  this.period = period;
  this.source = source;
}

Throttle.prototype.run = function (sink, scheduler) {
  return this.source.run(new ThrottleSink(this.period, sink), scheduler);
};

function ThrottleSink(period, sink) {
  this.time = 0;
  this.period = period;
  this.sink = sink;
}

ThrottleSink.prototype.event = function (t, x) {
  if (t >= this.time) {
    this.time = t + this.period;
    this.sink.event(t, x);
  }
};

ThrottleSink.prototype.end = Pipe.prototype.end;

ThrottleSink.prototype.error = Pipe.prototype.error;

/**
 * Wait for a burst of events to subside and emit only the last event in the burst
 * @param {Number} period events occuring more frequently than this
 *  will be suppressed
 * @param {Stream} stream stream to debounce
 * @returns {Stream} new debounced stream
 */
function debounce(period, stream) {
  return new Stream(new Debounce(period, stream.source));
}

function Debounce(dt, source) {
  this.dt = dt;
  this.source = source;
}

Debounce.prototype.run = function (sink, scheduler) {
  return new DebounceSink(this.dt, this.source, sink, scheduler);
};

function DebounceSink(dt, source, sink, scheduler) {
  this.dt = dt;
  this.sink = sink;
  this.scheduler = scheduler;
  this.value = void 0;
  this.timer = null;

  var sourceDisposable = source.run(this, scheduler);
  this.disposable = all([this, sourceDisposable]);
}

DebounceSink.prototype.event = function (t, x) {
  this._clearTimer();
  this.value = x;
  this.timer = this.scheduler.delay(this.dt, PropagateTask.event(x, this.sink));
};

DebounceSink.prototype.end = function (t, x) {
  if (this._clearTimer()) {
    this.sink.event(t, this.value);
    this.value = void 0;
  }
  this.sink.end(t, x);
};

DebounceSink.prototype.error = function (t, x) {
  this._clearTimer();
  this.sink.error(t, x);
};

DebounceSink.prototype.dispose = function () {
  this._clearTimer();
};

DebounceSink.prototype._clearTimer = function () {
  if (this.timer === null) {
    return false;
  }
  this.timer.dispose();
  this.timer = null;
  return true;
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Create a stream containing only the promise's fulfillment
 * value at the time it fulfills.
 * @param {Promise<T>} p promise
 * @return {Stream<T>} stream containing promise's fulfillment value.
 *  If the promise rejects, the stream will error
 */


/**
 * Turn a Stream<Promise<T>> into Stream<T> by awaiting each promise.
 * Event order is preserved.
 * @param {Stream<Promise<T>>} stream
 * @return {Stream<T>} stream of fulfillment values.  The stream will
 * error if any promise rejects.
 */
function awaitPromises(stream) {
  return new Stream(new Await(stream.source));
}

function Await(source) {
  this.source = source;
}

Await.prototype.run = function (sink, scheduler) {
  return this.source.run(new AwaitSink(sink, scheduler), scheduler);
};

function AwaitSink(sink, scheduler) {
  this.sink = sink;
  this.scheduler = scheduler;
  this.queue = Promise.resolve();
  var self = this;

  // Pre-create closures, to avoid creating them per event
  this._eventBound = function (x) {
    self.sink.event(self.scheduler.now(), x);
  };

  this._endBound = function (x) {
    self.sink.end(self.scheduler.now(), x);
  };

  this._errorBound = function (e) {
    self.sink.error(self.scheduler.now(), e);
  };
}

AwaitSink.prototype.event = function (t, promise) {
  var self = this;
  this.queue = this.queue.then(function () {
    return self._event(promise);
  }).catch(this._errorBound);
};

AwaitSink.prototype.end = function (t, x) {
  var self = this;
  this.queue = this.queue.then(function () {
    return self._end(x);
  }).catch(this._errorBound);
};

AwaitSink.prototype.error = function (t, e) {
  var self = this;
  // Don't resolve error values, propagate directly
  this.queue = this.queue.then(function () {
    return self._errorBound(e);
  }).catch(fatalError);
};

AwaitSink.prototype._event = function (promise) {
  return promise.then(this._eventBound);
};

AwaitSink.prototype._end = function (x) {
  return Promise.resolve(x).then(this._endBound);
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function SafeSink(sink) {
  this.sink = sink;
  this.active = true;
}

SafeSink.prototype.event = function (t, x) {
  if (!this.active) {
    return;
  }
  this.sink.event(t, x);
};

SafeSink.prototype.end = function (t, x) {
  if (!this.active) {
    return;
  }
  this.disable();
  this.sink.end(t, x);
};

SafeSink.prototype.error = function (t, e) {
  this.disable();
  this.sink.error(t, e);
};

SafeSink.prototype.disable = function () {
  this.active = false;
  return this.sink;
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * If stream encounters an error, recover and continue with items from stream
 * returned by f.
 * @param {function(error:*):Stream} f function which returns a new stream
 * @param {Stream} stream
 * @returns {Stream} new stream which will recover from an error by calling f
 */
function recoverWith(f, stream) {
  return new Stream(new RecoverWith(f, stream.source));
}

var flatMapError = recoverWith;

/**
 * Create a stream containing only an error
 * @param {*} e error value, preferably an Error or Error subtype
 * @returns {Stream} new stream containing only an error
 */


function runError(t, e, sink) {
  sink.error(t, e);
}

function RecoverWith(f, source) {
  this.f = f;
  this.source = source;
}

RecoverWith.prototype.run = function (sink, scheduler) {
  return new RecoverWithSink(this.f, this.source, sink, scheduler);
};

function RecoverWithSink(f, source, sink, scheduler) {
  this.f = f;
  this.sink = new SafeSink(sink);
  this.scheduler = scheduler;
  this.disposable = source.run(this, scheduler);
}

RecoverWithSink.prototype.event = function (t, x) {
  tryEvent(t, x, this.sink);
};

RecoverWithSink.prototype.end = function (t, x) {
  tryEnd(t, x, this.sink);
};

RecoverWithSink.prototype.error = function (t, e) {
  var nextSink = this.sink.disable();

  tryDispose(t, this.disposable, this.sink);
  this._startNext(t, e, nextSink);
};

RecoverWithSink.prototype._startNext = function (t, x, sink) {
  try {
    this.disposable = this._continue(this.f, x, sink);
  } catch (e) {
    sink.error(t, e);
  }
};

RecoverWithSink.prototype._continue = function (f, x, sink) {
  var stream = f(x);
  return stream.source.run(sink, this.scheduler);
};

RecoverWithSink.prototype.dispose = function () {
  return this.disposable.dispose();
};

var MulticastDisposable = function MulticastDisposable(source, sink) {
  this.source = source;
  this.sink = sink;
  this.disposed = false;
};

MulticastDisposable.prototype.dispose = function dispose() {
  if (this.disposed) {
    return;
  }
  this.disposed = true;
  var remaining = this.source.remove(this.sink);
  return remaining === 0 && this.source._dispose();
};

function tryEvent$1(t, x, sink) {
  try {
    sink.event(t, x);
  } catch (e) {
    sink.error(t, e);
  }
}

function tryEnd$1(t, x, sink) {
  try {
    sink.end(t, x);
  } catch (e) {
    sink.error(t, e);
  }
}

var dispose = function (disposable) {
  return disposable.dispose();
};

var emptyDisposable = {
  dispose: function dispose$1() {}
};

var MulticastSource = function MulticastSource(source) {
  this.source = source;
  this.sinks = [];
  this._disposable = emptyDisposable;
};

MulticastSource.prototype.run = function run(sink, scheduler) {
  var n = this.add(sink);
  if (n === 1) {
    this._disposable = this.source.run(this, scheduler);
  }
  return new MulticastDisposable(this, sink);
};

MulticastSource.prototype._dispose = function _dispose() {
  var disposable = this._disposable;
  this._disposable = emptyDisposable;
  return Promise.resolve(disposable).then(dispose);
};

MulticastSource.prototype.add = function add(sink) {
  this.sinks = append(sink, this.sinks);
  return this.sinks.length;
};

MulticastSource.prototype.remove = function remove$1(sink) {
  var i = findIndex(sink, this.sinks);
  // istanbul ignore next
  if (i >= 0) {
    this.sinks = remove(i, this.sinks);
  }

  return this.sinks.length;
};

MulticastSource.prototype.event = function event(time, value) {
  var s = this.sinks;
  if (s.length === 1) {
    return s[0].event(time, value);
  }
  for (var i = 0; i < s.length; ++i) {
    tryEvent$1(time, value, s[i]);
  }
};

MulticastSource.prototype.end = function end(time, value) {
  var s = this.sinks;
  for (var i = 0; i < s.length; ++i) {
    tryEnd$1(time, value, s[i]);
  }
};

MulticastSource.prototype.error = function error(time, err) {
  var s = this.sinks;
  for (var i = 0; i < s.length; ++i) {
    s[i].error(time, err);
  }
};

function multicast(stream) {
  var source = stream.source;
  return source instanceof MulticastSource ? stream : new stream.constructor(new MulticastSource(source));
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

// Add of and empty to constructor for fantasy-land compat
Stream.of = of;
Stream.empty = empty$$1;
// Add from to constructor for ES Observable compat
Stream.from = from;
// -----------------------------------------------------------------------
// Draft ES Observable proposal interop
// https://github.com/zenparsing/es-observable

Stream.prototype.subscribe = function (subscriber) {
  return subscribe(subscriber, this);
};

Stream.prototype[result] = function () {
  return this;
};

// -----------------------------------------------------------------------
// Fluent adapter

/**
 * Adapt a functional stream transform to fluent style.
 * It applies f to the this stream object
 * @param  {function(s: Stream): Stream} f function that
 * receives the stream itself and must return a new stream
 * @return {Stream}
 */
Stream.prototype.thru = function (f) {
  return thru(f, this);
};

// -----------------------------------------------------------------------
// Observing

/**
 * Process all the events in the stream
 * @returns {Promise} promise that fulfills when the stream ends, or rejects
 *  if the stream fails with an unhandled error.
 */
Stream.prototype.observe = Stream.prototype.forEach = function (f) {
  return observe(f, this);
};

/**
 * Consume all events in the stream, without providing a function to process each.
 * This causes a stream to become active and begin emitting events, and is useful
 * in cases where all processing has been setup upstream via other combinators, and
 * there is no need to process the terminal events.
 * @returns {Promise} promise that fulfills when the stream ends, or rejects
 *  if the stream fails with an unhandled error.
 */
Stream.prototype.drain = function () {
  return drain(this);
};

// -------------------------------------------------------

/**
 * Generalized feedback loop. Call a stepper function for each event. The stepper
 * will be called with 2 params: the current seed and the an event value.  It must
 * return a new { seed, value } pair. The `seed` will be fed back into the next
 * invocation of stepper, and the `value` will be propagated as the event value.
 * @param {function(seed:*, value:*):{seed:*, value:*}} stepper loop step function
 * @param {*} seed initial seed value passed to first stepper call
 * @returns {Stream} new stream whose values are the `value` field of the objects
 * returned by the stepper
 */
Stream.prototype.loop = function (stepper, seed) {
  return loop(stepper, seed, this);
};

// -------------------------------------------------------

/**
 * Create a stream containing successive reduce results of applying f to
 * the previous reduce result and the current stream item.
 * @param {function(result:*, x:*):*} f reducer function
 * @param {*} initial initial value
 * @returns {Stream} new stream containing successive reduce results
 */
Stream.prototype.scan = function (f, initial) {
  return scan(f, initial, this);
};

/**
 * Reduce the stream to produce a single result.  Note that reducing an infinite
 * stream will return a Promise that never fulfills, but that may reject if an error
 * occurs.
 * @param {function(result:*, x:*):*} f reducer function
 * @param {*} initial optional initial value
 * @returns {Promise} promise for the file result of the reduce
 */
Stream.prototype.reduce = function (f, initial) {
  return reduce$1(f, initial, this);
};

/**
 * @param {Stream} tail
 * @returns {Stream} new stream containing all items in this followed by
 *  all items in tail
 */
Stream.prototype.concat = function (tail$$1) {
  return concat(this, tail$$1);
};

/**
 * @param {*} x value to prepend
 * @returns {Stream} a new stream with x prepended
 */
Stream.prototype.startWith = function (x) {
  return cons$1(x, this);
};

// -----------------------------------------------------------------------
// Transforming

/**
 * Transform each value in the stream by applying f to each
 * @param {function(*):*} f mapping function
 * @returns {Stream} stream containing items transformed by f
 */
Stream.prototype.map = function (f) {
  return map$2(f, this);
};

/**
 * Assume this stream contains functions, and apply each function to each item
 * in the provided stream.  This generates, in effect, a cross product.
 * @param {Stream} xs stream of items to which
 * @returns {Stream} stream containing the cross product of items
 */
Stream.prototype.ap = function (xs) {
  return ap(this, xs);
};

/**
 * Replace each value in the stream with x
 * @param {*} x
 * @returns {Stream} stream containing items replaced with x
 */
Stream.prototype.constant = function (x) {
  return constant(x, this);
};

/**
 * Perform a side effect for each item in the stream
 * @param {function(x:*):*} f side effect to execute for each item. The
 *  return value will be discarded.
 * @returns {Stream} new stream containing the same items as this stream
 */
Stream.prototype.tap = function (f) {
  return tap(f, this);
};

// -----------------------------------------------------------------------
// Transducer support

/**
 * Transform this stream by passing its events through a transducer.
 * @param  {function} transducer transducer function
 * @return {Stream} stream of events transformed by the transducer
 */
Stream.prototype.transduce = function (transducer) {
  return transduce(transducer, this);
};

// -----------------------------------------------------------------------
// FlatMapping

/**
 * Map each value in the stream to a new stream, and merge it into the
 * returned outer stream. Event arrival times are preserved.
 * @param {function(x:*):Stream} f chaining function, must return a Stream
 * @returns {Stream} new stream containing all events from each stream returned by f
 */
Stream.prototype.chain = function (f) {
  return flatMap(f, this);
};

// @deprecated use chain instead
Stream.prototype.flatMap = Stream.prototype.chain;

/**
* Monadic join. Flatten a Stream<Stream<X>> to Stream<X> by merging inner
* streams to the outer. Event arrival times are preserved.
* @returns {Stream<X>} new stream containing all events of all inner streams
*/
Stream.prototype.join = function () {
  return join(this);
};

/**
 * Map the end event to a new stream, and begin emitting its values.
 * @param {function(x:*):Stream} f function that receives the end event value,
 * and *must* return a new Stream to continue with.
 * @returns {Stream} new stream that emits all events from the original stream,
 * followed by all events from the stream returned by f.
 */
Stream.prototype.continueWith = function (f) {
  return continueWith(f, this);
};

// @deprecated use continueWith instead
Stream.prototype.flatMapEnd = Stream.prototype.continueWith;

Stream.prototype.concatMap = function (f) {
  return concatMap(f, this);
};

// -----------------------------------------------------------------------
// Concurrent merging

/**
 * Flatten a Stream<Stream<X>> to Stream<X> by merging inner
 * streams to the outer, limiting the number of inner streams that may
 * be active concurrently.
 * @param {number} concurrency at most this many inner streams will be
 *  allowed to be active concurrently.
 * @return {Stream<X>} new stream containing all events of all inner
 *  streams, with limited concurrency.
 */
Stream.prototype.mergeConcurrently = function (concurrency) {
  return mergeConcurrently(concurrency, this);
};

// -----------------------------------------------------------------------
// Merging

/**
 * Merge this stream and all the provided streams
 * @returns {Stream} stream containing items from this stream and s in time
 * order.  If two events are simultaneous they will be merged in
 * arbitrary order.
 */
Stream.prototype.merge = function () /* ...streams*/{
  return mergeArray(cons(this, arguments));
};

// -----------------------------------------------------------------------
// Combining

/**
 * Combine latest events from all input streams
 * @param {function(...events):*} f function to combine most recent events
 * @returns {Stream} stream containing the result of applying f to the most recent
 *  event of each input stream, whenever a new event arrives on any stream.
 */
Stream.prototype.combine = function (f /*, ...streams*/) {
  return combineArray(f, replace(this, 0, arguments));
};

// -----------------------------------------------------------------------
// Sampling

/**
 * When an event arrives on sampler, emit the latest event value from stream.
 * @param {Stream} sampler stream of events at whose arrival time
 *  signal's latest value will be propagated
 * @returns {Stream} sampled stream of values
 */
Stream.prototype.sampleWith = function (sampler) {
  return sampleWith(sampler, this);
};

/**
 * When an event arrives on this stream, emit the result of calling f with the latest
 * values of all streams being sampled
 * @param {function(...values):*} f function to apply to each set of sampled values
 * @returns {Stream} stream of sampled and transformed values
 */
Stream.prototype.sample = function (f /* ...streams */) {
  return sampleArray(f, this, tail(arguments));
};

// -----------------------------------------------------------------------
// Zipping

/**
 * Pair-wise combine items with those in s. Given 2 streams:
 * [1,2,3] zipWith f [4,5,6] -> [f(1,4),f(2,5),f(3,6)]
 * Note: zip causes fast streams to buffer and wait for slow streams.
 * @param {function(a:Stream, b:Stream, ...):*} f function to combine items
 * @returns {Stream} new stream containing pairs
 */
Stream.prototype.zip = function (f /*, ...streams*/) {
  return zipArray(f, replace(this, 0, arguments));
};

// -----------------------------------------------------------------------
// Switching

/**
 * Given a stream of streams, return a new stream that adopts the behavior
 * of the most recent inner stream.
 * @returns {Stream} switching stream
 */
Stream.prototype.switchLatest = function () {
  return switchLatest(this);
};

// @deprecated use switchLatest instead
Stream.prototype.switch = Stream.prototype.switchLatest;

// -----------------------------------------------------------------------
// Filtering

/**
 * Retain only items matching a predicate
 * stream:                           -12345678-
 * filter(x => x % 2 === 0, stream): --2-4-6-8-
 * @param {function(x:*):boolean} p filtering predicate called for each item
 * @returns {Stream} stream containing only items for which predicate returns truthy
 */
Stream.prototype.filter = function (p) {
  return filter(p, this);
};

/**
 * Skip repeated events, using === to compare items
 * stream:           -abbcd-
 * distinct(stream): -ab-cd-
 * @returns {Stream} stream with no repeated events
 */
Stream.prototype.skipRepeats = function () {
  return skipRepeats(this);
};

/**
 * Skip repeated events, using supplied equals function to compare items
 * @param {function(a:*, b:*):boolean} equals function to compare items
 * @returns {Stream} stream with no repeated events
 */
Stream.prototype.skipRepeatsWith = function (equals) {
  return skipRepeatsWith(equals, this);
};

// -----------------------------------------------------------------------
// Slicing

/**
 * stream:          -abcd-
 * take(2, stream): -ab|
 * @param {Number} n take up to this many events
 * @returns {Stream} stream containing at most the first n items from this stream
 */
Stream.prototype.take = function (n) {
  return take(n, this);
};

/**
 * stream:          -abcd->
 * skip(2, stream): ---cd->
 * @param {Number} n skip this many events
 * @returns {Stream} stream not containing the first n events
 */
Stream.prototype.skip = function (n) {
  return skip(n, this);
};

/**
 * Slice a stream by event index. Equivalent to, but more efficient than
 * stream.take(end).skip(start);
 * NOTE: Negative start and end are not supported
 * @param {Number} start skip all events before the start index
 * @param {Number} end allow all events from the start index to the end index
 * @returns {Stream} stream containing items where start <= index < end
 */
Stream.prototype.slice = function (start, end) {
  return slice(start, end, this);
};

/**
 * stream:                        -123451234->
 * takeWhile(x => x < 5, stream): -1234|
 * @param {function(x:*):boolean} p predicate
 * @returns {Stream} stream containing items up to, but not including, the
 * first item for which p returns falsy.
 */
Stream.prototype.takeWhile = function (p) {
  return takeWhile(p, this);
};

/**
 * stream:                        -123451234->
 * skipWhile(x => x < 5, stream): -----51234->
 * @param {function(x:*):boolean} p predicate
 * @returns {Stream} stream containing items following *and including* the
 * first item for which p returns falsy.
 */
Stream.prototype.skipWhile = function (p) {
  return skipWhile(p, this);
};

// -----------------------------------------------------------------------
// Time slicing

/**
 * stream:                    -a-b-c-d-e-f-g->
 * signal:                    -------x
 * takeUntil(signal, stream): -a-b-c-|
 * @param {Stream} signal retain only events in stream before the first
 * event in signal
 * @returns {Stream} new stream containing only events that occur before
 * the first event in signal.
 */
Stream.prototype.until = function (signal) {
  return takeUntil(signal, this);
};

// @deprecated use until instead
Stream.prototype.takeUntil = Stream.prototype.until;

/**
* stream:                    -a-b-c-d-e-f-g->
* signal:                    -------x
* takeUntil(signal, stream): -------d-e-f-g->
* @param {Stream} signal retain only events in stream at or after the first
* event in signal
* @returns {Stream} new stream containing only events that occur after
* the first event in signal.
*/
Stream.prototype.since = function (signal) {
  return skipUntil(signal, this);
};

// @deprecated use since instead
Stream.prototype.skipUntil = Stream.prototype.since;

/**
* stream:                    -a-b-c-d-e-f-g->
* timeWindow:                -----s
* s:                               -----t
* stream.during(timeWindow): -----c-d-e-|
* @param {Stream<Stream>} timeWindow a stream whose first event (s) represents
*  the window start time.  That event (s) is itself a stream whose first event (t)
*  represents the window end time
* @returns {Stream} new stream containing only events within the provided timespan
*/
Stream.prototype.during = function (timeWindow) {
  return during(timeWindow, this);
};

// -----------------------------------------------------------------------
// Delaying

/**
 * @param {Number} delayTime milliseconds to delay each item
 * @returns {Stream} new stream containing the same items, but delayed by ms
 */
Stream.prototype.delay = function (delayTime) {
  return delay(delayTime, this);
};

// -----------------------------------------------------------------------
// Getting event timestamp

/**
 * Expose event timestamps into the stream. Turns a Stream<X> into
 * Stream<{time:t, value:X}>
 * @returns {Stream<{time:number, value:*}>}
 */
Stream.prototype.timestamp = function () {
  return timestamp(this);
};

// -----------------------------------------------------------------------
// Rate limiting

/**
 * Limit the rate of events
 * stream:              abcd----abcd----
 * throttle(2, stream): a-c-----a-c-----
 * @param {Number} period time to suppress events
 * @returns {Stream} new stream that skips events for throttle period
 */
Stream.prototype.throttle = function (period) {
  return throttle(period, this);
};

/**
 * Wait for a burst of events to subside and emit only the last event in the burst
 * stream:              abcd----abcd----
 * debounce(2, stream): -----d-------d--
 * @param {Number} period events occuring more frequently than this
 *  on the provided scheduler will be suppressed
 * @returns {Stream} new debounced stream
 */
Stream.prototype.debounce = function (period) {
  return debounce(period, this);
};

// -----------------------------------------------------------------------
// Awaiting Promises

/**
 * Await promises, turning a Stream<Promise<X>> into Stream<X>.  Preserves
 * event order, but timeshifts events based on promise resolution time.
 * @returns {Stream<X>} stream containing non-promise values
 */
Stream.prototype.awaitPromises = function () {
  return awaitPromises(this);
};

// @deprecated use awaitPromises instead
Stream.prototype.await = Stream.prototype.awaitPromises;

// -----------------------------------------------------------------------
// Error handling

/**
 * If this stream encounters an error, recover and continue with items from stream
 * returned by f.
 * stream:                  -a-b-c-X-
 * f(X):                           d-e-f-g-
 * flatMapError(f, stream): -a-b-c-d-e-f-g-
 * @param {function(error:*):Stream} f function which returns a new stream
 * @returns {Stream} new stream which will recover from an error by calling f
 */
Stream.prototype.recoverWith = function (f) {
  return flatMapError(f, this);
};

// @deprecated use recoverWith instead
Stream.prototype.flatMapError = Stream.prototype.recoverWith;

// -----------------------------------------------------------------------
// Multicasting

/**
 * Transform the stream into multicast stream.  That means that many subscribers
 * to the stream will not cause multiple invocations of the internal machinery.
 * @returns {Stream} new stream which will multicast events to all observers.
 */
Stream.prototype.multicast = function () {
  return multicast(this);
};

// export the instance of the defaultScheduler for third-party libraries
// export an implementation of Task used internally for third-party libraries

/** @license MIT License (c) copyright 2015-2016 original author or authors */
/** @author Brian Cavalier */
// domEvent :: (EventTarget t, Event e) => String -> t -> boolean=false -> Stream e
var domEvent = function (event, node, capture) {
  if (capture === void 0) capture = false;

  return new Stream(new DomEvent(event, node, capture));
};

var focusout = function (node, capture) {
  if (capture === void 0) capture = false;

  return domEvent('focusout', node, capture);
};
var click = function (node, capture) {
  if (capture === void 0) capture = false;

  return domEvent('click', node, capture);
};
var dblclick = function (node, capture) {
  if (capture === void 0) capture = false;

  return domEvent('dblclick', node, capture);
};
var change = function (node, capture) {
  if (capture === void 0) capture = false;

  return domEvent('change', node, capture);
};
var submit = function (node, capture) {
  if (capture === void 0) capture = false;

  return domEvent('submit', node, capture);
};
var keyup = function (node, capture) {
  if (capture === void 0) capture = false;

  return domEvent('keyup', node, capture);
};
var hashchange = function (node, capture) {
  if (capture === void 0) capture = false;

  return domEvent('hashchange', node, capture);
};
var DomEvent = function DomEvent(event, node, capture) {
  this.event = event;
  this.node = node;
  this.capture = capture;
};

DomEvent.prototype.run = function run(sink, scheduler) {
  var this$1 = this;

  var send = function (e) {
    return tryEvent$2(scheduler.now(), e, sink);
  };
  var dispose = function () {
    return this$1.node.removeEventListener(this$1.event, send, this$1.capture);
  };

  this.node.addEventListener(this.event, send, this.capture);

  return { dispose: dispose };
};

function tryEvent$2(t, x, sink) {
  try {
    sink.event(t, x);
  } catch (e) {
    sink.error(t, e);
  }
}

function unwrapExports (x) {
	return x && x.__esModule ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var vnode = createCommonjsModule(function (module) {
module.exports = function (sel, data, children, text, elm) {
  var key = data === undefined ? undefined : data.key;
  return { sel: sel, data: data, children: children,
    text: text, elm: elm, key: key };
};
});

var is = createCommonjsModule(function (module) {
module.exports = {
  array: Array.isArray,
  primitive: function (s) {
    return typeof s === 'string' || typeof s === 'number';
  }
};
});

var htmldomapi = createCommonjsModule(function (module) {
function createElement(tagName) {
  return document.createElement(tagName);
}

function createElementNS(namespaceURI, qualifiedName) {
  return document.createElementNS(namespaceURI, qualifiedName);
}

function createTextNode(text) {
  return document.createTextNode(text);
}

function insertBefore(parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild(node, child) {
  node.removeChild(child);
}

function appendChild(node, child) {
  node.appendChild(child);
}

function parentNode(node) {
  return node.parentElement;
}

function nextSibling(node) {
  return node.nextSibling;
}

function tagName(node) {
  return node.tagName;
}

function setTextContent(node, text) {
  node.textContent = text;
}

module.exports = {
  createElement: createElement,
  createElementNS: createElementNS,
  createTextNode: createTextNode,
  appendChild: appendChild,
  removeChild: removeChild,
  insertBefore: insertBefore,
  parentNode: parentNode,
  nextSibling: nextSibling,
  tagName: tagName,
  setTextContent: setTextContent
};
});

var snabbdom = createCommonjsModule(function (module) {
// jshint newcap: false
/* global require, module, document, Node */
'use strict';

var VNode = vnode;
var is$$1 = is;
var domApi = htmldomapi;

function isUndef(s) {
  return s === undefined;
}
function isDef(s) {
  return s !== undefined;
}

var emptyNode = VNode('', {}, [], undefined, undefined);

function sameVnode(vnode1, vnode2) {
  return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
}

function createKeyToOldIdx(children, beginIdx, endIdx) {
  var i,
      map = {},
      key;
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) map[key] = i;
  }
  return map;
}

var hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];

function init(modules, api) {
  var i,
      j,
      cbs = {};

  if (isUndef(api)) api = domApi;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (modules[j][hooks[i]] !== undefined) cbs[hooks[i]].push(modules[j][hooks[i]]);
    }
  }

  function emptyNodeAt(elm) {
    var id = elm.id ? '#' + elm.id : '';
    var c = elm.className ? '.' + elm.className.split(' ').join('.') : '';
    return VNode(api.tagName(elm).toLowerCase() + id + c, {}, [], undefined, elm);
  }

  function createRmCb(childElm, listeners) {
    return function () {
      if (--listeners === 0) {
        var parent = api.parentNode(childElm);
        api.removeChild(parent, childElm);
      }
    };
  }

  function createElm(vnode$$1, insertedVnodeQueue) {
    var i,
        data = vnode$$1.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) {
        i(vnode$$1);
        data = vnode$$1.data;
      }
    }
    var elm,
        children = vnode$$1.children,
        sel = vnode$$1.sel;
    if (isDef(sel)) {
      // Parse selector
      var hashIdx = sel.indexOf('#');
      var dotIdx = sel.indexOf('.', hashIdx);
      var hash = hashIdx > 0 ? hashIdx : sel.length;
      var dot = dotIdx > 0 ? dotIdx : sel.length;
      var tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
      elm = vnode$$1.elm = isDef(data) && isDef(i = data.ns) ? api.createElementNS(i, tag) : api.createElement(tag);
      if (hash < dot) elm.id = sel.slice(hash + 1, dot);
      if (dotIdx > 0) elm.className = sel.slice(dot + 1).replace(/\./g, ' ');
      if (is$$1.array(children)) {
        for (i = 0; i < children.length; ++i) {
          api.appendChild(elm, createElm(children[i], insertedVnodeQueue));
        }
      } else if (is$$1.primitive(vnode$$1.text)) {
        api.appendChild(elm, api.createTextNode(vnode$$1.text));
      }
      for (i = 0; i < cbs.create.length; ++i) cbs.create[i](emptyNode, vnode$$1);
      i = vnode$$1.data.hook; // Reuse variable
      if (isDef(i)) {
        if (i.create) i.create(emptyNode, vnode$$1);
        if (i.insert) insertedVnodeQueue.push(vnode$$1);
      }
    } else {
      elm = vnode$$1.elm = api.createTextNode(vnode$$1.text);
    }
    return vnode$$1.elm;
  }

  function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      api.insertBefore(parentElm, createElm(vnodes[startIdx], insertedVnodeQueue), before);
    }
  }

  function invokeDestroyHook(vnode$$1) {
    var i,
        j,
        data = vnode$$1.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) i(vnode$$1);
      for (i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode$$1);
      if (isDef(i = vnode$$1.children)) {
        for (j = 0; j < vnode$$1.children.length; ++j) {
          invokeDestroyHook(vnode$$1.children[j]);
        }
      }
    }
  }

  function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var i,
          listeners,
          rm,
          ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.sel)) {
          invokeDestroyHook(ch);
          listeners = cbs.remove.length + 1;
          rm = createRmCb(ch.elm, listeners);
          for (i = 0; i < cbs.remove.length; ++i) cbs.remove[i](ch, rm);
          if (isDef(i = ch.data) && isDef(i = i.hook) && isDef(i = i.remove)) {
            i(ch, rm);
          } else {
            rm();
          }
        } else {
          // Text node
          api.removeChild(parentElm, ch.elm);
        }
      }
    }
  }

  function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
    var oldStartIdx = 0,
        newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, elmToMove, before;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) {
        // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) {
        // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
        idxInOld = oldKeyToIdx[newStartVnode.key];
        if (isUndef(idxInOld)) {
          // New element
          api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
          newStartVnode = newCh[++newStartIdx];
        } else {
          elmToMove = oldCh[idxInOld];
          patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
          oldCh[idxInOld] = undefined;
          api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
          newStartVnode = newCh[++newStartIdx];
        }
      }
    }
    if (oldStartIdx > oldEndIdx) {
      before = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function patchVnode(oldVnode, vnode$$1, insertedVnodeQueue) {
    var i, hook;
    if (isDef(i = vnode$$1.data) && isDef(hook = i.hook) && isDef(i = hook.prepatch)) {
      i(oldVnode, vnode$$1);
    }
    var elm = vnode$$1.elm = oldVnode.elm,
        oldCh = oldVnode.children,
        ch = vnode$$1.children;
    if (oldVnode === vnode$$1) return;
    if (!sameVnode(oldVnode, vnode$$1)) {
      var parentElm = api.parentNode(oldVnode.elm);
      elm = createElm(vnode$$1, insertedVnodeQueue);
      api.insertBefore(parentElm, elm, oldVnode.elm);
      removeVnodes(parentElm, [oldVnode], 0, 0);
      return;
    }
    if (isDef(vnode$$1.data)) {
      for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode$$1);
      i = vnode$$1.data.hook;
      if (isDef(i) && isDef(i = i.update)) i(oldVnode, vnode$$1);
    }
    if (isUndef(vnode$$1.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue);
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) api.setTextContent(elm, '');
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        api.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode$$1.text) {
      api.setTextContent(elm, vnode$$1.text);
    }
    if (isDef(hook) && isDef(i = hook.postpatch)) {
      i(oldVnode, vnode$$1);
    }
  }

  return function (oldVnode, vnode$$1) {
    var i, elm, parent;
    var insertedVnodeQueue = [];
    for (i = 0; i < cbs.pre.length; ++i) cbs.pre[i]();

    if (isUndef(oldVnode.sel)) {
      oldVnode = emptyNodeAt(oldVnode);
    }

    if (sameVnode(oldVnode, vnode$$1)) {
      patchVnode(oldVnode, vnode$$1, insertedVnodeQueue);
    } else {
      elm = oldVnode.elm;
      parent = api.parentNode(elm);

      createElm(vnode$$1, insertedVnodeQueue);

      if (parent !== null) {
        api.insertBefore(parent, vnode$$1.elm, api.nextSibling(elm));
        removeVnodes(parent, [oldVnode], 0, 0);
      }
    }

    for (i = 0; i < insertedVnodeQueue.length; ++i) {
      insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
    }
    for (i = 0; i < cbs.post.length; ++i) cbs.post[i]();
    return vnode$$1;
  };
}

module.exports = { init: init };
});

var props = createCommonjsModule(function (module) {
function updateProps(oldVnode, vnode) {
  var key,
      cur,
      old,
      elm = vnode.elm,
      oldProps = oldVnode.data.props,
      props = vnode.data.props;

  if (!oldProps && !props) return;
  oldProps = oldProps || {};
  props = props || {};

  for (key in oldProps) {
    if (!props[key]) {
      delete elm[key];
    }
  }
  for (key in props) {
    cur = props[key];
    old = oldProps[key];
    if (old !== cur && (key !== 'value' || elm[key] !== cur)) {
      elm[key] = cur;
    }
  }
}

module.exports = { create: updateProps, update: updateProps };
});

var attributes = createCommonjsModule(function (module) {
var NamespaceURIs = {
  "xlink": "http://www.w3.org/1999/xlink"
};

var booleanAttrs = ["allowfullscreen", "async", "autofocus", "autoplay", "checked", "compact", "controls", "declare", "default", "defaultchecked", "defaultmuted", "defaultselected", "defer", "disabled", "draggable", "enabled", "formnovalidate", "hidden", "indeterminate", "inert", "ismap", "itemscope", "loop", "multiple", "muted", "nohref", "noresize", "noshade", "novalidate", "nowrap", "open", "pauseonexit", "readonly", "required", "reversed", "scoped", "seamless", "selected", "sortable", "spellcheck", "translate", "truespeed", "typemustmatch", "visible"];

var booleanAttrsDict = Object.create(null);
for (var i = 0, len = booleanAttrs.length; i < len; i++) {
  booleanAttrsDict[booleanAttrs[i]] = true;
}

function updateAttrs(oldVnode, vnode) {
  var key,
      cur,
      old,
      elm = vnode.elm,
      oldAttrs = oldVnode.data.attrs,
      attrs = vnode.data.attrs,
      namespaceSplit;

  if (!oldAttrs && !attrs) return;
  oldAttrs = oldAttrs || {};
  attrs = attrs || {};

  // update modified attributes, add new attributes
  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      if (!cur && booleanAttrsDict[key]) elm.removeAttribute(key);else {
        namespaceSplit = key.split(":");
        if (namespaceSplit.length > 1 && NamespaceURIs.hasOwnProperty(namespaceSplit[0])) elm.setAttributeNS(NamespaceURIs[namespaceSplit[0]], key, cur);else elm.setAttribute(key, cur);
      }
    }
  }
  //remove removed attributes
  // use `in` operator since the previous `for` iteration uses it (.i.e. add even attributes with undefined value)
  // the other option is to remove all attributes with value == undefined
  for (key in oldAttrs) {
    if (!(key in attrs)) {
      elm.removeAttribute(key);
    }
  }
}

module.exports = { create: updateAttrs, update: updateAttrs };
});

var _class = createCommonjsModule(function (module) {
function updateClass(oldVnode, vnode) {
  var cur,
      name,
      elm = vnode.elm,
      oldClass = oldVnode.data.class,
      klass = vnode.data.class;

  if (!oldClass && !klass) return;
  oldClass = oldClass || {};
  klass = klass || {};

  for (name in oldClass) {
    if (!klass[name]) {
      elm.classList.remove(name);
    }
  }
  for (name in klass) {
    cur = klass[name];
    if (cur !== oldClass[name]) {
      elm.classList[cur ? 'add' : 'remove'](name);
    }
  }
}

module.exports = { create: updateClass, update: updateClass };
});

var h = createCommonjsModule(function (module) {
var VNode = vnode;
var is$$1 = is;

function addNS(data, children, sel) {
  data.ns = 'http://www.w3.org/2000/svg';

  if (sel !== 'foreignObject' && children !== undefined) {
    for (var i = 0; i < children.length; ++i) {
      addNS(children[i].data, children[i].children, children[i].sel);
    }
  }
}

module.exports = function h(sel, b, c) {
  var data = {},
      children,
      text,
      i;
  if (c !== undefined) {
    data = b;
    if (is$$1.array(c)) {
      children = c;
    } else if (is$$1.primitive(c)) {
      text = c;
    }
  } else if (b !== undefined) {
    if (is$$1.array(b)) {
      children = b;
    } else if (is$$1.primitive(b)) {
      text = b;
    } else {
      data = b;
    }
  }
  if (is$$1.array(children)) {
    for (i = 0; i < children.length; ++i) {
      if (is$$1.primitive(children[i])) children[i] = VNode(undefined, undefined, undefined, children[i]);
    }
  }
  if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g') {
    addNS(data, children, sel);
  }
  return VNode(sel, data, children, text, undefined);
};
});

var index = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var isValidString = function isValidString(param) {
  return typeof param === 'string' && param.length > 0;
};

var startsWith = function startsWith(string, start) {
  return string[0] === start;
};

var isSelector = function isSelector(param) {
  return isValidString(param) && (startsWith(param, '.') || startsWith(param, '#'));
};

var node = function node(h) {
  return function (tagName) {
    return function (first) {
      var arguments$1 = arguments;

      for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        rest[_key - 1] = arguments$1[_key];
      }

      if (isSelector(first)) {
        return h.apply(undefined, [tagName + first].concat(rest));
      } else if (typeof first === 'undefined') {
        return h(tagName);
      } else {
        return h.apply(undefined, [tagName, first].concat(rest));
      }
    };
  };
};

var TAG_NAMES = ['a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdi', 'bdo', 'bgsound', 'big', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'command', 'content', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'element', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'image', 'img', 'input', 'ins', 'isindex', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'listing', 'main', 'map', 'mark', 'marquee', 'math', 'menu', 'menuitem', 'meta', 'meter', 'multicol', 'nav', 'nextid', 'nobr', 'noembed', 'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'plaintext', 'pre', 'progress', 'q', 'rb', 'rbc', 'rp', 'rt', 'rtc', 'ruby', 's', 'samp', 'script', 'section', 'select', 'shadow', 'small', 'source', 'spacer', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'svg', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr', 'xmp'];

exports['default'] = function (h) {
  var createTag = node(h);
  var exported = { TAG_NAMES: TAG_NAMES, isSelector: isSelector, createTag: createTag };
  TAG_NAMES.forEach(function (n) {
    exported[n] = createTag(n);
  });
  return exported;
};

module.exports = exports['default'];
});

var hh = unwrapExports(index);

var id$1 = 0;
var newId = function () { return ("" + (Date.now()) + (++id$1)); };

// type Id = string
// data Todo = { id::Id, description::string, complete::boolean }

// newTodo :: (Id, string, boolean) -> Todo
var newTodo = function (id$$1, description, complete) { return ({ id: id$$1, description: description, complete: complete }); };

var findTodoIndex = function (id$$1, todos) { return todos.findIndex(function (todo) { return todo.id === id$$1; }); };

// addTodo :: string -> [Todo] -> [Todo]
var addTodo = function (description) { return function (todos) { return description.trim().length === 0 ? todos : todos.concat(newTodo(newId(), description, false)); }; };

// removeTodo :: Id -> [Todo] -> [Todo]
var removeTodo = function (id$$1) { return function (todos) { return remove(findTodoIndex(id$$1, todos), todos); }; };

// updateDescription :: (Id, description) -> [Todo] -> [Todo]
var updateDescription = function (id$$1, description) { return function (todos) {
  var i = findTodoIndex(id$$1, todos);
  return i < 0 ? todos : replace(newTodo(id$$1, description, todos[i].complete), i, todos);
}; };

// updateTodo :: (Id, boolean) -> [Todo] -> [Todo]
var updateComplete = function (ref) {
  var id$$1 = ref.id;
  var complete = ref.complete;

  return function (todos) {
  var i = findTodoIndex(id$$1, todos);
  return i < 0 ? todos : replace(newTodo(id$$1, todos[i].description, complete), i, todos);
};
};

// updateAll :: boolean -> [Todo] -> [Todo]
var updateAllComplete = function (complete) { return function (todos) { return todos.map(function (ref) {
  var id$$1 = ref.id;
  var description = ref.description;

  return newTodo(id$$1, description, complete);
  }); }; };

// removeComplete :: [Todo] -> [Todo]
var removeComplete = function (todos) { return todos.filter(notComplete); };

// isComplete :: Todo -> boolean
var isComplete = function (ref) {
  var complete = ref.complete;

  return complete;
};

// isComplete :: Todo -> boolean
var notComplete = function (todo) { return !isComplete(todo); };

var ref$1 = hh(h);
var section = ref$1.section;
var header = ref$1.header;
var h1 = ref$1.h1;
var form = ref$1.form;
var input$1 = ref$1.input;
var label = ref$1.label;
var ul = ref$1.ul;
var li = ref$1.li;
var div = ref$1.div;
var span = ref$1.span;
var a = ref$1.a;
var strong = ref$1.strong;
var button = ref$1.button;
var footer = ref$1.footer;

var render = function (ref) {
  var todos = ref.todos;
  var editing = ref.editing;
  var view = ref.view;

  return renderApp(todos, editing, view, count(todos));
};

var renderApp = function (todos, editing, view, ref) {
  var remaining = ref.remaining;
  var complete = ref.complete;

  return section('.todoapp', { class: stateClasses(todos.length, remaining, complete, view) }, [renderHeader(), renderTodos(todos, editing), renderFooter(remaining, complete)]);
};

var renderHeader = function () { return header('.header', [h1('todos'), form('.add-todo', [input$1('.new-todo', { attrs: { placeholder: 'What needs to be done?', autofocus: true } })])]); };

var renderTodos = function (todos, editing) { return section('.main', [input$1('.toggle-all', { props: { type: 'checkbox', checked: todos.every(isComplete) } }), label({ attrs: { for: 'toggle-all' } }), ul('.todo-list', todos.map(renderTodo(editing)))]); };

var renderTodo = function (editing) { return function (ref) {
  var id = ref.id;
  var description = ref.description;
  var complete = ref.complete;

  return li({ class: { completed: complete, editing: editing === id }, attrs: { 'data-id': id } }, [div('.view', [input$1('.toggle', { props: { type: 'checkbox', checked: complete } }), label(description), button('.destroy')]), input$1('.edit', { props: { value: editing === id ? description : '' } })]);
 }  };

var renderFooter = function (remaining) { return footer('.footer', [span('.todo-count', [strong(remaining), remaining === 1 ? ' item left' : ' items left']), ul('.filters', [li([a({ attrs: { href: '#/' } }, 'All')]), li([a({ attrs: { href: '#/active' } }, 'Active')]), li([a({ attrs: { href: '#/completed' } }, 'Completed')])]), button('.clear-completed', 'Clear completed')]); };

var count = function (todos) {
  var complete = todos.reduce(function (n, todo) { return todo.complete ? n + 1 : n; }, 0);
  return { complete: complete, remaining: todos.length - complete };
};

var cardinality = function (name, n) {
  // FIXME: Buble errors on computed property names here
  // Error parsing /Users/brian/Projects/cujojs/@most/todomvc/src/view.js:
  // Unexpected token (88:46) in /Users/brian/Projects/cujojs/@most/todomvc/src/view.js
  var classes = {};
  classes[(name + "-0")] = n === 0;
  classes[(name + "-1")] = n === 1;
  classes[(name + "-n")] = n > 1;
  return classes;
};

var stateClasses = function (total, remaining, complete, view) { return Object.assign({ all: view === 'all', active: view === 'active', complete: view === 'completed' }, cardinality('todos', total), cardinality('complete', complete), cardinality('remaining', remaining)); };

var initStore = function (storage, key, defaultValue) { return [getItemOrDefault(storage, key, defaultValue), store$1(storage, key)]; };

var store$1 = function (storage, key) { return function (value) {
  storage.setItem(key, JSON.stringify(value));
  return store$1(storage, key);
}; };

var getItemOrDefault = function (storage, key, defaultValue) {
  var data = storage.getItem(key);
  return data == null ? defaultValue : JSON.parse(data);
};

var toDataId = function (ref) {
	var target = ref.target;

	return findDataId(target);
};
var findDataId = function (node) { return node == null ? '' : node.getAttribute('data-id') || findDataId(node.parentNode); };

var toChecked = function (e) { return e.target.checked; };

var toIdAndComplete = function (e) { return ({ id: toDataId(e), complete: toChecked(e) }); };

var toIdAndDescription = function (e) { return ({ id: toDataId(e), description: e.target.value.trim() }); };

// -------------------------------------------------------
// App state
var setTodos = function (f) { return function (ref) {
	var todos = ref.todos;
	var editing = ref.editing;
	var view = ref.view;

	return ({ todos: f(todos), editing: editing, view: view });
 }	};

var viewFromHash = function (hash) { return hash.replace(/^.*#\/?/, '') || 'all'; };

var pipe = function () {
	var fs = [], len = arguments.length;
	while ( len-- ) fs[ len ] = arguments[ len ];

	return fs.reduceRight(compose);
};

var resetForm = function (ref) {
	var value = ref[0];
	var form = ref[1];

	return (form.reset(), value);
}; // eslint-disable-line no-sequences

var withFirstValue = function (e) { return [e.target.elements[0].value, e.target]; };
var addTodoAction = pipe(withFirstValue, resetForm, addTodo, setTodos);

var removeTodoAction = pipe(toDataId, removeTodo, setTodos);

var updateTodoAction = pipe(toIdAndComplete, updateComplete, setTodos);

var updateAllAction = pipe(toChecked, updateAllComplete, setTodos);

var clearCompleteAction = function () { return setTodos(removeComplete); };

var updateView = function (view) { return function (ref) {
	var todos = ref.todos;
	var editing = ref.editing;

	return ({ todos: todos, editing: editing, view: view });
 }	};
var updateViewAction = pipe(function (e) { return e.newURL; }, viewFromHash, updateView);

var beginEdit = function (editing) { return function (ref) {
	var todos = ref.todos;
	var view = ref.view;

	return ({ todos: todos, editing: editing, view: view });
 }	};
var beginEditAction = pipe(toDataId, beginEdit);

var editTodo$1 = function (f) { return function (ref) {
	var todos = ref.todos;
	var view = ref.view;

	return ({ todos: f(todos), editing: '', view: view });
 }	};

var abortEdit = function () { return id; };
var abortEditAction = pipe(toDataId, abortEdit, editTodo$1);

var endEdit = function (ref) {
	var id$$1 = ref.id;
	var description = ref.description;

	return description.length === 0 ? removeTodo(id$$1) : updateDescription(id$$1, description);
};

var endEditAction = pipe(toIdAndDescription, endEdit, editTodo$1);

var applyAction = function (state, action) { return action(state); };

var preventDefault = function (s) { return tap(doPreventDefault, s); };
var doPreventDefault = function (e) { return e.preventDefault(); };

var isKey = function (code, s) { return filter(function (e) { return e.keyCode === code; }, s); };
var match = function (query, s) { return filter(function (e) { return e.target.matches(query); }, s); };

var ENTER_KEY = 13;
var ESC_KEY = 27;

var listActions = function (el) {
  var clicks = click(el);
  var changes = change(el);

  var add = map$2(addTodoAction, preventDefault(match('.add-todo', submit(el))));
  var remove = map$2(removeTodoAction, match('.destroy', clicks));
  var complete = map$2(updateTodoAction, match('.toggle', changes));
  var all = map$2(updateAllAction, match('.toggle-all', changes));
  var clear = map$2(clearCompleteAction, match('.clear-completed', clicks));

  return merge(add, remove, complete, all, clear);
};

var editActions = function (el) { return flatMap(editTodo(el), match('label', dblclick(el))); };

var editTodo = function (el) { return function (e) {
  var editKey = match('.edit', keyup(el));
  var enter = isKey(ENTER_KEY, editKey);
  var blurEdit = match('.edit', focusout(el));
  var saveEdit = map$2(endEditAction, merge(enter, blurEdit));

  var escape = isKey(ESC_KEY, editKey);
  var abortEdit = map$2(abortEditAction, escape);

  var endEdit = take(1, merge(saveEdit, abortEdit));
  return cons$1(beginEditAction(e), endEdit);
}; };

var filterActions = function (window) { return map$2(updateViewAction, hashchange(window)); };

var todos = function (window, container, initialState) {
  var actions = merge(listActions(container), editActions(container), filterActions(window));
  return scan(applyAction, initialState, actions);
};

var root = document.querySelector('.todoapp');
var container = root.parentNode;

var patch = snabbdom.init([props, attributes, _class]);
var updateApp = function (node, state) { return patch(node, render(state)); };

/* global localStorage */
var ref = initStore(localStorage, 'todos', { todos: [], editing: '', view: 'all' });
var initialState = ref[0];
var store = ref[1];
var updateStore = function (store, value) { return ({ seed: store(value), value: value }); };

todos(window, container, initialState).loop(updateStore, store).reduce(updateApp, root);

}());
