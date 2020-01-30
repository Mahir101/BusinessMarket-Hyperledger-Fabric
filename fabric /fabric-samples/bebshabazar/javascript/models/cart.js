module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function(item, id) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = {item: item, qty: 0, Price: 0};
        }
        storedItem.qty++;
        storedItem.Price = storedItem.item.Record.Price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.Record.Price;
    };
    

    this.reduceByOne = function(id) {
        this.items[id].qty--;
        this.items[id].Price -= this.items[id].item.Record.Price;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.Record.Price;

        if (this.items[id].qty <= 0) {
            delete this.items[id];
        }
    };
    this.increaseByOne = function(id) {
        this.items[id].qty++;
        this.items[id].Price += this.items[id].item.Record.Price;
        this.totalQty++;
        this.totalPrice += this.items[id].item.Record.Price;
    };

    this.removeItem = function(id) {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].Price;
        delete this.items[id];
    };
    
    this.generateArray = function() {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};