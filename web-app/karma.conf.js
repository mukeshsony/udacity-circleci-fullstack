// Karma configuration file for CI/CD environments
// https://karma-runner.github.io/latest/config/configuration-file.html

// Set Puppeteer's Chrome path for Karma
process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        // Jasmine configuration
        // https://jasmine.github.io/api/edge/Configuration.html
      },
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true // removes the duplicated traces
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/mystore-angular'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcovonly' }
      ]
    },
    reporters: ['progress', 'kjhtml', 'coverage'],
    restartOnFileChange: true,
    
    // Custom launcher for CI environments
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',                    // Required for Docker/CI environments
          '--disable-gpu',                   // Disable GPU acceleration
          '--disable-dev-shm-usage',         // Overcome limited resource problems
          '--disable-software-rasterizer',   // Disable software rasterizer
          '--disable-extensions'             // Disable extensions
        ]
      }
    },
    
    // Default to Chrome for local development
    browsers: ['Chrome'],
    
    // CI-specific settings
    singleRun: false,
    concurrency: Infinity,
    browserNoActivityTimeout: 30000,
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 3,
    captureTimeout: 60000
  });
};
