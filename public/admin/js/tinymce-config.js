tinymce.init({
    selector: "textarea.textarea-tinymce",
    license_key: "gpl",
    plugins: "lists link image code",
    toolbar: "undo redo | bold italic | bullist numlist | link image | code",

    image_title: true,
    automatic_uploads: true,

    file_picker_types: 'image',
    file_picker_callback: function (cb, value, meta) {
        if (meta.filetype === 'image') {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');

            input.onchange = function () {
                const file = this.files[0];
                const reader = new FileReader();

                reader.onload = function () {
                    cb(reader.result, {
                        title: file.name
                    });
                };

                reader.readAsDataURL(file);
            };

            input.click();
        }
    }
});
