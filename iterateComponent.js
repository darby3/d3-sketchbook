//importing necessary modules
const path = require('path');
const fs = require('fs');
const ncp = require('ncp').ncp;
const prompt = require('prompt');

const dir_path = path.join(__dirname, 'components');

// Picking the directory of components

fs.readdir(dir_path, {
  withFileTypes: true
}, function (err, files) {
  //handling error
  if (err) {
    return console.log('Unable to find or open the directory: ' + err);
  }

  const curDirs = files.filter(dirent => dirent.isDirectory() && dirent.name !== 'node_modules')
    .map(dirent => dirent.name);

  let componentDirs = [];

  curDirs.sort().forEach(function (dir, i) {
    componentDirs.push({
      'option': i,
      'directory': dir
    })
  })

  console.log("Available component sets:")
  console.log("-------------------------")
  componentDirs.forEach(item => {
    console.log(item.option + " : " + item.directory);
  })
  console.log("-------------------------")

  // Prompt user for the directory to check

  prompt.message = "";
  prompt.start();

  prompt.get(['component_set'], function (err, result) {
    console.log('Command-line input received:');
    console.log('  component_set: ' + result.component_set);

    const componentSetDir = componentDirs.find(dir => (dir.option === parseInt(result.component_set))).directory;

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

    const availableComponents = files.filter(dirent => dirent.isDirectory() && dirent.name !== 'node_modules')
      .map(dirent => dirent.name);

    let availableComponentDirs = [];

    availableComponents.sort().forEach(function (dir, i) {
      availableComponentDirs.push({
        'option': i,
        'directory': dir
      })
    })

    console.log("Available components:")
    console.log("--------------------")
    availableComponentDirs.forEach(item => {
      console.log(item.option + " : " + item.directory);
    })
    console.log("--------------------")

    // Prompt user for the component to duplicate

    prompt.message = "";
    prompt.start();

    prompt.get(['directory_to_duplicate', 'new_directory_name'], function (err, result) {
      console.log('Command-line input received:');
      console.log('  directory: ' + result.directory_to_duplicate);
      console.log('  new directory: ' + result.new_directory_name);

      const dirPath = 'components/' + componentSetDir + '/';
      const oldDir = availableComponentDirs.find(dir => (dir.option === parseInt(result.directory_to_duplicate))).directory;

      console.log(dirPath + oldDir);

      const oldComponent = dirPath + oldDir;
      const newComponent = dirPath + result.new_directory_name;

      ncp(oldComponent, newComponent, function (err) {
        if (err) {
          return console.error(err);
        }

        console.log('finished duplicating component, updating new component next');
        updateNewComponent(newComponent, result.new_directory_name);
      });
    });
  })
}

// Given a new component, update it
function updateNewComponent(newComponent, newComponentName) {
  console.log(newComponent);
  console.log(newComponentName);
  
  // rename the files in the component

  // edit the contents of the component

}
