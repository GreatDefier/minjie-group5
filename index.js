//预定的数据结构
let data = {
    todoArr: [],
    doneArr: []
};

function main() {
    // 存储在 localStorage 的数据可以长期保留，如果用户主动清空浏览器缓存，数据也将清空
    let storage = localStorage.getItem("todo");
    if (storage !== null) {
        //JSON字符串转化JSON对象
        data = JSON.parse(storage);
        // 进行渲染函数的执行
        render(data);
    }
    // 从title获取数据
    let titleInput = document.getElementById("title");
    // 向title添加监听事件，用于处理input框
    titleInput.addEventListener("change", event => {
        let value = event.target.value;
        data.todoArr.push(value);
        render(data);
        // data清空
        event.target.value = "";
    });

    // 获取容器 DOM
    let contentDom = document.getElementById("content");

    // 通过事件代理的方式，监听 input 派发的 change 事件
    contentDom.addEventListener("change", event => {
        let target = event.target;
        // from=>通过字符串创建一个数组
        if (target.dataset.from === "todo" && target.tagName === "INPUT") {
            let index = +target.dataset.index;
            // splice=>向/从 数组中 添加/删除 一个项目
            // 在index定位处删除一个项目
            let value = data.todoArr.splice(index, 1)[0];
            // 压入渲染
            data.doneArr.push(value);
            render(data);
        } else if (target.dataset.from === "done" && target.tagName === "INPUT") {
            // dataset用来访问自定义标签属性
            let index = +target.dataset.index;
            let value = data.doneArr.splice(index, 1)[0];
            // 压入渲染
            data.todoArr.push(value);
            render(data);
        }
    });

    // 通过事件代理的方式，监听 img 派发的 click 事件
    contentDom.addEventListener("click", event => {
        let target = event.target;
        if (target.dataset.from === "todo" && target.tagName === "IMG") {
            let index = +target.dataset.index;
            data.todoArr.splice(index, 1);
            render(data);
        } else if (target.dataset.from === "done" && target.tagName === "IMG") {
            let index = +target.dataset.index;
            data.doneArr.splice(index, 1);
            render(data);
        }
    });
}

let imgSrc = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1592387148820&di=a3f2dbdd0eba0fb7e2db742895ec6aa3&imgtype=0&src=http%3A%2F%2Fbpic.588ku.com%2Felement_origin_min_pic%2F01%2F49%2F24%2F0057445a891e4aa.jpg';

function render(data) {
    localStorage.setItem("todo", JSON.stringify(data)); //JSON对象转化成JSON字符串

    // 先清空内容
    let todoContainer = document.getElementById("todoList");
    todoContainer.innerHTML = "";
    let doneContainer = document.getElementById("doneList");
    doneContainer.innerHTML = "";

    // 以下展示两种循环插入 DOM 的方式

    // 第一种方式是直接拼接 HTML
    let todoArr = data.todoArr;
    let todoHTML = "";
    for (let i = 0; i < todoArr.length; i++) {
        todoHTML += `
        <li>
        <input type="checkbox" data-from="todo" data-index="${i}"></input>
        <span>${todoArr[i]}</span>
        <img src="${imgSrc}" data-from="todo" data-index="${i}"></img>
        </li>`;
    }
    todoContainer.innerHTML = todoHTML;

    // 第二种方式是通过 DOM API
    let doneArr = data.doneArr;
    for (let i = 0; i < doneArr.length; i++) {
        let li = document.createElement("li");
        let input = document.createElement("input");
        input.type = "checkbox";
        input.setAttribute("checked", "");
        input.dataset.index = i;
        input.dataset.from = "done";

        let span = document.createElement("span");
        span.textContent = doneArr[i];

        let img = document.createElement("img");
        img.src = imgSrc;
        img.dataset.index = i;
        img.dataset.from = "done";

        li.appendChild(input);
        li.appendChild(span);
        li.appendChild(img);
        doneContainer.appendChild(li);
    }
}

// 在文档加载完成后会触发 load 事件。此时，HTML中的所有对象都已经在 DOM 树中
window.onload = main;