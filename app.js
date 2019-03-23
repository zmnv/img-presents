const dirTree = require('directory-tree');
const fs = require('fs');
const copydir = require('copy-dir');
const path = require('path');
const chalk = require('chalk');

const { dictionary } = require('./src/js-helpers/polyglot');

const { ViewsHeader, ViewsFooter, ViewsPolls, Template } = require('./src/views');
const ENV = require('./environment');

const filesValidate = /\.(jpeg|jpg|png|svg|gif)$/;

function Main(
  pageTitle = '',
  renderToPath = `${ENV.currentPath}/build`
) {

  // createDirectories();

  const tree = dirTree(
    ENV.currentPath,
    { 
      extensions: filesValidate,
      exclude: /build/
    },
    (item, path) => {
      // console.log('tree', item);
    },
  );

  copydir.sync(ENV.currentPath, `${renderToPath}/images`, (stat, filepath, filename) => {
    if (stat === 'directory') {
      return filename === 'build' ? false : true;
    } else {
      const ext = path.extname(filename).toLowerCase();

      if(filesValidate.test(ext)) {
        console.log(`${chalk.greenBright('  ✔')} ${chalk.greenBright(filename)}`);
        return true;
      } else return false;
    }
  }, function(err) {
    console.log(chalk.redBright('  ' + dictionary.BUILDER_FILE_COPY_ERROR[ENV.locale]), err);
  });

  const styleFile = fs.readFileSync(`${__dirname}/public/${ENV.styleName}`, 'utf8');
  const streamStyles = fs.createWriteStream(`${renderToPath}/${ENV.styleName}`);

  streamStyles.once('open', fd => {
    streamStyles.write(styleFile);
    streamStyles.end();
  })

  const stream = fs.createWriteStream(`${renderToPath}/index.html`);
  stream.once('open', function(fd) {
    // console.log('before:', tree['children']);
    const imagesList = tree['children'].sort(function(a, b) {
      if (a.type < b.type) return 1;
      if (a.type > b.type) return -1;
      return 0;
    });

    // console.log('after:', imagesList);

    stream.write(ViewsHeader(pageTitle, ENV.styleName));
    stream.write(
      '<div class="vg-container container-width-max"><div class="row">',
    );
    stream.write(Template(imagesList));
    stream.write('</div></div>');
    stream.write(ViewsFooter);

    if (process.env.LAYOUT === 'CHECKS') {
      stream.write(ViewsPolls);
    }

    stream.end();
  });
}

// Main();

module.exports = Main;
