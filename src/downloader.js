'use strict';

/**
 * A small utility for downloading files.
 */

// Dependencies
var fs = require('fs'),
    url = require('url'),
    http = require('http'),
    exec = require('child_process').exec,
    debug = require('debug')('openframe:downloader');

// unused at present
function _mkdirp(dir) {
    var mkdir = 'mkdir -p ' + dir;
    exec(mkdir, function(err) {
        if (err) {
            throw err;
        }
    });
}

/**
 * Download a file using HTTP get.
 *
 * TODO: use Promises instead of a callback.
 *
 * @param  {String}   file_url
 * @param  {String}   file_output_name
 */
function downloadFile(file_url, file_output_name, cb) {
    var options = {
        host: url.parse(file_url).host,
        port: 80,
        path: url.parse(file_url).pathname
    };

    return new Promise(function(resolve, reject) {
        var file_name = file_output_name,
            file_path = './artwork/' + file_name,
            file = fs.createWriteStream(file_path);

        http.get(file_url, function(res) {
            res.pipe(file);
            file.on('finish', function() {
                file.close(function() {
                    if (cb) cb();
                    resolve(file);
                });  // close() is async, call cb after close completes.
            });
            res.on('error', (e) => {
                debug(`Got error: ${e.message}`);
                reject(e);
            });
        });
    });

}

exports.downloadFile = downloadFile;
