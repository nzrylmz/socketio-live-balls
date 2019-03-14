app.factory('indexFactory', [() => {
    const connectSocket = (url,options) => {
      return new Promise((resolve,reject) => {
         const socket = io.connect(url,options);

         socket.on('connect', () => {
             console.log('Bağlantı başarılı!')
             resolve(socket);
         });
         socket.on('connec_error', () => {
             reject(new Error('connect_error'))
         })
      });
    };
    return{
        connectSocket
    }
}]);