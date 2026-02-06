// Đệ quy phân cấp danh mục
let count = 0;
const createTree = (arr, parentID = "") => {
    const tree = [];
    arr.forEach((item) => {
        if (item.parent_id === parentID) {
            count++;
            const newItem = item;
            newItem.index = count;
            const children = createTree(arr, item.id);
            if (children.length > 0) {
                newItem.children = children;
            }
            tree.push(newItem);
        }
    });
    return tree;
}

module.exports.Tree = (arr, parentID = "") => {
    count = 0;
    const tree = createTree(arr, parentID = "");
    return tree;
}
// Kết thúc đệ quy phân cấp danh mục