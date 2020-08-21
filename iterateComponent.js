const path = require('path');
const fs = require('fs');
const ncp = require('ncp').ncp;
const prompt = require('prompt');
const shell = require('shelljs');
const chalk = require('chalk');

const dir_path = path.join(__dirname, 'components');

// Picking the directory of components

fs.readdir(dir_path, {
  withFileTypes: true
}, function (err, files) {
  //handling error
  if (err) {
    return console.log('Unable to find or open the directory: ' + err);
  }

  const curDirs = getDirs(files);
  const componentDirs = getOptions(curDirs);

  console.log("Available component sets:")
  outputOptions(componentDirs);

  // Prompt user for the directory to check

  prompt.message = "";
  prompt.start();

  prompt.get(['Component set'], function (err, result) {
    if (err) {
      console.log('\n\nCancelled.\n');
      return;
    }

    const componentSetDir = componentDirs.find(dir => {
      return dir.option === parseInt(result['Component set']);
    }).directory;

    console.log('\n');
    goDuplicateComponent(componentSetDir);
  });
});

// Given a directory, find the components inside it, pick one, and duplicate it

function goDuplicateComponent(componentSetDir) {
  const dir_path = path.join(__dirname, 'components/', componentSetDir);

  fs.readdir(dir_path, {
    withFileTypes: true
  }, function (err, files) {
    if (err) {
      return console.log('Unable to find or open the directory: ' + err);
    }

    const availableComponents = getDirs(files);
    const availableComponentDirs = getOptions(availableComponents);

    console.log("Available components:")
    outputOptions(availableComponentDirs);

    // Prompt user for the component to duplicate

    prompt.message = "";
    prompt.start();

    prompt.get(['Directory to duplicate', 'New directory name'], function (err, result) {
      if (err) {
        console.log('\n\nCancelled.\n');
        return;
      }

      const dirPath = 'components/' + componentSetDir + '/';
      const oldDir = availableComponentDirs.find(dir => {
        return dir.option === parseInt(result['Directory to duplicate']);
      }).directory;

      const oldComponent = dirPath + oldDir;
      const newComponent = dirPath + result['New directory name'];

      console.log(chalk.cyanBright("-- duplicating component"));

      ncp(oldComponent, newComponent, function (err) {
        if (err) {
          return console.error(err);
        }

        updateNewComponent(oldDir, newComponent, result['New directory name']);
      });
    });
  })
}

// Given a new component, update it
function updateNewComponent(oldComponentName, newComponent, newComponentName) {
  console.log(chalk.cyanBright("-- updating component contents"));

  const oldComponentShort = oldComponentName.substring(3);
  const newComponentShort = newComponentName.substring(3);

  shell.ls(newComponent).forEach(function (file) {
    // edit the contents of the component
    shell.sed('-i', oldComponentShort, newComponentShort, newComponent + '/' + file);

    // rename the files in the component
    const newFileName = file.replace(oldComponentShort, newComponentShort);
    fs.rename(newComponent + '/' + file, newComponent + '/' + newFileName, () => {
    });
  });
}

// Given a file list, return valid directories
function getDirs(files) {
  return files.filter(dirent => {
    return dirent.isDirectory() && dirent.name !== 'node_modules';
  }).map(dirent => dirent.name);
}

// Given a directory list, return a list of options
function getOptions(dirs) {
  let output = [];

  dirs.sort().forEach(function (dir, i) {
    output.push({
      'option': i + 1,
      'directory': dir
    })
  })

  return output;
}

function outputOptions(opts) {
  console.log('--');

  opts.forEach(item => {
    console.log(chalk.greenBright(item.option) + "  :  " + item.directory);
  });

  console.log('--');
}
