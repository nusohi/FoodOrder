$(document).ready(function() {
    window.order_id_list = [];
    UpdatePrice();

    // 检查是否有订单
    if($(".list-group").children().length==0){
        $(".list-group").append("<h3>暂无新订单</h3>")
    }
    
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

        bs4pop.confirm(
            "确认批量支付!",
            function(sure) {
                if (sure) {
                    _confirm_order_();
                }
            },
            { title: "" }
        );

        var _confirm_order_ = function() {
            bs4pop.notice("正在批量支付订单！", {
                type: "info"
            });
            
            // 生成订单 List
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

            // 向后端发送订单 List 并处理结果
            $.post("\\order\\checkout", post_data, function(data) {
                data = JSON.parse(data);
                if (data.status == "OK") {
                    bs4pop.notice("支付成功！即将返回主页.");
                    setTimeout(function() {
                        $(location).attr("href", "/manage/");
                    }, 2000);
                } else if (data.status == "NO_PAY") {
                    bs4pop.notice("支付失败！");
                } else if (data.status == "ALREADY_PAY") {
                    bs4pop.notice(
                        "支付失败，可能是部分订单已经支付！请刷新页面！"
                    );
                }
            });
        };
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

// 辅助--倒计时器
function Countdown(time_html_node, func) {
    var delay = parseInt(time_html_node.html());
    var t = setTimeout(function() {
        Countdown(time_html_node, func);
    }, 1000);

    if (delay > 1) {
        delay--;
        time_html_node.html(delay);
    } else {
        time_html_node.html(0);
        clearTimeout(t);
        func();
    }
}
