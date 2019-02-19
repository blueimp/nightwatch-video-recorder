# Nightwatch.js video screen recording via ffmpeg
Record videos of [Nightwatch.js](http://nightwatchjs.org/) test sessions.  
Uses [ffmpeg](https://www.ffmpeg.org/) to capture a (remote) webdriver desktop
screen.

## Install

```sh
npm install nightwatch-video-recorder
```

## Usage

Add the following `beforeEach`/`afterEach` hooks:
```js
module.exports = {
  beforeEach: function (browser, done) {
    require('nightwatch-video-recorder').start(browser, done)
  },
  afterEach: function (browser, done) {
    require('nightwatch-video-recorder').stop(browser, done)
  }
}
```

Enable the video screen recording in your test settings:
```js
{
  "test_settings": {
    "default": {
      "videos": {
        "enabled": true,          // Enable video recordings
        "delete_on_pass": true,   // Delete video when tests pass
        "dir": "reports/videos",  // Video directory
        "ext": ".mp4",            // Video file extension
        "resolution": "1440x900", // Display resolution
        "fps": 15,                // Frames per second
        "hostname": "localhost",  // X11 server hostname
        "display": "0",           // X11 server display
        "pixelFormat": "yuv420p"  // Output pixel format
      }
    }
  }
}
```

See [blueimp/nightwatch](https://github.com/blueimp/nightwatch) for a complete
setup example.

## License
Released under the [MIT license](https://opensource.org/licenses/MIT).

## Author
[Sebastian Tschan](https://blueimp.net/)
