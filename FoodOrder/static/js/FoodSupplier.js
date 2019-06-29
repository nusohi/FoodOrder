$(document).ready(function() {
    UpdateOrders();
    // var update_orders = setInterval(UpdateOrders, 10 * 1000);
});

function UpdateOrders() {
    $("#orders").empty();
    $.post("/manage/serving_order_item_list", function(data) {
        var orders = JSON.parse(data);
        orders.forEach(order => {
            node = '\
            <div class="row mx-4 order-item-row" order_id={0} food_id={1}>\
                <div class="col">{0}</div>\
                <div class="col">{1}</div>\
                <div class="col">{2}</div>\
                <div class="col">{3}</div>\
                <div class="col">{4}</div>\
                <div class="col btn-group">\
                    <button type="button" class="btn btn-primary take-order {5}">接单</button>\
                    <button type="button" class="btn btn-primary delive-food {6}">上菜</button>\
                </div>\
            </div><hr>'.format(
                order.order_id,
                order.food_id,
                order.food_name,
                order.food_amount,
                get_food_status_text(order.status),
                order.status != 0 ? "disabled" : "",
                order.status != 1 ? "disabled" : ""
            );
            $("#orders").append(node);
            BIND(); // 重新绑定
        });
    });
}

function BIND() {
    $(".take-order")
        .off("click")
        .click(function() {
            if (!$(this).hasClass("disabled")) {
                var order_item = $(this).parents(".order-item-row");
                order_id = order_item.attr("order_id");
                food_id = order_item.attr("food_id");
                // 接单 post
                $.post(
                    "/manage/cook",
                    (post_data = {
                        OP: "take_order",
                        order_id: order_id,
                        food_id: food_id
                    })
                );
                // 切换按钮状态
                $(this).addClass("disabled");
                $(this)
                    .next()
                    .removeClass("disabled");
            } else {
            }
        });
    $(".delive-food")
        .off("click")
        .click(function() {
            if (!$(this).hasClass("disabled")) {
                var order_item = $(this).parents(".order-item-row");
                order_id = order_item.attr("order_id");
                food_id = order_item.attr("food_id");
                // 接单 post
                $.post(
                    "/manage/cook",
                    (post_data = {
                        OP: "delive_food",
                        order_id: order_id,
                        food_id: food_id
                    })
                );
                // 切换按钮状态
                $(this).addClass("disabled");
            } else {
            }
        });
}

function get_food_status_text(status) {
    var status_text = ["等待后厨接单", "后厨已接单", "等待上菜", "上菜完成"];
    return status_text[status];
}

String.prototype["format"] = function() {
    const e = arguments;
    return (
        !!this &&
        this.replace(/\{(\d+)\}/g, function(t, r) {
            return e[r] ? e[r] : t;
        })
    );
};
