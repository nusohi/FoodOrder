$(document).ready(function() {
    window.order_id_list = [];
    UpdatePrice();
});

$(".order-check-box")
    .off("click")
    .click(function() {
        var order = $(this).next();
        var order_id = order.attr("order_id");

        if ($(this).hasClass("check")) {
            $(this)
                .next()
                .removeClass("check-order-green");
            $(this).removeClass("check");
            window.order_id_list.pop(order_id);
        } else {
            $(this).addClass("check");
            $(this)
                .next()
                .addClass("check-order-green");
            window.order_id_list.push(order_id);
        }
        UpdatePrice();
    });

// 批量支付按钮
$("#OrderSubmit")
    .off("click")
    .click(function() {
        if (window.order_id_list.length == 0) {
            bs4pop.notice("请点击需要批量支付的订单前面的方框！", {
                type: "warning"
            });
            return;
        }

        bs4pop.notice("正在批量支付订单", {
            type: "info"
        });

        order_data_list = [];
        window.order_id_list.forEach(order_id => {
            order_data_list.push({
                order_id: order_id,
                is_pay: true
            });
        });

        order_data_list = JSON.stringify(order_data_list);
        post_data = {
            order_list: order_data_list
        };
        console.log(post_data);

        $.post("\\order\\checkout", post_data, function(data) {
            data = JSON.parse(data);
            if (data.status == "OK") {
                window.alert("支付成功！点击确定返回主页.");
                $(location).attr("href", "/");
                console.log("支付成功！");
            } else if (data.status == "NO_PAY") {
                console.log("支付失败，is_pay无效.");
            } else if (data.status == "ALREADY_PAY") {
                bs4pop.notice("支付失败，可能是部分订单已经支付！请刷新页面！");
            }
        });
    });

// 更新价格 与 支付按钮状态
UpdatePrice = function() {
    total_price = 0;
    window.order_id_list.forEach(order_id => {
        var order_price = parseFloat(
            $(".order[order_id=" + order_id + "]").attr("order_price")
        );
        total_price += order_price;
    });
    $("#total_price").html(total_price);
    // 控制批量支付按钮的 disabled 状态
    if (total_price == 0) {
        if (!$("#OrderSubmit").hasClass("disabled")) {
            $("#OrderSubmit").addClass("disabled");
        }
    } else {
        if ($("#OrderSubmit").hasClass("disabled")) {
            $("#OrderSubmit").removeClass("disabled");
        }
    }
};
