String.prototype["format"] = function() {
    const e = arguments;
    return (
        !!this &&
        this.replace(/\{(\d+)\}/g, function(t, r) {
            return e[r] ? e[r] : t;
        })
    );
};

$(document).on("click", ".FoodItem", function() {
    // 添加菜品到订单
    $(".FoodItem")
        .off("click")
        .click(function() {
            var food = $(this).find(".card-body");
            var title = food.find(".card-title").html();
            var price = food.find(".FoodPrice").html();
            console.log(title);

            var html = '<li class="list-group-item">\
                    <div class="row">\
                        <div class="col-5"><span class=align-middle">{0}</span></div>\
                        <div hidden class="foodPrice">{1}</div>\
                        <div class="input-group input-group-sm col-4">\
                            <div class="input-group-prepend">\
                                <button class="btn SubFood input-group-text" type="button">-</button>\
                            </div>\
                            <input type="text" class="FoodAmount form-control text-center" value="1"\
                                style="max-width: 50px;">\
                            <div class="input-group-append">\
                                <button class="btn AddFood input-group-text" type="button">+</button>\
                            </div>\
                        </div>\
                        <div class="col-2 p-0"><span class="aligin-middle"\
                                style="line-height:30px">{2}</span></div>\
                        <div class="col-1 p-0"><button class="DeleteItemBtn btn btn-sm p-1">删</button></div>\
                    </div>\
                </li>'.format(
                title,
                1,
                price
            );

            $("#OrderList").append(html);
        });

    // 商品添加数量
    $(".AddFood")
        .off("click")
        .click(function() {
            var input = $(this)
                .parent()
                .parent()
                .find("input");
            if (input.val() == "") {
                input.val(1);
                return;
            } else if (parseInt(input.val()) >= 99) {
                input.val(99);
                return;
            }
            input.val(parseInt(input.val()) + 1);
        });

    // 商品减少数量
    $(".SubFood")
        .off("click")
        .click(function() {
            var input = $(this)
                .parent()
                .parent()
                .find("input");
            if (parseInt(input.val()) <= 1 || input.val() == "") {
                input.val(1);
                return;
            }
            input.val(parseInt(input.val()) - 1);
            if (parseInt(input.val()) >= 99) {
                input.val(99);
                return;
            }
        });

    // 绑定删除商品按钮
    $(".DeleteItemBtn")
        .off("click")
        .click(function() {
            var item = $(this)
                .parent()
                .parent()
                .parent();
            item.remove();
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
