app.factory('configFactory', ['$http', ($http) => {
    const getConfig = () => {
      return new Promise((resolve,reject) => {
          $http
              .get('/getEnv')
              .then((data) => {
                  console.log(data.data.socketUrl);
                  resolve(data.data.socketUrl);
              })
              .catch((err) => {
                  reject(err)
              })
      });
    };
    return{
        getConfig
    }
}]);