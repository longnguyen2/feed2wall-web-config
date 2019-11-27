const io = require('socket.io-client');
const socket = io.connect(`${location.hostname}:3000`);

export default class SocketIo {
  static install(Vue, options) {
    Vue.prototype.$socket = socket;
  }
};