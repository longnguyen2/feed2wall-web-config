const P2P = require('socket.io-p2p');
const io = require('socket.io-client');
const socket = io('localhost:3000');
const p2p = new P2P(socket);

export default class P2pPlugin {
  static install(Vue, options) {
    Vue.prototype.$p2p = p2p;
  }
};