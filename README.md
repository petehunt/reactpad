# React Hackathon toolkit

![unmaintained](http://img.shields.io/badge/status-unmaintained-red.png)

Build apps quickly using [React](http://facebook.github.io/react), [Bootstrap](http://getbootstrap.com/), [Parse / Backbone](http://parse.com/) and [Browserify](http://browserify.org/).

## What is this?

It's a simple app that lets you create Wiki-like pages using markdown and URL routing. It's easy to delete this functionality and start building your app.

## Getting started

Make sure you have [npm](http://npmjs.org/).

1. Clone this repo
2. `npm install`
3. Edit `src/main.js` to include your Parse API key.
4. `npm start`
5. Open `index.html` in your favorite browser
6. Start hacking!

## Find your way around

* `src/main.js` - your routes and Parse API key
* `src/layout` - general page layout components
* `src/pages` - full-page components
* `src/data` - Parse / Backbone Models and Collections
* `src/components` - all other UI components

### Things you don't need to worry about
* `src/framework` - the ReactHack code
* `index.html` - the entry point to your app, just references the static resources you need
* `build/main.js` - autogenerated by `npm start`

## FAQ

### It says "If you see this, something is broken."

That means you didn't run `npm install` or `npm start`.

### There is an "Unauthorized" error in the browser error console

That means you didn't edit `src/main.js` to include your Parse JavaScript API key.

### It's messed up on Windows

On Windows `npm` sometimes does not work correctly. Make sure you install `git` and use the git `bash` shell to run the commands. If `npm start` still doesn't work, try running `node_modules/.bin/watchify -t staticify -t reactify -o build/main.js src/main.js` manually from `bash`.

### What!? I can `require()` CSS files!?

Yes. Within your CSS files you can also `require()` images like so:

```css
body {
  background-image: url('./myImage.jpg');
}
```

## Future work

- Full-page rendering
- Server rendering
- Testing integration
- All Bootstrap-specific React components (specifically grids)
