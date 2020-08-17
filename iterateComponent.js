//importing necessary modules
const path = require('path');
const fs = require('fs');
const ncp = require('ncp').ncp;
const prompt = require('prompt');

const dir_path = path.join(__dirname, 'components');

//passsing dir_path and callback function
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

  // prompt

  prompt.message = "";
  prompt.start();

  prompt.get(['component_set'], function (err, result) {
    console.log('Command-line input received:');
    console.log('  component_set: ' + result.component_set);

    const componentSetDir = componentDirs.find(dir => (dir.option === parseInt(result.component_set))).directory;

    goDuplicateComponent(componentSetDir);
  });
});


function goDuplicateComponent(componentSetDir) {
  const dir_path = path.join(__dirname, 'components/', componentSetDir);

//passsing dir_path and callback function
  fs.readdir(dir_path, {
    withFileTypes: true
  }, function (err, files) {
    //handling error
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

    // prompt

    prompt.message = "";
    prompt.start();

    prompt.get(['directory_to_duplicate', 'new_directory_name'], function(err, result) {
      //
      // Log the results.
      //
      console.log('Command-line input received:');
      console.log('  directory: ' + result.directory_to_duplicate);
      console.log('  new directory: ' + result.new_directory_name);

      const dirPath = 'components/' + componentSetDir + '/';
      const oldDir = availableComponentDirs.find(dir => (dir.option === parseInt(result.directory_to_duplicate))).directory;

      console.log(dirPath + oldDir);

      ncp(dirPath + oldDir, dirPath + result.new_directory_name, function(err) {
        if (err) {
          return console.error(err);
        }
        console.log('done!');
      });
    });
  })
}

