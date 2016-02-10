# rufus ChangeLog

## 0.5.7 - 2014-12-18

 - Fix console handler and how used levels

## 0.5.6 - 2014-02-03

 - Bug in rotating handler
 - Stable and define log remover

## 0.5.5 - 2014-01-30

 - Typo in file handler .reopen

## 0.5.4 - 2014-01-30

 - Make rotating handler work now both with size based and time based rotations.

## 0.5.3 - 2014-01-28

 - Some fixes for formats

## 0.5.2 - 2014-01-27

 - Time based log rotation

## 0.5.1 - 2014-01-25

- Fix last tests
- Small cleanup for file handler

## 0.5.0 - 2013-11-13

- General cleanup
- Remove timeout for handlers
- Improve perfomance
- Use util.format instead of own printf
- More accurate console replacement

## v0.3.0 - 2013-10-24

- added intel.handlers.Rotating
- added ignore options to intel.console()
- added chalk.enabled when colorize is used
- added padding and truncation to printf
- added Logger#handleExceptions to catch uncaught exceptions
- added stack traces when an exception is logged
- fork intel to support it myself
- changed Promises from Q to bluebird, significantly faster
- fixed Console handler from using accepting format options
- make format and dates compiled. Perfomance stability with any format

# inter Changelog

## v0.2.0 - 2013-10-04

- added Filters for Handlers and Loggers
- added Handler timeout option
- added pid to LogRecord
- added configuration using JSON
- changed Promises to LazyPromises
- changed printf to faster, smaller printf
- changed internal forEach to faster while loops
- removed node v0.6 support (it didn't work anyways)

## v0.1.0 - 2013-09-30

- Initial release.
