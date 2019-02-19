'use strict'

/*
 * Nightwatch.js module to record the webdriver X11 display via ffmpeg.
 *
 * Copyright 2016, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 */

const fs = require('fs')
const path = require('path')
const recordScreen = require('record-screen')
const screenRecordings = new Map()

function sanitizeBaseName(str) {
  // Remove non-word characters from the start and end of the string.
  // Replace everything but word characters, dots and spaces with a dash.
  return str.replace(/^\W+|\W+$/g, '').replace(/[^\w. -]+/g, '-')
}

function createVideoFileName(browser) {
  const options = Object.assign(
    { dir: 'reports/videos' },
    browser.options.videos
  )
  if (!options.enabled) return
  const caps = browser.capabilities
  const dir = path.join(
    options.dir,
    sanitizeBaseName(
      [
        caps.browserName,
        (caps.browserVersion || caps.version || '')
          .split('.')
          .slice(0, 2)
          .join('.'),
        caps.platformName || caps.platform,
        (caps.platformVersion || '')
          .split('.')
          .slice(0, 2)
          .join('.'),
        caps.deviceName
      ]
        .filter(s => s) // Remove empty ('', undefined, null, 0) values
        .join(' ')
    )
  )
  fs.mkdirSync(dir, { recursive: true })
  return path.format({
    dir,
    name: sanitizeBaseName(browser.currentTest.module),
    ext: options.ext || '.mp4'
  })
}

module.exports = {
  start: function(browser, done) {
    const options = Object.assign(
      { hostname: browser.options.selenium_host },
      browser.options.videos
    )
    if (!options.enabled) return
    const fileName = createVideoFileName(browser)
    const recording = recordScreen(fileName, options)
    if (options.delete_on_pass) recording.delete_on_pass = fileName
    recording.promise.catch(err => console.error(err))
    screenRecordings.set(fileName, recording)
    done()
  },
  stop: function(browser, done) {
    const fileName = createVideoFileName(browser)
    const recording = screenRecordings.get(fileName)
    if (recording) {
      screenRecordings.delete(fileName)
      recording.stop()
      recording.promise
        .then(() => {
          if (recording.delete_on_pass && !browser.currentTest.results.failed) {
            fs.unlinkSync(recording.delete_on_pass)
          }
          done()
        })
        .catch(() => done())
      return
    }
    done()
  }
}
