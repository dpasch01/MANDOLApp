#!/usr/bin/env node

/*
This is an ignore hook executed after preparing the application to build. It removes the unecessery files and libraries
from the build in order to reduce the size of it and also the time needed to build it. It also ignores the .sass files and
only takes into consideration the final .css file for the whole app.
*/

var del  = require('del');
var fs   = require('fs');
var path = require('path');

var rootdir = process.argv[2];

if (rootdir) {

  var platforms = (process.env.CORDOVA_PLATFORMS ? process.env.CORDOVA_PLATFORMS.split(',') : []);

  for(var x=0; x<platforms.length; x++) {

    try {
      var platform = platforms[x].trim().toLowerCase();
      var testBuildPath;

      if(platform == 'android') {
        testBuildPath = path.join('platforms', platform, 'assets', 'www', 'build', 'sass');
      } else {
        testBuildPath = path.join('platforms', platform, 'www', 'build', 'sass');
      }

      if(fs.existsSync(testBuildPath)) {
        console.log('Removing test build from assets after prepare: ' + testBuildPath);
        del.sync(testBuildPath);
      } else {
        console.log('Test build @ ' + testBuildPath + ' does not exist for removal.');
      }

    } catch(e) {
      process.stdout.write(e);
    }
  }
}
