# grunt-handlebars-merge v0.0.1

> Merge Handlebars templates to one file.


Inspiried by [grunt-contrib-handlebars](https://github.com/gruntjs/grunt-contrib-handlebars) and [grunt-handlebars-min](https://www.npmjs.com/package/grunt-handlebars-min)


## Getting Started

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-handlebars-merge --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-handlebars-merge');
```


## Handlebars task
_Run this task with the `grunt hbsmerge` command._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

### Options

#### namespace
Type: `String` or `false` or `function`  
Default: `'Templates'`

The namespace in which templates will be assigned.

Example:
```js
options: {
  namespace: 'Templates'
}
```

#### processContent
Type: `Function`

This option accepts a function which takes two arguments (the template file content, and the filepath) and returns a string which will be used as the source for the precompiled template object.  The example below removes leading and trailing spaces to shorten templates.

```js
options: {
  processContent: function(content, filepath) {
    content = content.replace(/^[\x20\t]+/mg, '').replace(/[\x20\t]+$/mg, '');
    content = content.replace(/^[\r\n]+/, '').replace(/[\r\n]*$/, '\n');
    return content;
  }
}
```

#### processName
Type: `Function`

This option accepts a function which takes one argument (the template filepath) and returns a string which will be used as the key for the precompiled template object.  The example below stores all templates on the default JST namespace in capital letters.

```js
options: {
  processName: function(filePath) {
    return filePath.toUpperCase();
  }
}
```

#### processPartialName
Type: `Function`

This option accepts a function which takes one argument (the partial filepath) and returns a string which will be used as the key for the precompiled partial object when it is registered in Handlebars.partials. The example below stores all partials using only the actual filename instead of the full path.

```js
options: {
  processPartialName: function(filePath) {  // input: templates/_header.hbs
    var pieces = filePath.split("/");
    return pieces[pieces.length - 1];       // output: _header.hbs
  }
}
````

Note: If processPartialName is not provided as an option the default assumes that partials will be stored by stripping trailing underscore characters and filename extensions. For example, the path *templates/_header.hbs* will become *header* and can be referenced in other templates as *{{> header}}*.

#### partialRegex
Type: `Regexp`  
Default: `/^_/`

This option accepts a regex that defines the prefix character that is used to identify Handlebars partial files.

```js
// assumes partial files would be prefixed with "par_" ie: "par_header.hbs"
options: {
  partialRegex: /^par_/
}
```

#### partialsPathRegex
Type: `Regexp`  
Default: `/./`

This option accepts a regex that defines the path to a directory of Handlebars partials files. The example below shows how to mark every file in a specific directory as a partial.

```js
options: {
  partialRegex: /.*/,
  partialsPathRegex: /\/partials\//
}
```



#### partialsPathRegex
Type: `Regexp`  
Default: `/./`

This option accepts a regex that defines the path to a directory of Handlebars partials files. The example below shows how to mark every file in a specific directory as a partial.

```js
options: {
  partialRegex: /.*/,
  partialsPathRegex: /\/partials\//
}
```



#### minify
Type: `Bool`  
Default: `false`

This option turns on template minification.

```js
options: {
  minify: true
}
```


#### clearHtmlComments
Type: `Bool`  
Default: `true`

Remove HTML comments (<!-- -->) from templates.

```js
options: {
  clearHtmlComments: false
}
```


#### clearHandlebarsComments
Type: `Bool`  
Default: `true`

Remove Handlebars comments ({{!-- --}}) from templates.

```js
options: {
  clearHandlebarsComments: false
}
```
	
#### templateQuotes
Type: `Number`  
Default: `2`

Convert quotes inside templates:

1 - Convert double quotes to single

2 - Convert single quoters to double

```js
options: {
  templateQuotes: 1
}
```



### Usage Examples

```js
hbsmerge: {
  compile: {
    options: {
      minify: true,
      templateQuotes: 1
    },
    files: {
      "path/to/result.js": "path/to/source.hbs",
      "path/to/another.js": ["path/to/sources/*.hbs", "path/to/more/*.hbs"]
    }
  }
}
```


```js
hbsmerge: {
  compile: {
    options: {
      minify: true,
      templateQuotes: 1
    },
	src: ["path/to/templates/**/*.hbs"],
	dest: "path/to/templates/mergedTemplates.js",
  }
}
```



