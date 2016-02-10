var fs = require('fs-extra')
    , watch = require('watch')
    , util = require('util')
    , child_process = require('child_process')
    , exec = child_process.exec
    , spawn = child_process.spawn
    // , file = require('file')
    // , typeDirName = 'lib'
    // , typeDir = './'+typeDirName
    // , srcDir = './src/'
    // , ext = '.js'
    // , separator = '.'
    , cmd1 = process.argv[2]
    , configName = './cbuild.json'
    // , cmd2 = process.argv[3]
    , t = Object.prototype.toString
    , watchInterval = 200
    , restartInterval = 500
;


function isString(s){   return t.call(s) === '[object String]'; }
function isArray(s){    return t.call(s) === '[object Array]';  }
function isObject(s){   return t.call(s) === '[object Object]'; }
function isFunction(s){ return t.call(s) === '[object Function]'; }
function isNumber(s){ return s === s && (t.call(s) === '[object Number]') }

objFor = function(o, cb, cbThis){
    for(var key in o){
        if( o.hasOwnProperty(key) ){
            cb.call(cbThis, o[key], key, o);
        }
    }
}

Date.prototype.timeNow = function () {
    return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

function spaces2to4(file){
    var data = fs.readFileSync( './'+file ).toString();
    data = data.replace('  ', '    ');
    fs.writeFileSync( file, data );
}

function build(src, lib, f, cb){
    exec(
        // coffee -o app/ -c appsrc/ws.coffee
        'coffee -m -b -o '+lib+' -c '+src
        , function (error, stdout, stderr) {
            // console.log('------------------------------')
            var time = '['+ new Date().timeNow() +']';
            if( stdout ){
                console.log( time, stdout );
            }
            if( stderr ){
                console.log( time, 'Error is:', stderr);
            }
            if( !stdout & !stderr ){ console.log(time, 'File:', f); }
            if (error !== null) {
                console.log('exec error: ' + error);
            }
            // spaces2to4(f);
            if( cb !== undefined ){ cb() }
    });
}

function num2str(num, len, base){
    base = base || 10;
    var res = num.toString(base).toUpperCase()
        , len
        , i = 0
    ;
    if( res.length < len ){
        len = len - res.length;
        for(i; i<len; i++){
            res = '0' + res;
        }
    } else if( res.length > len ) {
        res = res.slice( 0-len );
    }
    return res;
}

function dump(str){
    var lines
        , i = 0
        , lineLen = 16
        , realLen = str.length
        , len = ( ~~(realLen / lineLen) + 1) * lineLen
        , newLine = ''
        , colLen = 4
    ;
    if( !isString(str) ){ return }

    for(i; i<len; ){
        if( i%lineLen === 0 ){
            newLine = ' ' + num2str( i, 8, 16 ) + '  ';
        }
        if( i%colLen === 0 ){ newLine += ' ' }
        if( i >= realLen ){
            newLine += '   ';
        } else {
            newLine += num2str( str.charCodeAt(i), 2, 16) + ' ' ;
        }

        i++;
        if( i%lineLen === 0 ){
            console.info(
                newLine
                , str.slice( Math.max(0,i-lineLen), Math.min(len, i) )
            );
            // console.log( Math.max(0,i-lineLen), Math.min(len, i) );
        }
    }
}

// [2015/11/19 20:31:19.322] main.INFO: Loading app module: ./app/requestHandlers

// dump('0123456789ABCDEF0123456789ABCDEF');
// // console.log( num2str(0xABCD, 8, 16) );
// return

function main(){
    var opt, watchers, restartXt, killCmd, startCmd, restartTimer
        , restartState = 0
    ;

    try{
        opt = require( configName );
    }catch(e){
        throw e;
    }

    if( opt.restart !== undefined ){

        // killCmd = 'pkill -f "' + opt.restart.app + '"';
        startCmd = 'cd ' + process.cwd() + '/' + opt.restart.path + ' && ' + opt.restart.app
        app = opt.restart.app
        appargs = opt.restart.args
        spawnOptions = { cwd: process.cwd() + '/' + opt.restart.path }
        appProc = null;

        restartTimer = setInterval(
            function(){
                if( restartState === 1 ){
                    restartState = 2;
                    // exec( killCmd, function(error, so, se){
                        // console.log('cmd1', error, so, se);
                    if( appProc !== null ){
                        // console.log('kill', appProc);
                        appProc.kill('SIGTERM');
                    }

                    // appProc = exec( startCmd, function(error, so, se){
                    //     // console.log('cmd2', startCmd, error, so, se);
                    //     restartState = 0;
                    //     // if( so === null ){ so = '' }
                    //     // if( se === null ){ se = '' }
                    //     if( error !== null ){
                    //         console.error('~~~ Restar error:', error, so, se);
                    //     } else {
                    //         console.log('~ Restarted', se);
                    //     }
                    // });

                    appProc = spawn(app, appargs, spawnOptions);

                    appProc.stdout.on('data', function (data) {
                        data = data.toString();
                        if( data.slice(-6, -5) === '\n' ) {
                            data = data.slice(0, -6) + data.slice(-5);
                        }
                        console.log('~:', data);
                    });

                    appProc.stderr.on('data', function (data) {
                        data = data.toString();
                        if( data.slice(-6, -5) === '\n' ) {
                            data = data.slice(0, -6) + data.slice(-5);
                        }
                        console.error('#:', data);
                    });

                    appProc.on('error', function (data) {
                        console.error('~~~ App error:', error, so, se);
                    });

                    appProc.on('exit', function(){
                        appProc === null;
                    });
                    // });
                    restartState = 0;
                }
            }, restartInterval
        );

        restartXt = function(){
            if( restartState === 0 ){ restartState = 1; }
        }

        process.on('exit', function(){
            appProc.kill('SIGTERM');
        });
    }

    opt.sources.forEach(function(options){

        var src = options.path + options.src;
        var lib = options.path + options.lib;

        if( process.argv.length === 2 ){
            build(src, lib, lib, restartXt);
        } else {
            if( process.argv.length === 3 && cmd1 === '-w' ){
                build(src, lib, lib, restartXt);
                watch.watchTree(
                    src
                    , {
                        persistent: true
                        , interval: watchInterval
                        , ignoreDotFiles: true
                        , filter: function(f){
                            return f.slice(-7) === '.coffee';
                        }
                        , ignoreUnreadableDir: true
                        , ignoreNotPermitted :true
                        , ignoreDirectoryPattern: /node_modules/
                    }
                    , function (f, curr, prev) {
                        if (typeof f == 'object' && prev === null && curr === null) {
                            // Finished walking the tree
                        } else if (prev === null) {
                            // f is a new file
                            build(src, lib, f, restartXt);
                        } else if (curr.nlink === 0) {
                            // f was removed
                            build(src, lib, f, restartXt);
                        } else {
                            // f was changed
                            build(src, lib, f, restartXt);
                        }
                });
            }
        }
    });
}

main();
