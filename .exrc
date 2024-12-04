let g:vigun_mappings = [
      \ {
      \   'pattern': 'Spec.js$',
      \   'all': './node_modules/.bin/electron-mocha --renderer --color --no-timeouts --require-main=./test-electron-main.js #{file}',
      \   'nearest': './node_modules/.bin/electron-mocha --renderer --color --no-timeouts --require-main=./test-electron-main.js --fgrep #{nearest_test} #{file}',
      \   'debug-nearest': './node_modules/.bin/electron-mocha --renderer --color --no-timeouts --require-main=./test-electron-main.js --interactive --fgrep #{nearest_test} #{file}',
      \ },
      \]
