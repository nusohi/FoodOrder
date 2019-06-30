$(document).ready(function() {
    $(".load-form")
        .find("input")
        .each(function() {
            $(this).addClass("form-control");
        });
    $(".load-form")
        .find("select")
        .each(function() {
            $(this).addClass("form-control");
        });
    $(".load-form")
        .find("label")
        .each(function() {
            $(this).addClass("ml-2");
            $(this).css("font-size", "20px");
            $(this).css("color", "#8a8a8a");
            $(this).css("display", "block");
            var raw = $(this).html();
            $(this).html(ChangeLabel(raw));
        });
});

function ChangeLabel(label) {
    var labels = {
        "Title:": "名字",
        "Name:": "名字",
        "CitizenID:": "身份证号",
        "Gender:": "性别",
        "Born date:": "出生日期",
        "Phone:": "联系方式",
        "Address:": "地址",
        "Price:": "价格",
        "ID:": "编号",
        "Staff:": "员工",
        "Amount:": "数量",
        "Cost time:": "大概耗时",
        "FoodType:": "菜品种类",
        "Username:": "用户名:",
        "Password:": "密码:",
        'Password confirmation:':'再次输入密码:'
    };
    if (labels[label] != undefined) {
        return labels[label];
    }
}
