const PATH = require('path');
const dirTree = require('directory-tree');
const fs = require('fs');
const copydir = require('copy-dir');

const ViewsHeader = require('./src/views/header');
const ViewsContainer = require('./src/views/container');
const ViewsFooter = require('./src/views/footer');
const Template = require('./src/views/index');

const tree = dirTree(
  './images',
  { extensions: /\.(jpeg|jpg|png|svg|gif)$/ },
  (item, PATH) => {
    // console.log(item);
  },
);

const isBuildFolderExist = fs.existsSync(PATH.join(__dirname, '/build'));
if (!isBuildFolderExist) {
  fs.mkdirSync('build');
}

const stream = fs.createWriteStream('build/index.html');
stream.once('open', function(fd) {
  const imagesList = tree['children'].sort(function(a, b) {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

  stream.write(ViewsHeader(tree['name'], 'style.css'));
  stream.write(
    '<div class="vg-container container-width-max"><div class="row">',
  );
  stream.write(Template(imagesList));
  stream.write('</div></div>');
  stream.write(ViewsFooter);
  stream.end();
});

copydir.sync('images', 'build/images');
