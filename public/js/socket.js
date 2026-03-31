// Lắng nghe server trả về
        var socket = io();

        socket.on('SOCKETID_BY_SERVER', (data) => {
            const elementSocketId = document.querySelector("#socket-id");
            elementSocketId.innerHTML = data;
            console.log('message: ' + data);
        });
        // Kết thúc lắng nghe server trả về

        // Gửi lên server
        var form = document.getElementById('form');
        var input = document.getElementById('input');

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (input.value) {
            socket.emit('CLIENT_SEND_MESSAGE', input.value);
            input.value = '';
            }
        });
        // Kết thúc gửi lên server