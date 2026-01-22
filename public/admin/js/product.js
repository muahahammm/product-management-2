// Change status
const buttonChangeStatus = document.querySelectorAll("[button-change-status]")
if(buttonChangeStatus.length > 0){
    const formChangeStatus = document.querySelector("#form-change-status");
    const path = formChangeStatus.getAttribute("data-path");
    console.log(path);

    buttonChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            const currentStatus = button.getAttribute("data-status");
            const currentId = button.getAttribute("data-id");

            let statusChange = currentStatus == "active" ? "inactive" : "active";

            const action = path + `/${statusChange}/${currentId}?_method=PATCH`;
            console.log(action);
            formChangeStatus.action = action;
            formChangeStatus.submit();
        });
    });
}
// End change status


// Delete item
const buttonsDelete = document.querySelectorAll("[button-delete]");
if(buttonsDelete.length > 0) {
    const formDeleteItem = document.querySelector("#form-delete-item");
    const path = formDeleteItem.getAttribute("data-path");

    buttonsDelete.forEach(button => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có muốn xóa sản phẩm này không");

            if(isConfirm){
                const id = button.getAttribute("data-id");
                const action = `${path}/${id}?_method=DELETE`;

                formDeleteItem.action = action;
                formDeleteItem.submit();
            }
        });
    });
}
// End delete item