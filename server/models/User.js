const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({ 
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 32
  },
  image: {
    type: String
  },
  store: {
    type: Schema.Types.ObjectId,
    ref: "stores"
  },
  reviews: [{ type: Schema.Types.ObjectId, ref: "reviews"}],
  favoriteProducts: [{ type: Schema.Types.ObjectId, ref: "products" }],
  favoriteStores: [{ type: Schema.Types.ObjectId, ref: "stores" }],
  cartProducts: [{ type: Schema.Types.ObjectId, ref: "products" }],
  created: {
    type: Date,
    default: Date.now
  }
});

UserSchema.statics.addFavoriteProduct = (userId, productId) => {
  const User = mongoose.model('users');
  const Product = mongoose.model('products');

  return Promise.all([User.findById(userId), Product.findById(productId)])
    .then(([user, product]) => {
      user.favoriteProducts.push(product);
      product.favorites.push(user);

      return Promise.all([user.save(), product.save()])
        .then(([user, product]) => product)
    })
}

UserSchema.statics.deleteFavoriteProduct = (userId, productId) => {
  const User = mongoose.model('users');
  const Product = mongoose.model('products');

  return Promise.all([User.findById(userId), Product.findById(productId)])
    .then(([user, product]) => {
      user.favoriteProducts.pull(product);
      product.favorites.pull(user);

      return Promise.all([user.save(), product.save()])
        .then(([user, product]) => product)
    })
}

UserSchema.statics.addFavoriteStore = (userId, storeId) => {
  const User = mongoose.model('users');
  const Store = mongoose.model('stores');

  return Promise.all([User.findById(userId), Store.findById(storeId)])
    .then(([user, store]) => {
      user.favoriteStores.push(store);
      store.favorites.push(user);

      return Promise.all([user.save(), store.save()])
        .then(([user, store]) => store)
    })
}

UserSchema.statics.deleteFavoriteStore = (userId, storeId) => {
  const User = mongoose.model('users');
  const Store = mongoose.model('stores');

  return Promise.all([User.findById(userId), Store.findById(storeId)])
    .then(([user, store]) => {
      user.favoriteStores.pull(store);
      store.favorites.pull(user);

      return Promise.all([user.save(), store.save()])
        .then(([user, store]) => store)
    })
}

UserSchema.statics.addToCart = (userId, productId) => {
  const User = mongoose.model("users");
  const Product = mongoose.model("products");

  return Promise.all([User.findById(userId), Product.findById(productId)])
    .then(([user, product]) => {
      user.cartProducts.push(product);
      product.inCart.push(user);

      return Promise.all([user.save(), product.save()])
        .then(([user, product]) => product)
    })
}

UserSchema.statics.removeFromCart = (userId, productId) => {
  const User = mongoose.model("users");
  const Product = mongoose.model("products");
  
  return Promise.all([User.findById(userId), Product.findById(productId)])
    .then(([user, product]) => {
      user.cartProducts.pull(product);
      product.inCart.pull(user);

      return Promise.all([user.save(), product.save()])
        .then(([user, product]) => product)
    })
}

UserSchema.statics.addImage = (userId, image) => {
  const User = mongoose.model('users');

  return User.findById(userId).then(user => {
    user.image = image;
    return user.save();
  })
}


module.exports = mongoose.model("users", UserSchema);