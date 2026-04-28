// Polyfill for fetch API in jsdom environment
global.fetch = require('node-fetch');
