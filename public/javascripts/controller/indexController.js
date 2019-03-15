app.controller('indexController', ['$scope', 'indexFactory', ($scope, indexFactory) => {

    $scope.messages = [ ];
    $scope.players = [ ];

    $scope.init = () => {
        const username = prompt('Kullanıcı adınızı girin!');

        if(username) {
            initUsername(username);
        }else{
            return false;
        }
    };

    function initUsername (username) {

        const connectionOptions = {
            reconnectionAttemts: 3,
            reconnectionDelay: 600
        };

        indexFactory.connectSocket('http://localhost:3000', connectionOptions)
            .then((socket) => {
                socket.emit('newUser', {username});

                socket.on('initPlayers', (players) => {
                    $scope.players = players;
                    $scope.$apply();
                });

                socket.on('newUser', (data) => {
                   const messageData = {
                       type: 0, // 0 sistem mesajı
                       username: data.username,
                       text: 'katıldı!'
                   };

                   $scope.messages.push(messageData);
                   $scope.players[data.id] = data;
                   $scope.$apply();
                });

                socket.on('disUser', (data) => {
                    const messageData = {
                        type: 0, // 0 sistem mesajı
                        username: data.username,
                        text: 'çıkış yaptı!'
                    };

                    console.log($scope.messages);

                    $scope.messages.push(messageData)
                    delete $scope.players[data.id];
                    $scope.$apply();
                });

                socket.on('animate', data => {
                    console.log(data);
                    $('#'+ data.socketId).animate({'left': data.x, 'top': data.y}, () => {
                        animate = false;
                    });
                });

                let animate = false;

                $scope.onClickPlayer = ($event) => {
                    console.log($event.offsetX, $event.offsetY);

                    let x = $event.offsetX - ($('.circle').width() / 2);
                    let y = $event.offsetY - ($('.circle').height() / 2);
                    console.log(x, y)
                    if(!animate){

                        socket.emit('animate', { x, y });

                        animate = true;
                        $('#'+ socket.id).animate({'left': x, 'top': y}, () => {
                            animate = false;
                        });

                    }
                };

                $scope.newMessage = () => {
                  let message = $scope.message;

                  const messageData = {
                      type: 1, // 1 kullanıcı mesajı
                      username: /*$scope.players[socket.id].*/username,
                      text: message
                  };

                  socket.emit('newMessage', messageData);



                };

                socket.on('newMessage', (messageData) => {
                    $scope.messages.push(messageData);
                    $scope.message = '';
                    $scope.$apply();

                    const element = document.getElementById('chat-area');
                    element.scrollTop = element.scrollHeight;
                });



            }).catch((err) => {
            console.log(err);
        });
    };



}]);