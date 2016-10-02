tsc --module amd --outFile js/base.js scripts/*.ts
uglifyjs js/base.js --compress --mangle > js/main.js
