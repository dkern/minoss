# Minoss - Mini Node Script Server
This is a small yet powerful Server based on [`node.js`](https://nodejs.org) and [`express`](http://expressjs.com).
It's designed to simple create and serve usable APIs for automatising things, like with the [`Raspberry Pi`](https://www.raspberrypi.org/) or whenever it's needed to easily execute scripts.
Minoss is very easy to extend for your needs.

Build in it has a automatically file loading, handling abstractions and configurations on many levels.
Just place the Files on the right place and the Server will handle anything else.


## Table of Contents
* [Install Minoss](#install-minoss)
* [Installation](#installation)
* [Configuration](#configuration)
* [Start Minoss](#start-minoss)
* [Let Minoss run forever](#let-minoss-run-forever)
* [Call a Module-Script](#call-a-module-script)
* [Output Formats](#output-formats)
* [Configure a Module](#configure-a-module)
* [Validating Scripts](#validating-scripts)
* [Bugs / Feature request](#bugs--feature-request)
* [License](#license)
* [Donation](#donation)


---


## Installation
Inside a Folder where you want to install Minoss you just need to download the project files.
It's possible to download the [`zip` archive from GitHub](https://github.com/eisbehr-/minoss/archive/master.zip) or use `git` to download the latest files.

```SH
$ git clone https://github.com/eisbehr-/minoss.git .
```


## Install Modules
If you want to use other public Modules the easiest way to install them is to use [npm](https://npmjs.com).
For example:

```SH
$ npm install eisbehr-/minoss-example
```


## Configuration
Minoss itself only has a very small configuration.
You will find anything with a small description inside the `config/` folder of the root.
Change the options as you like.


### Custom Routes
The configuration allows you to add own routes to the server.
Because Minoss is based on `express` you can use it's full [routing functions](https://expressjs.com/en/guide/routing.html). 

```JS
routes: function(app) {
    app.get("/example", function(req, res) {
        res.send("example response");
    });
}
```

## Start Minoss
The Server can be started one time by using `npm start` or manually by `node server.js` inside the directory where you installed it.

```SH
$ node server.js
```

After start a Message should notice about where the Server is listening by now.

```
$ Minoss now listening on http://localhost:8080 ...
```


## Let Minoss run forever
You may want to let the Server running forever and automatically start it after reboot or crash.
Therefore you could use [`pm2`](https://github.com/Unitech/PM2), a process manager for `node.js`.

If you aren't use `pm2` already, you can install it globally.

```SH
$ npm install pm2 -g
```

Once installed you can add Minoss execution to the handling of `pm2`:

```SH
$ pm2 startup
$ pm2 start server.js
$ pm2 save
```

And that's it, your Server will now run automatically on every boot.
`pm2` will even restart your Server when it crashes.


## Call a Module-Script
You call and execute a script always by `module` and `script` name.
Minoss will do anything else for you.

```
http://localhost:8080/{MODULE}/{SCRIPT}
```


## Output Formats
Minoss supports three different output types by default: `json`, `xml` and plain `text`, while `json` is the default.
You can switch between them every time.
Just put the wanted output format before the `module` and `script` name, or append it as `get` parameter.

```
http://localhost:8080/xml/module/script
http://localhost:8080/json/module/script
http://localhost:8080/text/module/script

http://localhost:8080/module/script?output=xml
http://localhost:8080/module/script?output=json
http://localhost:8080/module/script?output=text
```


## Available Modules
There are currently only a few Modules available by myself.
Feel free to [create own Modules](https://github.com/eisbehr-/minoss-example) on your own or spread some new ones with other.
Currently available:

- [minoss-example](https://github.com/eisbehr-/minoss-example): An example Module explaining how to create and use Modules
- [minoss-hue](https://github.com/eisbehr-/minoss-hue): Controlling Philips Hue Devices and Lamps
- [minoss-surveillance](https://github.com/eisbehr-/minoss-surveillance): Controlling the Synology Surveillance Station


## Configure a Module
Many Modules would need configuration files.
If you install Modules with `npm` you would lost these or have to edit files in the `node_modules` folder.
Each is not quite usable.

Because of this you can place all your configuration inside the `config/` folder of the Minoss root, or in a local Module instance.
The sever will select these files then instead.
The order for overwriting configuration is: `node installed Module` -> `local Module` -> `root config/ folder`

To overwrite a configuration with a local instance, just create a sub-folder there, with the Name of the Module you want to override and place the configs there.

```
htdocs/
  |- hue/              <-- module name
    |- config/
      |- bridges.js    <-- overriding configuration
```

Anotherway, if you don't need a local Module, is to place all configurations in the `config/` directory of the root Folder.
Just create a sub-folder with the Name of the Module you want to override.

```
htdocs/
  |- config/
    |- hue/            <-- module name
      |- bridges.js    <-- overriding configuration
    | - messages.js
    | - server.js
```


## Overwrite Module Files
It is possible to override files of other Modules, installed with `npm`.
There is no need to copy the whole Module.
Just copy the Script you want to change inside a local Module folder.

```
htdocs/
  |- config/
  |- node_modules/
    |- minoss-example
      |- example.js      <-- the file you want to override
  |- src/
  |- .jshintrc
  |- gulpfile.js
  |- package.json
  |- README.md
  |- server.js
```

```
htdocs/
  |- config/
  |- example/
    |- example.js        <-- place it here to override
  |- node_modules/
    |- minoss-example
      |- example.js
  |- src/
  |- .jshintrc
  |- gulpfile.js
  |- package.json
  |- README.md
  |- server.js
```

You only need to change the `require` entries to the correct files, if used, and you're ready to go.
All other scripts will be loaded from `node_modules/example/` like before.


## Validating Scripts
Because you will not see all errors on blind execution of your scripts, there is a build in javascript validation with `jshint`.
You can execute this validation whenever you like, or let it watch for file changes.

```SH
$ gulp validateAll
$ gulp validate
$ gulp watch
```


## Bugs / Feature request
Please [report](http://github.com/eisbehr-/minoss/issues) bugs and feel free to [ask](http://github.com/eisbehr-/minoss/issues) for new features directly on GitHub.


## License
Minoss is dual-licensed under [MIT](http://www.opensource.org/licenses/mit-license.php) and [GPL-2.0](http://www.gnu.org/licenses/gpl-2.0.html) license.


## Donation
_You like to support me?_  
_You appreciate my work?_  
_You use it in commercial projects?_  
  
Feel free to make a little [donation](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=93XQ8EYMSWHC6)! :wink:
