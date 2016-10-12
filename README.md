# Minoss - Mini Node Script Server
This is a small yet powerful server based on [`node.js`](https://nodejs.org) and [`express`](http://expressjs.com).
It's designed to simple create and serve usable APIs for automatising things, like with the [`Raspberry Pi`](https://www.raspberrypi.org/) or whenever it's needed to easily execute scripts.
Minoss is very easy to extend for your needs.

Build in it has a automatically file loading, handling abstractions and configurations on many levels.
Just place the files on the right place and the Server will handle anything else.


## Table of Contents
* [Installation](#installation)
* [Install Modules](#install-modules)
* [Configuration](#configuration)
  * [Custom Routes](#custom-routes)
* [Start Minoss](#start-minoss)
  * [Let Minoss run forever](#let-minoss-run-forever)
* [Call a Module-Script](#call-a-module-script)
* [Output Formats](#output-formats)
  * [JSON](#json)
  * [XML](#xml)
  * [Text](#text)
* [Available Modules](#available-modules)
  * [Currently available](#currently-available)
  * [Currently in private Beta](#currently-in-private-beta)
* [Create an own Module](#create-an-own-module)
  * [Creating an executable Script for a Module](#creating-an-executable-script-for-a-module)
    * ['config' Parameter](#config-parameter)
    * ['params' Parameter](#params-parameter)
    * ['respond' Parameter](#respond-parameter)
    * ['error' Parameter](#error-parameter)
* [Configure a Module](#configure-a-module)
* [Overwrite Module Files](#overwrite-module-files)
* [Validate Scripts](#validate-scripts)
* [Bugs / Feature request](#bugs--feature-request)
* [License](#license)
* [Donation](#donation)


---


## Installation
Inside a folder where you want to install Minoss you just need to download the project files.
It's possible to download the [`zip` archive from GitHub](https://github.com/eisbehr-/minoss/archive/master.zip) or use `git` to download the latest files.

```SH
$ git clone https://github.com/eisbehr-/minoss.git .
```


## Install Modules
If you want to use other public modules, the easiest way to install them is to use [npm](https://npmjs.com).
For example:

```SH
$ npm install minoss-example
```


## Configuration
Minoss itself only has a very small configuration.
You will find anything with a description inside the `config/server.js` file.
Change the options as you like.

name        | default  | description
------------|----------|--------------
debug       | false    | enable debug mode to have a verbose console output
port        | 8080     | port number to listen on after start
xmlRootTag  | root     | name of the xml root tag


### Custom Routes
The `routes.js` configuration allows you to add own routes to the server.
Because Minoss is based on `express` you can use it's full [routing functions](https://expressjs.com/en/guide/routing.html). 

```JS
module.exports = function(app) {
    app.get("/example", function(req, res) {
        res.send("example response");
    });
}
```

## Start Minoss
The server can be started one time by using `npm start` or manually by `node server.js` inside the directory where you installed it.

```SH
$ node server.js
```

After start a message should notice about where the server is listening by now.

```TEXT
$ Minoss now listening on http://localhost:8080 ...
```


### Let Minoss run forever
You may want to let the server running forever and automatically start it after reboot or crash.
Therefore you could use [`pm2`](https://github.com/Unitech/PM2), a process manager for `node.js`.

If you didn't use `pm2` already, you can install it globally.

```SH
$ npm install -g pm2
```

Once installed you can add Minoss execution to the handling of `pm2`:

```SH
$ pm2 startup
$ pm2 start server.js --name minoss
$ pm2 save
```

And that's it, your server will now run automatically on every boot, `pm2` will even restart Minoss when it crashes.
If you want to stop it with `pm2 stop minoss`.


## Call a Module-Script
You call and execute a script always by `module` and `script` name.
Minoss will do anything else for you.

```TEXT
http://localhost:8080/{MODULE}/{SCRIPT}
```


## Output Formats
Minoss supports three different output types by default: `json`, `xml` and plain `text`, while `json` is the default.
You can switch between them every time.
Just put the wanted output format before the `module` and `script` name, or append it as `get` parameter.


### JSON
Possible calls:

```TEXT
http://localhost:8080/module/script
http://localhost:8080/json/module/script
http://localhost:8080/module/script?output=json
```

Will output something like:

```JSON
{
  "success": true
}
```


### XML
Possible calls:

```TEXT
http://localhost:8080/xml/module/script
http://localhost:8080/module/script?output=xml
```

Will output something like:

```XML
<?xml version='1.0'?>
<minoss>
  <success>true</success>
</minoss>
```


### Text
Possible calls:

```TEXT
http://localhost:8080/text/module/script
http://localhost:8080/module/script?output=text
```

The `text` output format will return `1` on success and `0` on failure.
If an error message is available it will be return just the message itself.
So in short, everything not `1` is an error. 


## Available Modules
There are currently only a few modules available by myself.
Feel free to [create own Modules](https://github.com/eisbehr-/minoss-example) on your own or spread some new ones with other.


### Currently available:
- [minoss-example](https://github.com/eisbehr-/minoss-example): An example module explaining how to create and use modules
- [minoss-hue](https://github.com/eisbehr-/minoss-hue): Controlling Philips Hue devices and lamps


### Currently in private Beta:
- [minoss-surveillance](https://github.com/eisbehr-/minoss-surveillance): Controlling the Synology Surveillance Station
- [minoss-pushover](https://github.com/eisbehr-/minoss-pushover): Create and send push notifications via PushOver


## Create an own Module
Creating a module is just creating a new folder in the Minoss root directory.
The name of the directory is the name of the module.
Inside this directory all executable scripts takes place.
The name of the Files are also the name of the script.

For example, when creating a folder and file named `example/test.js`, the module is named `example` and the dcript is named `test`.
So the URl would be something like `http://hostname:8080/example/test`.

More details and a full example can be found inside the [`minoss-example`](https://github.com/eisbehr-/minoss-example) repository.


### Creating an executable Script for a Module
A Script must always `export` a `function`.
This function has four parameters, which will be filled by Minoss on request of this script.


```JS
module.exports = function(config, params, respond, error) {
    respond(true);
};
``` 

name     | type      | description
---------|-----------|--------------
config   | object    | contains all configurations for this module
params   | object    | contains all parameters given by request url
respond  | function  | callback function for browser response
error    | function  | callback function for errors


#### 'config' Parameter
The `config` parameter is an `object`, containing all configuration data from this Module.
The properties inside this object are the config file names.
If there would be two config Files, named `config/foo.js` and `config/bar.js`, the object would be look like this:

```JS
var config = {
    foo: {
        // export of config/foo.js
    },
    bar: {
        // export of config/bar.js
    }
};
```


#### 'params' Parameter
The `params` parameter is an `object`, containing all parameters given by URL on this request.
It will at least contain the `module`, `script` and `output` parameters.
Assuming a request URL like `http://localhost:8080/example/test?mode=get&id=1` the object would be look like this:

```JS
var params = {
    module: "example",
    script: "test",
    output: "json",
    mode: "get",
    id: 1
};
```


#### 'respond' Parameter
The `respond` callback function is used to tell Minoss that your script is finished and for responding additional data.
It can handle `true` and `false` as parameter, for telling success or fail, or an `object` with more data.
There should be no further output after this has been called.

```JS
respond(true);  // shorthand for: {success: true}
respond(false); // shorthand for: {success: false}
respond({success: true, data: "myData"});
```


#### 'error' Parameter
The `error` callback is optional and can be used for responding errors.
It can be done with the `respond` callback too, but it is a shorthand for this task and would make your script more readable.
The only parameter of this function can be a message as `string` or an `object` with additional data.
There should be no further output after this has been called.

```JS
error("error message"); // shorthand for: {success: false, error: "error message"}
```


## Configure a Module
Many modules would need configuration files.
If you install modules with `npm` you would lost these or have to edit files in the `node_modules` folder.
Each is not quite usable.

Because of this you can place all your configurations inside the `config/` folder of the Minoss root, or in a local module instance.
The sever will select these files then instead.
The order for overwriting configuration is: `node installed module` -> `local module` -> `root 'config/' folder`

To overwrite a configuration with a local instance, just create a sub-folder there, with the name of the module you want to override and place the configs there.

```
htdocs/
  |- hue/              <-- module name
    |- config/
      |- bridges.js    <-- overriding configuration
```

Another way, if you don't need a local module, is to place all configurations in the `config/` directory of the root folder.
Just create a sub-folder with the name of the module you want to override.

```
htdocs/
  |- config/
    |- hue/            <-- module name
      |- bridges.js    <-- overriding configuration
    | - messages.js
    | - server.js
```


## Overwrite Module Files
It is possible to override files of other modules, installed with `npm`.
There is no need to copy the whole module.
Just copy the script you want to change inside a local module folder.

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


## Validate Scripts
Because you will not see all errors on blind execution of your scripts, there is a build in javascript validation with `gulp` and `jshint`.
You can execute this validation whenever you like, or let it watch for file changes, with the following commands:

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
