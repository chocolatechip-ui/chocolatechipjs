ChocolateChipJS
================

##A JavaScript Library for Mobile Web App Development

The purpose of ChocolateChipJS is to use with ChocolateChip-UI. Of course, since it is so small and fast, you could use it as the basis for a simple mobile app, as you would with Zeptojs, etc. Please visit [ChocolateChip-UI's Website](http://chocolatechip-ui.com) for documentation on ChocolateChipJS. You can optionally build the ChocolateChip-UI framework with support for ChocolateChipJS. Please read the build instructions for [ChocolateChip-UI to learn more](http://chocolatechip-ui.com/documentation).

##Building 

If you do not want to build the framework from scratch, you can use the pre-compiled version in the dist folder. This is just the framework, minus examples, demos, etc.

ChocolateChipJS uses Gulpjs to build. This is a Node package, so you'll first need to have [Node installed](http://http://nodejs.org). After installing Nodejs, or if you already have it installed, on Mac OS X use the terminal to cd to the directory. On Windows you can use the Windows command prompt to do this. Once you are in the folder, run the following command in your terminal. 

###Gulpjs

On Mac OS X, you'll need to run the command in your terminal with **sudo** to avoid installation errors:

```
shell
sudo npm install -g gulp
``` 


For Windows, just runt this:

```
shell
npm install -g gulp
```

Enter your password when it requests. After you should see a number of Nodejs modules being installed in a folder called **node\_modules**. You do not need **node\_modules** in your final project. The node modules are there to enable the build process with Gruntjs.

Now that you have the node modules install, you can just type `gulp` in the terminal and hit return/enter. 

```
gulp
```

###Support for ECMAScript 6 Promises

By default ChocolateChipJS provides support for ECMAScript 6 promises. If you prefer to use the older, jQuery-style deferred object syntax, you can build a version of ChocolateChipJS with support for it using the flag, `deferredSupport`:

```
gulp --deferredSupport true
```

This will replace the ECMAScript 6 style promses and Ajax behavior with jQuery-style deferred object and Ajax methods.


###Note

You do not need Nodejs to use ChocolateChipJS. Nodejs is only used to build the framework and examples from the source files.

##Contributing Code
###Avoiding Carriage Returns in Commits

ChocolateChipJS uses Unix linefeeds (LF) for new lines. Github for Windows adds carriage returns to linefeeds (CRLF). If you try to check in such files, Git will flag every line with changed new lines, which means practically everything. To avoid this we've added a .gitattributes file to the repository. This will prevent Github from converting the new lines on Windows. 

If you are editing the source code on Windows, depending on the text editor you are using, or if you do a copy/paste, you may inadvertently introduce Windows carriage returns. Also some Grunt actions, such as concatenation with banners, automatically create newlines with carriage returns on Windows. When these carriage returns are added to the source code, they will show up as a changes at commit time. You can avoid this. Navigate to the ChocolateChipJS repository in the command prompt, then execute these two Git commands:

```
git config core.eol lf
git config core.autocrlf input
```

core.eol tells Git to always checkout this repository with LF. 
core.autocrlf tells Git to convert CRLF to LF on commit.
