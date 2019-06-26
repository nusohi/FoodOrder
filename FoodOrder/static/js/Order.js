// 数组 remove
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

class Order {
    constructor() {
        this.foodList = new Array();
    }

    addFood = function(food, title, price) {
        // 检查如果已经存在 则增加数量
        var index = this.indexOfFood(food.id);
        if (index != null) {
            this.addFoodAmount(food.id);
            return;
        }

        // 新增商品
        food.amount = 1;
        this.foodList.push(food);

        var html = '<li class="OrderItem list-group-item" foodID={0} price={3}>\
                <div class="row">\
                    <div class="col-5"><span class=align-middle">{1}</span></div>\
                    <div hidden class="foodPrice">{2}</div>\
                    <div class="input-group input-group-sm col-4">\
                        <div class="input-group-prepend"><button class="btn SubFood input-group-text" type="button">-</button></div>\
                        <input type="text" class="FoodAmount form-control text-center" value="1"style="max-width: 50px;">\
                        <div class="input-group-append"><button class="btn AddFood input-group-text" type="button">+</button></div>\
                    </div>\
                    <div class="col-2 p-0"><span class="totalPrice aligin-middle" style="line-height:30px">{3}</span></div>\
                    <div class="col-1 p-0"><button class="btn btn-sm p-1 btn-block DeleteItemBtn">删</button></div>\
                </div>\
            </li>'.format(
            food.id,
            title,
            1,
            price
        );

        $("#OrderList").append(html);
    };
    subFood = function(foodID) {
        this.foodList.remove(this.getFood(foodID));
    };

    addFoodAmount = function(foodID) {
        var item = $("#OrderList").find("li[foodID={0}]".format(foodID));
        var input = item.find("div.row").find(".input-group .FoodAmount");

        if (input.val() == "") {
            input.val(1);
        } else if (parseInt(input.val()) >= 99) {
            input.val(99);
        } else {
            input.val(parseInt(input.val()) + 1);
        }
        input.attr("value", input.val());
        this.foodList[this.indexOfFood(foodID)].amount = parseInt(input.val());
    };
    subFoodAmount = function(foodID) {
        var item = $("#OrderList").find("li[foodID={0}]".format(foodID));
        var input = item.find("div.row").find(".input-group .FoodAmount");

        var amount = parseInt(input.val());
        if (input.val() == "" || amount <= 1) {
            input.val(1);
        } else if (amount <= 99) {
            input.val(amount - 1);
        } else if (amount >= 99) {
            input.val(99);
        }
        input.attr("value", input.val());
        this.foodList[this.indexOfFood(foodID)].amount = parseInt(input.val());
    };
    updateFoodAmount = function(foodID) {
        var item = $("#OrderList").find("li[foodID={0}]".format(foodID));
        var input = item.find("div.row").find(".input-group .FoodAmount");

        var amount = parseInt(input.val());
        if (input.val() == "" || amount <= 1) {
            input.val(1);
        } else if (amount > 99) {
            input.val(99);
        }

        input.attr("value", input.val());
        this.foodList[this.indexOfFood(foodID)].amount = parseInt(input.val());
    };

    indexOfFood = function(foodID) {
        for (var i = 0; i < this.foodList.length; i++) {
            if (this.foodList[i].id == foodID) {
                return i;
            }
        }
        return null;
    };

    getFood = function(foodID) {
        for (var i = 0; i < this.foodList.length; i++) {
            if (this.foodList[i].id == foodID) {
                return this.foodList[i];
            }
        }
        return null;
    };
}

class Food {
    constructor(id, amount = null) {
        this.id = id;
        this.amount = amount;
    }
}
