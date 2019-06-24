window.order = new Order();

String.prototype["format"] = function() {
    const e = arguments;
    return (
        !!this &&
        this.replace(/\{(\d+)\}/g, function(t, r) {
            return e[r] ? e[r] : t;
        })
    );
};

$(document).ready(function() {
    // 商品种类 Tab 默认第一个
    $("#foodTypeTabContent").ready(function() {
        $("#foodTypeTab .nav-link:first").click();
    });
});

$(document).on("click", ".FoodItem", function() {
    // 添加菜品到订单
    $(".FoodItem")
        .off("click")
        .click(function() {
            var food = $(this).find(".card-body");
            var id = food.attr("foodID");
            var title = food.find(".card-title").html();
            var price = food
                .find(".FoodPrice")
                .html()
                .replace("￥", "");
            window.order.addFood(new Food(id), title, price);
            UpdateOrderPrice();
        });

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
    $(".DeleteItemBtn")
        .off("click")
        .click(function() {
            var item = $(this).parents(".list-group-item");
            var foodID = item.attr("foodID");
            window.order.subFood(foodID);
            item.remove();
            UpdateOrderPrice();
        });
    // 商品数量变动（input）
    $("input.FoodAmount").on("change", function() {
        console.log("change!");
        $(this).attr("value", $(this).val());
        UpdateOrderPrice();
    });

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
