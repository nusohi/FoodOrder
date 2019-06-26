$(document).ready(function() {
    // 查询更新餐桌状态
    UpdateTableStatus();
    var update_table_status = setInterval(UpdateTableStatus, 30 * 1000);
});

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
        bs4pop.notice("已刷新餐桌负责状态表！")
    });
}
