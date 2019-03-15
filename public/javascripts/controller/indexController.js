app.controller('indexController', ['$scope', 'indexFactory', 'configFactory', ($scope, indexFactory, configFactory) => {

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

    scrollTop = () => {
        setTimeout(() => {
            const element = document.getElementById('chat-area');
            element.scrollTop = element.scrollHeight;
        })

    };

    showBubble = (id,message) => {

        let timer = 0;

        if(message){
            $('#' + id).find('.message').addClass('newMessageIn').html(message);
            timer += 3000;
            setTimeout(() => {
                $('#' + id).find('.message').removeClass('newMessageIn');
            }, timer)
        }
    };


    async function initUsername (username) {

        $('.game').css("opacity", "1");

        const connectionOptions = {
            reconnectionAttemts: 3,
            reconnectionDelay: 600
        };
        try {
            const socketUrl = await configFactory.getConfig();
            const socket = await indexFactory.connectSocket(socketUrl, connectionOptions);
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
               scrollTop();
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
                scrollTop();
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
                  id: $scope.players[socket.id].id,
                  text: message
              };

              if(messageData.text) {
                  socket.emit('newMessage', messageData);
              }

              scrollTop();
              showBubble(messageData.id, messageData.text);

            };

            socket.on('newMessage', (messageData) => {
                $scope.messages.push(messageData);
                $scope.message = '';
                scrollTop();
                showBubble(messageData.id, messageData.text);
                $scope.$apply();
            });
        }catch (e) {
            console.log(e);
        }

    } // async function


}]); // app controller son