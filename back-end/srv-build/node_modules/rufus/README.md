# rufus

This is a fork of [intel](https://github.com/seanmonstar/intel). With changes required by myself and a bit more performance stable (does not depends from format of log too much).

## Why fork?

I already got a question, why i need to fork it. I did such changes:

- Log record object has static fields with known type, that is why it is not required to use e.g. `%(message)s` - message it is string and will be a string. Imho format become stronger (idea inspired from logback logger).
- Formatting was rewritten fully (not only how it looks, but how it works). With this change rufus got stable performance. What does it mean? If you will do a quick benchmark you will see intel is the fastest from text based loggers, but if you change log format to be similar i have used by default in rufus you will notice that intel perfomance rather low.

See benchmark dir for benchmark code, that is results:
```
$ node benchmark/logging.js
console.info x 1,459,530 ops/sec ±0.78% (88 runs sampled)
rufus.info x 201,119 ops/sec ±0.62% (91 runs sampled)
winston.info x 65,377 ops/sec ±1.05% (80 runs sampled)
intel.info x 59,193 ops/sec ±1.13% (97 runs sampled)
bunyan.info x 82,040 ops/sec ±0.68% (100 runs sampled)
log4js.info x 45,273 ops/sec ±2.64% (83 runs sampled)
Fastest is console.info
```
I do not think anyone who understand how logging used in work should consider winston or log4js to use. Seriosly!

## Getting started

1. Install

`npm install --save rufus`

2. Use to log everything important in your app

```js
var rufus = require('rufus');

// usual way
rufus.config(/* see below */);

// in another file
var logger = rufus.getLogger('app.file'); //notice about name!
// every logger has own parent logger which will share part of properties with children,
// this allow to create very flexible configurations
// by default rufus create one logger with name root, which is parent of all loggers

// arguments will be processed with util.format 
// (if you now how to use console.log, you will know how to use rufus loggers)
logger.info('Something good happend %s', 'yep');
// in console you can see something like (or in file if you configure it):
// [2013/11/13 14:26:42.487]  INFO app.file - Something good happend yep

// you can log exceptions
logger.error('Weird', new Error('boom'));
/* [2013/11/13 14:27:59.126] ERROR app.file - Weird
Error: boom
    at Object.<anonymous> (/Users/den/Projects/rufus/test.js:37:22)
    at Module._compile (module.js:456:26)
    ... i suppress it a bit
*/
```

3. Replace global console to have output foreign libraries via rufus

`rufus.console() // that is all`

## Why hierarchical loggers are so cool?

// Who knows what is logback, log4j and slf4j can skip this.

I already said that rufus has by default just one logger `root`. How you can use this:

You configure parent logger and all children will use its properties

```js
rufus.config({
	handlers: {
		errors: {
			class: 'file',
			file: './logs/error.log',
			level: rufus.ERROR
		},
		main: {
			class: 'file',
			file: './logs/main.log'
		}
    },
	loggers: {
    	root: {
        	level: rufus.TRACE,
            handlers: ['errors', 'main']
        }
    }
});
```

With config above all your loggers will output to `./logs/main.log` and additionally errors to `./logs/error.log`.

Ok, assume you want in some child logger output additional messages to another place. No problem, just add config for it:

```js
rufus.config({
	handlers: {
		errors: {
			class: 'file',
			file: './logs/error.log',
			level: rufus.ERROR
		},
		main: {
			class: 'file',
			file: './logs/main.log'
		},
        console: {
        	class: 'console'
        }
    },
	loggers: {
    	root: {
        	level: rufus.TRACE,
            handlers: ['errors', 'main']
        },
        'my_special_logger': {
        	handlers: ['console']
        }
    }
});
```
Now `my_special_logger` and all its children will output to console also. 

Child for some logger it is logger which have such name: nameOfParent.ownChildName, so . it is hierarcy delimeter.

Now you decide that do not want to pollute main log file with some logs, but still want to output them to console:

```js
rufus.config({
	handlers: {
		errors: {
			class: 'file',
			file: './logs/error.log',
			level: rufus.ERROR
		},
		main: {
			class: 'file',
			file: './logs/main.log'
		},
        console: {
        	class: 'console'
        }
    },
	loggers: {
    	root: {
        	level: rufus.TRACE,
            handlers: ['errors', 'main']
        },
        'my_special_logger': {
        	handlers: ['console'],
            propagate: false
        }
    }
});
```
Now `my_special_logger` and all its children will NOT output to log files.

Ok, what if you want to suppress only part of logs - filters will help you. Filter it is function that return boolean value if it accept log record, rufus come with small filter maker function. This function build filters from strings or regexps. Strings used to filter by filter name and regexps used to filter messages.

```js
rufus.config({
	filters: {
    	'i want only loggers with name "fun"': 'fun'
    }
	handlers: {
		errors: {
			class: 'file',
			file: './logs/error.log',
			level: rufus.ERROR
		},
		main: {
			class: 'file',
			file: './logs/main.log'
            filters: ['i want only loggers with name "fun"']
		},
        console: {
        	class: 'console'
        }
    },
	loggers: {
    	root: {
        	level: rufus.TRACE,
            handlers: ['errors', 'main']
        },
        'my_special_logger': {
        	handlers: ['console'],
            propagate: false
        }
    }
});
```
Now you will see in main log file only 'fun' messages. You can add filters to loggers also.

// I think filters require a bit more work to make them even more powerfull

## Full docs

- [Logging](#logging)
  - [Using Default Logger](#using-default-logger)
  - [String Interpolation](#string-interpolation)
  - [Setting the Log Level](#setting-the-log-level)
  - [Adding a Handler](#adding-a-handler)
  - [Getting Named Loggers](#getting-a-named-logger)
  - [Logging Exceptions](#logging-exceptions)
  - [Async Logging](#async-logging)
- [Handlers](#handlers)
  - [ConsoleHandler](#consolehandler)
  - [StreamHandler](#streamhandler)
  - [FileHandler](#filehandler)
  - [RotatingFileHandler](#rotatingfilehandler)
  - [NullHandler](#nullhandler)
  - [Creating a Custom Handler](#creating-a-custom-handler)
- [Filters](#filters)
- [Formatters](#formatters)
  - [Format String](#format)
  - [Date format](#date-format)
- [config](#config)
  - [basicConfig](#basicconfig)
  - [Full Configuration](#full-configuration)
- [console](#console)

## Logging

### Using Default Logger

Rufus as intel exports default root logger to start right way. It can be usefull for small applications. Also this logger used as parent of all loggers (read feather).

```js
require('rufus').info('Hello rufus');
```

### String interpolation

You can log messages using interpolation:

```js
require('rufus').info('Situation %s!', 'NORMAL');
```

It uses util.format as a console.log.

### Setting the Log Level

Loggers have a log level that is compared against log messages. All messages that are of a lower level than the Logger are ignored. This is useful to reduce less important messages in production deployments.

```js
var rufus = require('rufus');
rufus.setLevel(rufus.WARN);
rufus.warn('i made it!');
rufus.debug('nobody loves me');
```

This snippet will output only `warn` message.

### Adding a Handler

The default logger will use a [ConsoleHandler](#consolehandler) if you don't specify anything else.
Hadler has own [formatter](#formatter) and can set a level - all messages from this logger with level >= handler level will be output via this handler. This allow to set very flexible configs.
You can add handlers to any logger:

```js
var rufus = require('rufus');
rufus.addHandler(new rufus.handlers.File('/path/to/file.log'));

rufus.info('going to a file!');
```

### Getting a Named Logger

Using named loggers gives you a lot of power in `rufus`.

```js
var log = require('rufus').getLogger('foo.bar.baz');
log.setLevel(log.INFO).warn('baz reporting in');
```

The names are used to build an hierarchy of loggers. Child loggers can inherit their parents' handlers and log level.

```js
var rufus = require('rufus');
var alpha = rufus.getLogger('alpha');
alpha.setLevel(rufus.WARN).addHandler(new rufus.handlers.File('alpha.log'));

var bravo = rufus.getLogger('alpha.bravo');
bravo.verbose('hungry') // ignored, since alpha has level of WARN
bravo.warn('enemy spotted'); // logged to alpha.log
```

The power of logger hierarchies can seen more when using [rufus.config](#config).

### Logging Exceptions

Any time you pass an exception (an `Error`!) to a log method as last argument, the stack
will be included in the output (if in format presented `%err` or `%error`).

```js
rufus.error('ermahgawd', new Error('boom'));
```

Loggers can also handle `uncaughtException`, passing it to its handlers,
and optionally exiting afterwards.

```js
var logger = rufus.getLogger('medbay');
logger.handleExceptions(exitOnError);
```

Pass a boolean for `exitOnError`. Default is `true` if no value is passed.

There is some caviats with javascript nature that can be unclear. Log messages outputed asynchronously, so if unhandled exception will happen before, it can happen you will not see anything to understand what happen. So it is very recommended to log unhandled exceptions with one of loggers.

### Async logging

If you need to execute code after a log message has been completely handled, every log method returns a promise. The promise only gets resolved after all handlers have finished handling that message.

```js
require('rufus').warn('report in').then(rogerThat);
```

## Handlers

Loggers build a message and try to pass the message to all of it's handlers and to it's parent. Handlers determine exactly what to do with that message, whether it's sending it to console, to a file, over a socket, or nothing at all.

All Handlers have a `level`, and a [`Formatter`](#formatters). 

```js
new rufus.Handler({
  level: rufus.WARN, // default is NOTSET
  formatter: new rufus.Formatter() // default formatter
});
```

Just like Loggers, if a message's level is not equal to or greater than the Handler's level, the Handler won't even be given the message.

### ConsoleHandler

```js
new rufus.handlers.Console(options);
```

The Console handler outputs messages to the `stdio` or `stderr` (if level >= `WARN`), just like `console.log()` would. By default it colorize messages.

### StreamHandler

```js
new rufus.handlers.Stream(streamOrOptions);
```

The Stream handler can take any writable stream, and will write messages to the stream. The [Console](#consolehandler) handler essentially uses 2 Stream handlers internally pointed at `process.stdout` and `process.stdin`.

- **stream**: Any [WritableStream](http://nodejs.org/api/stream.html#stream_class_stream_writable)
- Plus options from [Handler](#handlers)

As a shortcut, you can pass the `stream` directly to the constructor, and all other options will just use default values.

### FileHandler

```js
new rufus.handlers.File(filenameOrOptions);
```

The File handler will write messages to a file on disk. It extends the [Stream](#streamhandler) handler, by using the `WritableStream` created from the filename.

- **file**: A string of a filename to write messages to.
- **highWaterMark**: size of buffer for file stream, by default 64kb.
- Plus options from [Handler](#handlers)

As a shortcut, you can pass the `file` String directly to the constructor, and all other options will just use default values.

This handler can be used with external rotating systems:

```js
process.on('SIGUSR2', function() {
    Handler.all.forEach(function(handler) {
        if(handler.reopen) handler.reopen();
    });
});
```

### RotatingFileHandler

```js
new rufus.handlers.Rotating(options);
```

The Rotating handler extends the [File](#filehandler) handler, making sure log files don't go over a specified size.

- **maxSize** - A number of bytes to restrict the size of log files. It can be number or string in format '1gb 2mb 3kb 1b', which will be converted to number.
- **timeRate** - Time rate it is one of words: 'yearly', 'monthly', 'daily', 'weekly', 'hourly' or number of ms which will be used to calculate next rotation.
- **maxFiles** - Max number of files to keep.
- **oldFile** - This is a name of file to which old files will be moved. This file format string support options: %d{dateformat}, %pid, %i (file index). By default it is **file + ['-%d'] + ['.%i']** ([ ] - means optional).

As files reach the max size, the files will get moved to a the same name, with a number attached to the end. So, `rufus.log` will become `rufus.log.1`, and `rufus.log.1` would move to `rufus.log.2`, up to the `maxIndex` number.

### NullHandler

```js
new rufus.handlers.Null();
```

The Null handler will do nothing with received messages. This can useful if there's instances where you wish to quiet certain loggers when in production (or enemy territory).

### Creating Custom Handlers

Adding a new custom handler that isn't included in rufus is a snap. Just make a subclass of [Handler](#handlers), and implement the `emit` method.

```js
var util = require('util');
var rufus = require('rufus');

function CustomHandler(options) {
  rufus.Handler.call(this, options);
  // whatever setup you need
}
// don't forget to inhert from Handler (or a subclass, like Stream)
util.inherits(CustomHandler, rufus.Handler);

CustomHandler.prototype.emit = function customEmit(record, callback) {
  // do whatever you need to with the log record
  // this could be storing it in a db, or sending an email, or sending an HTTP request...
  // if you want the message formatted:
  // str = this.format(record);

  // The callback should be called indicating whether there was an error or not.
  callback(err);
}
```

## Filters

You can already plug together handlers and loggers, with varying levels, to get powerful filtering of messages. However, sometimes you really need to filter on a specific detail on a message. You can add these filters to a [Handler](#handlers) or [Logger](#logging).

```js
rufus.addFilter(rufus.makeFilter(/^foo/g));
rufus.addFilter(rufus.makeFilter('patrol.db'));
rufus.addFilter(filterFunction);
```

Filters come in 3 forms:

- **string** - pass a string to filter based on Logger name. So, `Filter('foo.bar')` will allow messages from `foo.bar`, `foo.bar.baz`, but not `foo.barstool`.
- **regexp** - pass a RegExp to filter based on the text content of the log message. So, `Filter(/^foo/g)` will allow messages like `log.info('foo bar')` but not `log.info('bar baz foo')`;
- **function** - pass a function that receives a [LogRecord](#logrecord) object, and returns true if the record meets the filter.

## Formatters

```js
new rufus.Formatter(formatOrOptions);
```

A `Formatter` is used by a [`Handler`](#handlers) to format the message before being sent out. An useful example is wanting logs that go to the [Console](#consolehandler) to be terse and easy to read, but messages sent to a [File](#filehandler) to include a lot more detail.

- **format**: A [format](#format) string.

### Format

<table>
<tr>
<th>Option</th>
<th>Description</th>
</tr>
<tr>
    <td>
        %c <br/>
        %lo <br/>
        %logger
    </td>
  <td>Name of current logger</td>
</tr>
<tr>
    <td>
        %p <br/>
        %le <br/>
        %level
    </td>
  <td>Level name</td>
</tr>
<tr>
    <td>
        %d{<i>format</i>} <br/>
        %date{<i>format</i>}
    </td>
  <td>
      Output log timestamp. Format it is mostly C strftime format with small changes:
        
        See <a href="#date-format">date format</a>.
    </td>
</tr>
<tr>
    <td>
        %pid
    </td>
  <td>PID of current process</td>
</tr>
<tr>
    <td>
        %m <br>
        %msg <br>
        %message
    </td>
  <td>Log message</td>
</tr>
<tr>
    <td>
        %n
    </td>
  <td>EOL</td>
</tr>
<tr>
    <td>
        %%
    </td>
  <td>%</td>
</tr>
<tr>
    <td>
        %err{<i>number</i>} <br>
        %error{<i>number</i>}
    </td>
  <td>Output stack trace. Number can be: 'full', 'short', any integer. It output no more then specified number, 'full' means all lines, 'short' just one</td>
</tr>
<tr>
    <td>
        %X{something|defaultValue}
    </td>
  <td>NOT IMPLEMENTED. Specify some value via log context or default</td>
</tr>
</table>

Default message format is:

```js
'[%date] %-5level %logger - %message%n%error'
```

### Date format

Default date format: `'%Y/%m/%d %H:%M:%S.%L'`.

 - %% - %
 - %A - full day name
 - %a - abbriviated day name
 - %B - full month name
 - %b - abbriviated day name
 - %c - date and time as .toString() output
 - %C - year first 2 digits
 - %d - day of the month, zero-padded (01-31)
 - %e - day of the month, space-padded ( 1-31)
 - %H - hour in 24h format (00-23)
 - %h - abbriviated month name
 - %I - hour in 12h format (01-12)
 - %j - day of the year (001-366)
 - %k - the same as %H
 - %L - millis 3 digits zero padded
 - %l - hours in 12 hours format zero padded
 - %M - minutes zero padded
 - %m - month digit zero padded
 - %P - AM/PM
 - %p - am/pm
 - %S - seconds zero padded
 - %t - \t
 - %U - week number assume first day of week 'sunday'
 - %u - day of week, monday is first day
 - %W - as %U but for 'monday'
 - %w - day number as 'sunday' is first
 - %Y - year 4 digit
 - %y - year last 2 digits
 - %Z - time zone name (taken from toString() output)
 - %z - time zone offset in hours

Most of options support Ruby extensions to change padding: %_S will output second zero padded, %-S omit padding, %0S uses zero padding.

## config

Once you understand the power of rufus's [named loggers](#getting-a-named-logger), you'll appreciate being able to quickly configure logging in your application.

### basicConfig

The basicConfig is useful if you don't wish to do any complicated configuration (no way, really?). It's a quick way to setup the root default logger in one function call. Note that if you don't setup any handlers before logging, `basicConfig` will be called to setup the default logger.

```js
rufus.basicConfig({
  'file': '/path/to/file.log', // file and stream are exclusive. only pass 1
  'stream': stream,
  'format': '%(message)s',
  'level': rufus.INFO
});
```

The options passed to basicConfig can include:
- **file** - filename to log
- **stream** - any WritableStream
- **format** - a format string
- **level** - the log level

You cannot pass a `file` and `stream` to basicConfig. If you don't provide either, a [Console](#consolehandler) handler will be used. If you wish to specify multiple or different handlers, take a look at the more comprehensive [config](#full-configuration).

### Full Configuration

```js
rufus.config({
  formatters: {
    'simple': '[%level] %message%n',
    'details': '[%date] %logger.%level: %message%n'
  },
  filters: {
    'db': 'patrol.db'
  },
  handlers: {
    'terminal': {
      'class': rufus.handlers.Console,
      'formatter': 'simple',
      'level': rufus.VERBOSE,
      colorize: false
    },
    'logfile': {
      'class': rufus.handlers.File,
      'level': rufus.WARN,
      'file': '/var/log/report.log',
      'formatter': 'details',
      'filters': ['db']
    }
  },
  loggers: {
    'patrol': {
      'handlers': ['terminal'],
      'level': 'INFO',
      'handleExceptions': true,
      'exitOnError': false,
      'propagate': false
    },
    'patrol.db': {
      'handlers': ['logfile'],
      'level': rufus.ERROR
    },
    'patrol.node_modules.express': { // huh what? see below :)
      'handlers': ['logfile'],
      'level': 'WARN'
    }
  }
});
```

We set up 2 handlers, one [Console](#consolehandler) with a level of `VERBOSE` and a simple format, and one [File](#filehandler) with a level of `WARN` and a detailed format. We then set up a few options on loggers. Not all loggers need to be defined here, as child loggers will inherit from their parents. So, the root logger that we'll use in this application is `patrol`. It will send all messages that are `INFO` and greater to the the terminal. We also specifically want database errors to be logged to the our log file. And, there's a logger for express? What's that all about? See the [rufus.console](#console) section.

Config also accepts JSON, simply put a require path in any `class` properties.

```js
// logging.json
{
  "handlers": {
    "foo": {
      "class": "rufus/handlers/console"
    }
  }
  // ...
}
```

```js
rufus.config(require('./logging.json'));
```

## console

```js
require('rufus').console();
```

So, a problem with logging libraries is trying to get them to work with 3rd party modules. Many libraries may benefit from logging when certain things occur, but can't really pick a logging library, since that sort of choice should be up to the app developer. The only real options they have are to not log anything, or to use `console.log`. So really, they should [console.log() all the the things](http://seanmonstar.com/post/56448644049/console-log-all-the-things), and `rufus` can work just fine with that.

rufus has the ability to override the global `console`, such that calling any of it's methods will send it through a [Logger](#logging). This means that messages from other libraries can be sent to your log files, or through an email, or whatever. Even better, `rufus` will automatically derive a name for the each module that access `console.log` (or `info`, `warn`, `dir`, `trace`, etc). In the [config](#full-configuration) example, we set up rules for `patrol.node_modules.express`. If `express` were to log things as it handled requests, they would all derive a name that was a child of our logger. So, in case it's chatty, we're only interesting in `WARN` or greater messages, and send those to a log file.

It tries its darndest to best guess a name, by comparing the relative paths from the `root` and the module accessing `console`. By default, the `root` is equal to the `dirname` of the module where you call `rufus.console()`.

Options:

- **root** - String to define root logger, defaults to calling module's filename
- **ignore** - Array of strings of log names that should be ignored and use standard `console` methods. Ex: `['rufus.node_modules.mocha']`

```js
// file: patrol/index.js
require('rufus').console(); // root is '/path/to/patrol'
```

If you override the console in a file deep inside some directories, you can manually set the root as an option:

```js
// file: patrol/lib/utils/log.js
require('rufus').console({ root: '/path/to/patrol' });
```
