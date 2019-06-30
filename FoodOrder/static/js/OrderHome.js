$(function() {
    window.order = new Order();

    // 桌号读取、写入与显示
    if ($.cookie("cookie_table") == undefined) {
        window.table = 0;
        $.cookie("cookie_table", window.table);
    } else {
        window.table = $.cookie("cookie_table");
    }
    $("#tableID").html(window.table);
});

String.prototype["format"] = function() {
    const e = arguments;
    return (
        !!this &&
        this.replace(/\{(\d+)\}/g, function(t, r) {
            return e[r] ? e[r] : t;
        })
    );
};

// 订单价格刷新
UpdateOrderPrice = function() {
    var orderPrice = 0;
    $(".OrderItem").each(function() {
        var amount = parseInt(
            $(this)
                .find("input.FoodAmount")
                .val()
        );
        var price = $(this).attr("price");
        $(this)
            .find("span.totalPrice")
            .html((amount * price).toFixed(2));
        orderPrice += amount * price;
    });
    $("#orderPrice").html("￥ " + orderPrice.toFixed(2));
};

$(document).ready(function() {
    // 商品种类 Tab 默认第一个
    $("#foodTypeTabContent").ready(function() {
        $("#foodTypeTab .nav-link:first").click();
    });

    // 桌号选择表 显示与隐藏
    $("#table-option")
        .off("click")
        .click(function(event) {
            event.stopPropagation(); // 消除冒泡现象
            var sheet = $("#table-option-sheet");
            if ($("#table-option-sheet").css("display") == "none") {
                sheet.show(250);
            } else {
                sheet.hide(300);
            }
        });
    // 点击空白处隐藏 桌号选择表
    $(document).click(function(event) {
        var _con = $("#table-option-sheet"); // 设置目标区域
        if (!_con.is(event.target) && _con.has(event.target).length === 0) {
            $("#table-option-sheet").hide(300); //淡出消失
        }
    });

    // 桌号选择与更改
    $(".room-opt-btn").click(function() {
        var to_table_id = parseInt($(this).html());
        // 记录并存储桌号到 cookie
        window.table = to_table_id;
        $.cookie("cookie_table", window.table);

        $("#tableID").html(window.table);
        $("#table-option-sheet").hide(200);

        bs4pop.notice("已更改桌号为：{0}".format(window.table), {
            type: "warning"
        });
    });
});

$(document).on("click", ".nav-link", function() {
    // 添加菜品到订单
    $(".FoodItem")
        .off("click")
        .click(function() {
            var food = $(this).find(".card-body");
            var id = parseInt(food.attr("foodID"));
            var title = food.find(".card-title").html();
            var price = food
                .find(".FoodPrice")
                .html()
                .replace("￥", "");
            window.order.addFood(new Food(id), title, price);
            UpdateOrderPrice();
        });

    // 订单提交
    $("#OrderSubmit")
        .off("click")
        .click(function() {
            if (window.order.foodList.length == 0) {
                bs4pop.notice("请选择菜品！", { type: "danger" });
                return;
            } else if (window.table == 0) {
                bs4pop.notice("请选择桌号！", { type: "danger" });
                return;
            }

            // 数量检查
            var len = window.order.foodList.length;
            for (var i = 0; i < len; i++) {
                left_amount = parseInt(
                    $(".card-body[foodid={0}]".format(
                            window.order.foodList[i].id
                        )
                    ).find(".FoodAmount").html()
                );
                console.log(left_amount)
                console.log(window.order.foodList[i].amount)
                if (left_amount < window.order.foodList[i].amount) {
                    bs4pop.notice("余量不足！", { type: "danger" });
                    return;
                }
            }

            bs4pop.confirm(
                "请确认桌号为 {0} !".format(window.table),
                function(sure) {
                    if (!sure) {
                        return;
                    }
                    var post_data = {
                        foodList: JSON.stringify(window.order.foodList),
                        table: window.table
                    };

                    $.post("\\order\\", post_data, function(data) {
                        // 加载新的页面 (订单页) url: /order/q{order_id}
                        data = JSON.parse(data);
                        order_id = data["order_id"];
                        $(location).attr(
                            "href",
                            "/order/q{0}".format(order_id)
                        );
                    });
                },
                {
                    title: "确认订单"
                }
            );
        });
});

$(document).on("click", ".FoodItem", function() {
    // 商品添加数量
    $(".AddFood")
        .off("click")
        .click(function() {
            console.log(this);
            var item = $(this).parents(".list-group-item");
            var foodID = item.attr("foodID");
            window.order.addFoodAmount(foodID);
            UpdateOrderPrice();
        });

    // 商品减少数量
    $(".SubFood")
        .off("click")
        .click(function() {
            var item = $(this).parents(".list-group-item");
            var foodID = item.attr("foodID");
            window.order.subFoodAmount(foodID);
            UpdateOrderPrice();
        });

    // 绑定删除商品按钮
    $(".DeleteItemBtn").click(function() {
        var item = $(this).parents(".list-group-item");
        var foodID = item.attr("foodID");
        window.order.subFood(foodID);
        item.remove();
        UpdateOrderPrice();
    });

    // 商品数量变动（input）
    $("input.FoodAmount").on("change", function() {
        $(this).attr("value", $(this).val());
        // 保证输入值规范（1-99），保证订单信息及时更新
        var foodID = parseInt(
            $(this)
                .parents(".OrderItem")
                .attr("foodid")
        );
        window.order.updateFoodAmount(foodID);
        UpdateOrderPrice();
    });

    // 限制数量输入 暂仅限制输入为数字
    $(".FoodAmount")
        .keyup(function() {
            $(this).val(
                $(this)
                    .val()
                    .replace(/[^0-9]/g, "")
            );
        })
        .bind("paste", function() {
            // CTR+V事件处理
            $(this).val(
                $(this)
                    .val()
                    .replace(/[^0-9]/g, "")
            );
        })
        .css("ime-mode", "disabled"); // CSS设置输入法不可用
});
