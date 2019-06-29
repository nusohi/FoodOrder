$(document).ready(function() {
    var order_id = parseInt($("#order").attr("order_id"));
    window.order_id = order_id;
});

$("#check-out-btn")
    .off("click")
    .click(function() {
        console.log("尝试支付订单!");
        order_list = JSON.stringify([{
            order_id: window.order_id,
            is_pay: true
        }]);
        post_data = {
            order_list: order_list
        };
        
        if(window.confirm("确认已支付！")){
            $.post("\\order\\checkout", post_data, function(data) {
                data = JSON.parse(data);
                if (data.status == "OK") {
                    window.alert("支付成功！点击确定返回主页.");
                    $(location).attr("href", "/");
                    console.log("支付成功！");
                } else if (data.status == "NO_PAY") {
                    console.log("支付失败，is_pay无效.");
                } else if (data.status == "ALREADY_PAY") {
                    console.log("支付失败，已经支付！");
                }
            });
        }
    });
