class CartModel {
    constructor() {
        if(!CartModel.instance) {
            this.items = JSON.parse(localStorage.getItem("currentCart"))
            if (this.items == null) {
                this.items = []
            }
            CartModel.instance = this
        }
        return CartModel.instance
    }

    addItem(item) {
        let existingItem = this.items.find(item1 => item1.code === item.code)
        if (existingItem != null) {
            existingItem.quantity++
        } else {
            item.quantity = 1
            this.items.push(item)
        }
        localStorage.setItem("currentCart", JSON.stringify(this.items))
    }

    removeItem(item) {
        let itemIndex = this.items.findIndex(item1 => item1.code === item.code)
        if (itemIndex !== -1) {
            this.items[itemIndex].quantity--
            if(this.items[itemIndex].quantity < 1) {
                this.items.splice(itemIndex, 1)
            }
        }
        localStorage.setItem("currentCart", JSON.stringify(this.items))
    }

    removeAllItems() {
        this.items.length = 0
        localStorage.removeItem("currentCart")
    }

    isEmpty() {
        return this.items.length <= 0
    }

    getTotal() {
        let total = 0
        this.items.forEach(
            item => total += (item.price * item.quantity)
        )
        return total
    }
}

const instance = new CartModel()
Object.freeze(instance)

export default instance
