// Chức năng gửi yêu cầu kết bạn 
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if(listBtnAddFriend.length > 0) {
    listBtnAddFriend.forEach(button => {
        button.addEventListener("click", () => {           
            button.closest(".box-user").classList.add("add");
            const userId = button.getAttribute("btn-add-friend");
            socket.emit("CLIENT_ADD_FRIEND", userId);
        });
    });
}
// Kết thúc chức năng gửi yêu cầu kết bạn 


// Chức năng hủy gửi yêu cầu 
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if(listBtnCancelFriend.length > 0) {
    listBtnCancelFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.remove("add");
            const userId = button.getAttribute("btn-cancel-friend");
            // socket.emit("CLIENT_CANCEL_FRIEND", userId);
        });
    });
}
// Kết thúc chức năng hủy gửi yêu cầu


// Chức năng từ chối yêu cầu kết bạn
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if(listBtnRefuseFriend.length > 0) {
    listBtnRefuseFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("refuse");
            const userId = button.getAttribute("btn-refuse-friend");
            // socket.emit("CLIENT_REFUSE_FRIEND", userId);
        });
    });
}
// Kết thúc chức năng từ chối yêu cầu kết bạn