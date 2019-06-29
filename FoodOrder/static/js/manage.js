$(document).ready(function() {
    UpdateTableStatus(); // 查询更新餐桌状态
    UpdateOrderItemInfo(); // 查询更新上菜信息
    // UpdateFoodServeStatus();
    var update_table_status = setInterval(UpdateTableStatus, 30 * 1000);
    var update_order_item_status = setInterval(UpdateOrderItemInfo, 10 * 1000);
    // var update_food_serve_status = setInterval(UpdateFoodServeStatus, 7777);
});

// 解决 table 选项卡切换问题（保证只有一个 table active）
$("#table-info-table tr[table_id]")
    .off("click")
    .click(function() {
        table_id = $(this).attr("table_id");
        $("#table-info-table tr[table_id!=" + table_id + "]").each(function() {
            $(this).removeClass("active");
        });
    });

// 更新餐桌负责状态表
function UpdateTableStatus() {
    $.post("/manage/serving_table_list", function(data) {
        // 先清理所有状态
        $("#table-info-table tr").each(function() {
            $(this).removeClass("serving");
            $(this)
                .find("td:last")
                .html("");
        });

        // 再添加状态显示
        servingTableList = JSON.parse(data)["servingTableList"];
        servingTableList.forEach(table_id => {
            var table = $("#table-info-table tr[table_id=" + table_id + "]");
            if (!table.hasClass("serving")) {
                table.addClass("serving");
                table.find("td:last").html("服务中");
            }
        });

        // 提示信息
        bs4pop.notice("已刷新餐桌负责状态表！",{position: 'bottomright'});
    });
}

// 更新 table-detail 中的 food 信息 List
function UpdateOrderItemInfo() {
    // 清除所有 order-item
    $(".table-detail").each(function() {
        $(this)
            .find(".order-item-table")
            .empty();
    });
    // 获取最新的 order item list
    $.post("/manage/serving_order_item_list", function(data) {
        item_list = JSON.parse(data);

        item_list.forEach(food => {
            var paras =
                " order_id=" + food.order_id + " food_id=" + food.food_id;
            node =
                '<div class="row food-item" status=' +
                food.status +
                paras +
                '>\
                    <div class="col">' +
                food.order_id +
                '</div>\
                    <div class="col">' +
                food.food_name +
                '</div>\
                    <div class="col">' +
                food.food_amount +
                '</div>\
                    <div class="col-3">' +
                get_food_status_text(food.status) +
                "</div>\
                    <div class='col-2 p-0'><button class='btn delive-food-btn btn-block btn-danger disabled'>上菜</button></div>\
                </div>";
            console.log(node);
            $("#table-" + food.table_id + "-content .order-item-table").append(
                node
            );
        });

        UpdateFoodServeStatus();
        // 提示信息
        bs4pop.notice("已刷新上菜信息！",{position: 'bottomright'});
    });
}

// 上菜提醒显示 状态为
function UpdateFoodServeStatus() {
    $(".table-detail").each(function() {
        var table_id = $(this).attr("table_id");
        $(this)
            .find(".food-item")
            .each(function() {
                var status = parseInt($(this).attr("status"));
                // 等待上菜
                if (status == 2) {
                    $(this).addClass("waiting");
                    $("#table-" + table_id).addClass("waiting");
                    $("#table-" + table_id + " td:last").html("等待上菜");
                    $(this)
                        .find("button")
                        .removeClass("disabled");
                } else {
                    $(this).removeClass("waiting");
                    $("#table-" + table_id).removeClass("waiting");
                    $("#table-" + table_id + " td:last").html("服务中");
                    $(this)
                        .find("button")
                        .addClass("disabled");
                }
            });
    });
    bind_delive_food_btn();
}

// 切换餐桌负责员工
$(".staff-opt-btn")
    .off("click")
    .click(function() {
        table_id = $(this)
            .parents(".table-detail")
            .attr("table_id");
        staff_id = $(this).attr("staff_id");
        staff_name = $(this).html();
        var same = $("#staff-name-in-table-" + table_id).html() == staff_name;
        if (same) {
            bs4pop.notice("无效！");
            return;
        }

        // 提交到后端
        $.post(
            "/manage/staff_charge_table",
            (post_data = {
                table_id: table_id,
                staff_id: staff_id
            }),
            function(data) {
                data = JSON.parse(data);
                if (data.status == "OK") {
                    bs4pop.notice("成功修改餐桌负责人！");
                    $("#staff-name-in-table-" + table_id).html(staff_name);
                } else {
                    bs4pop.notice("操作失败！");
                }
            }
        );
    });

// 上菜
var bind_delive_food_btn = function() {
    $(".delive-food-btn")
        .off("click")
        .click(function() {
            if ($(this).hasClass("disabled")) {
                bs4pop.notice("已上过此菜！");
                return;
            }

            var food_item = $(this).parents(".food-item");
            order_id = food_item.attr("order_id");
            food_id = food_item.attr("food_id");

            $.post(
                "/manage/delive_food",
                (post_data = {
                    order_id: order_id,
                    food_id: food_id
                }),
                function(data) {
                    data = JSON.parse(data);
                    if (data.status == "OK") {
                        bs4pop.notice("上菜成功！");
                    } else {
                        bs4pop.notice("操作失败！");
                    }
                }
            );
        });
};




function get_food_status_text(status) {
    var status_text = ["等待后厨接单", "后厨已接单", "等待上菜", "上菜完成"];
    return status_text[status];
}
