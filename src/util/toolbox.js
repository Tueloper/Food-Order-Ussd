/* eslint-disable eqeqeq */
/* eslint-disable valid-jsdoc */
/* eslint-disable linebreak-style */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import joi from '@hapi/joi';
import env from '../config/env';
import ApiError from './apiError';
import validationData from '../validations/validationData';

const { SECRET, PORT } = env;
const { paystackBankNamesAndCodes } = validationData;
/**
 * function objectfor api tools methods
 *
 * @function Toolbox
 */
const Toolbox = {
  /**
   * Synchronously sign the given payload into a JSON Web Token string.
   * @function
   * @param {string | number | Buffer | object} payload Payload to sign.
   * @param {string | number} expiresIn Expressed in seconds or a string describing a
   * time span. Eg: 60, "2 days", "10h", "7d". Default specified is 1day.
   * @returns {string} JWT token.
   * @memberof Toolbox
   */
  createToken(payload, expiresIn = '1d') {
    return jwt.sign(payload, SECRET, { expiresIn });
  },

  /**
   * Synchronously sign the given payload into a JSON Web Token string that never expires.
   * @function
   * @param {string | number | Buffer | object} payload Payload to sign.
   * @returns {string} JWT token.
   * @memberof Toolbox
   */
  createEternalToken(payload) {
    return jwt.sign(payload, SECRET);
  },

  /**
   * Synchronously verify the given JWT token using a secret
   * @function
   * @param {*} token - JWT token.
   * @returns {string | number | Buffer | object } - Decoded JWT payload if
   * token is valid or an error message if otherwise.
   * @memberof Toolbox
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, SECRET);
    } catch (err) {
      throw new ApiError(400, 'Invalid Token');
    }
  },

  /**
   * Hashes a password
   * @function
   * @param {string} password - Password to encrypt.
   * @returns {string} - Encrypted password.
   * @memberof Toolbox
   */
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  },

  /**
   * Compares a password with a given hash
   * @function
   * @param {string} password - Plain text password.
   * @param {string} hash - Encrypted password.
   * @returns {boolean} - returns true if there is a match and false otherwise.
   * @memberof Toolbox
   */
  comparePassword(password, hash) {
    return bcrypt.compareSync(password, hash);
  },

  /**
   * Generates a JSON response for success scenarios.
   * @function
   * @param {Response} res - Response object.
   * @param {object} data - The payload.
   * @param {number} code -  HTTP Status code.
   * @returns {JSON} - A JSON success response.
   * @memberof Toolbox
   */
  successResponse(res, data, code = 200) {
    return res.status(code).json({
      status: 'success',
      data
    });
  },

  /**
   * Generates a JSON response for failure scenarios.
   * @function
   * @param {Response} res - Response object.
   * @param {object} options - The payload.
   * @param {number} options.code -  HTTP Status code, default is 500.
   * @param {string} options.message -  Error message.
   * @param {object|array  } options.errors -  A collection of  error message.
   * @returns {JSON} - A JSON failure response.
   * @memberof Toolbox
   */
  errorResponse(res, { code = 500, message = 'Some error occurred while processing your Request', errors }) {
    return res.status(code).json({
      status: 'fail',
      error: {
        message,
        errors
      }
    });
  },

  /**
   * Generates email verification link
   * @function
   * @param { Request } req - Request object
   * @param { string } id - User's unique ID.
   * @param { string } email - User's email.
   * @returns {URL} - Verification link.
   * @memberof Toolbox
   */
  createVerificationLink(req, { id, email }) {
    const token = Toolbox.createToken({ id, email });
    const host = req.hostname === 'localhost' ? `${req.hostname}:${PORT}` : req.hostname;
    return `${req.protocol}://${host}/v1.0/api/auth/verify?token=${token}`;
  },

  /**
   * Generates email password reset link
   * @function
   * @param {*} req
   * @param {*} id
   * @param {*} email
   * @returns {URL} - password reset link
   * @memberof Toolbox
   */
  createPasswordResetLink(req, {
    id, email, verified, roleId
  }) {
    const token = Toolbox.createToken({
      id, email, verified, roleId
    }, '5h');
    return `${req.protocol}://${req.get('host')}/v1.0/api/auth/reset-password/email?token=${token}`;
  },

  /**
   * Validates a value using the given Joi schema
   * @function
   * @param {object} value
   * @param {Joi.SchemaLike} schema
   * @returns {Promise} Validation result
   * @memberof Toolbox
   */
  validate(value, schema) {
    return joi.validate(value, schema, { abortEarly: false, allowUnknown: true });
  },

  /**
   * Checks token from request header for user authentication
   * @function
   * @param {object} req - The request from the endpoint
   * @returns {Token} Token
   * @memberof Toolbox
   */
  checkToken(req) {
    const {
      headers: { authorization },
      cookies: { token: cookieToken }
    } = req;
    let bearerToken = null;
    if (authorization) {
      bearerToken = authorization.split(' ')[1]
        ? authorization.split(' ')[1] : authorization;
    }
    return cookieToken || bearerToken || req.headers['x-access-token'] || req.headers.token || req.body.token;
  },

  /**
   * Extracts Array Records from sequelize object.
   * @function
   * @param {array} dataArray - An array of unformatted records.
   * @returns { array } - An array containing formatted records.
   * @memberof Toolbox
   */
  extractArrayRecords(dataArray) {
    return dataArray.map(({ dataValues }) => dataValues);
  },

  /**
   * Adds new properties to the items of a collection.
   * @async
   * @param {array} collection - An array of objects.
   * @param {object} options - An object with properties to be added to the items of a collection.
   * @returns {Promise<Array>} A promise object with an updated collection.
   * @memberof Toolbox
   */
  async updateCollection(collection, options) {
    return collection.map((item) => {
      const newItem = { ...item, ...options };
      return newItem;
    });
  },

  /**
   * match id input array with equivalent item ids in database.
   * @function
   * @param {array} items - item array with ids
   * @param {array} databaseItems = databaese items array with equivalent values
   * @returns {boolean} true if all input items match items in database, false if not
   * @memberof Toolbox
   */
  matchIds(items, databaseItems) {
    let allItemsMatch = true;
    items.forEach((id) => {
      const match = databaseItems.find((databaseValue) => databaseValue.id === id);
      if (match === undefined) allItemsMatch = false;
    });
    return allItemsMatch;
  },

  /**
   * Calculates the total price of bulk products
   * @static
   * @param {array} cartProducts - An array of objects containing product details
   * i.e. [{productId:1, quantity:2}].
   * @param {array} databaseProducts - An array of objects. It contains the details of the products
   * queried from the database.
   * @returns {number} total price
   * @memberof Toolbox
   */
  totalPrice(cartProducts, databaseProducts) {
    return databaseProducts.map((databaseProduct) => {
      // get the quantity of the product ordered
      const product = cartProducts.find(
        (bulkProduct) => bulkProduct.productId === databaseProduct.id
      );
      // multiply by the price to get the price for the product
      return databaseProduct.price * product.quantity;
    })
      // sum all price to get total price and return value.
      .reduce((accumulator, current) => accumulator + current);
  },

  /**
   * Calculates the order price of products
   * @static
   * @param {array} cart - An array of objects containing cart details
   * @param {array} productsInOrder - An array of objects. It contains the details of the
   * products in a order.
   * @param {integer} ids - An array of productIds.
   * @returns {number} order price
   * @memberof Toolbox
   */
  calculateOrderPrice(carts, productsInOrder, ids) {
    let result = 0;
    ids.forEach((id) => {
      productsInOrder.forEach((item) => {
        if (id === item.products.id) {
          carts.forEach((cart) => {
            if (item.products.id === cart.productId) {
              result += (cart.quantity * item.products.price);
            }
          });
        }
      });
    });
    return result;
  },

  /**
   * Calculates the order price of products
   * @static
   * @param {array} cart - An array of objects containing cart details
   * @param {array} ids - An array of productIds.
   * @param {integer} supplierId - An array of productIds.
   * @returns {number} order price
   * @memberof Toolbox
   */
  getOrderCart(carts, ids, supplierId) {
    const result = [];
    carts.forEach((item) => {
      ids.forEach((id) => {
        if (item.productId === id) {
          return result.push({
            supplierId,
            productId: item.productId,
            quantity: item.quantity,
            note: item.note,
          });
        }
      });
    });
    return result;
  },

  /**
   * get product order payload
   * @static
   * @param {array} orderSupplierId - An array of objects containing cart details
   * @param {array} cartPayload - An array of objects. It contains the details of the
   * cart in a order.
   * @returns {Array} productOrderDetails
   * @memberof Toolbox
   */
  getProductOrderPayload(orderSupplierId, cartPayload) {
    const result = [];
    orderSupplierId.forEach((item) => {
      cartPayload.forEach((cart) => {
        if (item.supplierId === cart.supplierId) {
          return result.push({
            orderId: item.id,
            productId: cart.productId,
            quantity: cart.quantity,
            note: cart.note,
          });
        }
      });
    });
    return result;
  },

  /**
   * get supplier order payload
   * @static
   * @param {array} supplierProducts - An array of objects. It contains the details of the
   * products in a order.
   * @param {integer} orderSupplierId - An array of productIds and supplierid
   * @returns {array} supplier order payload
   * @memberof Toolbox
   */
  getSupplierOrderPayload(supplierProducts, orderSupplierId) {
    const result = [];
    supplierProducts.forEach((item) => {
      orderSupplierId.forEach((order) => {
        if (item.supplierId === order.supplierId) {
          result.push({
            orderSupplierId: order.supplierId,
            productIds: item.productIds,
            orderId: order.id
          });
        }
      });
    });
    return result;
  },

  /**
   * get total items
   * @static
   * @param {array} cartProducts - An array of objects containing product details
   * i.e. [{productId:1, quantity:2}].
   * @param {array} databaseProducts - An array of objects. It contains the details of the products
   * queried from the database.
   * @returns {number} total price
   * @memberof Toolbox
   */
  totalItems(cartProducts, databaseProducts) {
    return databaseProducts.map((databaseProduct) => {
      // get the quantity of the product ordered
      const product = cartProducts.find(
        (bulkProduct) => bulkProduct.productId === databaseProduct.id
      );
      return product.quantity;
    })
      // sum all quantity to get total quantity and return value.
      .reduce((accumulator, current) => accumulator + current);
  },

  /**
   * Checks if the carts are available for purchase
   * @static
   * @param {array} cartProducts - An array of objects containing product details
   * i.e. [{productId:1, quantity:2}].
   * @param {array} databaseProducts - An array of objects. It contains the details of the products
   * queried from the database.
   * @returns {array} errors
   * @memberof Toolbox
   */
  checkProducts(cartProducts, databaseProducts) {
    const errors = [];
    databaseProducts.forEach((databaseProduct) => {
      // get the quantity of the product ordered
      const product = cartProducts.find(
        (bulkProduct) => bulkProduct.productId === databaseProduct.id
      );
      // check if demanded quantity is available
      if (databaseProduct.stockQuantity < product.quantity) return errors.push(`Sorry!, We don't have enough ${databaseProduct.name}, only ${databaseProduct.stockQuantity} left in stock`);
    });

    return errors;
  },

  /**
   * gets a bank code from bank validation array
   * @static
   * @param {string} bankName - A name of a bank accepted by paystack
   *  @param {string} currency - A name of a bank accepted by paystack
   * @returns {string} paystack bank code
   * @memberof Toolbox
   */
  getBankCode(bankName) {
    const code = paystackBankNamesAndCodes.find(

      (paystackBank) => paystackBank.bankName === bankName
    ).bankCode;
    return code;
  },

  /**
   * gets an array of supplierId and productIds
   * @static
   * @param {object} productsInOrder - products in Order
   * @returns {array} array
   * @memberof Toolbox
   */
  async createSupplierOrderPayload(productsInOrder) {
    const result = [];
    const productSupplier = productsInOrder.map((item) => ({
      supplierId: item.products.supplierId,
      productId: item.products.id
    }));
    const supplierIds = [...new Set(productSupplier.map((item) => item.supplierId))];
    supplierIds.forEach((item) => {
      let foo = productSupplier.filter((value) => value.supplierId === item);
      foo = [...new Set(foo.map((product) => product.productId))];
      result.push({ supplierId: item, productIds: foo });
    });
    return { result, supplierIds };
  },

  /**
   * gets an array of supplierId, emails, productIds, CompanyName
   * @static
   * @param {object} suppliersWithProductIds - suppliers in order with ther products
   * @param {object} suppliersInDatabase - suppliers in database
   * @param {object} productsInOrder - products in order
   * @returns {array} array
   * @memberof Toolbox
   */
  async getEmailandSupplierDetails(suppliersWithProductIds, suppliersInDatabase, productsInOrder) {
    let updateData = suppliersWithProductIds;
    updateData = [...updateData];
    await updateData.forEach((item) => {
      suppliersInDatabase.forEach((user) => {
        if (user.id === item.supplierId) {
          const productName = [];
          productsInOrder.forEach((product) => {
            if (product.products.supplierId === item.supplierId) {
              productName.push(product.products.name);
              item.supplierId = product.products.supplierId;
              item.companyName = user.companyName;
              item.email = user.email;
              item.productName = productName;
            }
          });
        }
      });
    });
    return updateData;
  },

  /**
   * gets an array to be sent to notify suppliers of deleted category
   * @static
   * @param {object} productsInDatabase - Product array
   * @returns {array} array
   * @memberof Toolbox
   */
  async checkSupplier(productsInDatabase) {
    const result = [];
    const payload = productsInDatabase.map((item) => ({
      name: item.name,
      category: item.categories[0].name,
      supplierDetails: item.supplier
    }));
    const userNames = [...new Set(payload.map(({ supplierDetails }) => supplierDetails.userName))];
    userNames.forEach((item) => {
      const category = [...new Set(payload.map((product) => product.category))];
      const foo = payload.filter(({ supplierDetails }) => supplierDetails.userName === item);
      const emailUnique = [...new Set(foo.map((product) => product.supplierDetails.email))];
      const productName = foo.map((prod) => prod.name);
      return result.push({
        userName: item, productName, category, supplier: emailUnique
      });
    });
    return result;
  },

  /**
   * gets an suppliers percentage cut
   * @static
   * @param {object} products - suppliers in order with ther products
   * @returns {number} in Kobo
   * @memberof Toolbox
   */
  calculateSupplierPercentage(products) {
    const kobo = 100;
    return products.map((item) => (1 - item.percentage) * item.price * item.quantity)
      .reduce((accumulator, current) => accumulator + current) * kobo;
  },

  /**
   * generates supplier reference code
   * @static
   * @param {object} supplierId - supplierId
   * @returns {string} reference - A unique value for ref
   * @memberof Toolbox
   */
  generateReference(supplierId) {
    const randomNumber = Math.floor(Math.random() * 8999 + 1000);
    const anotherRandomNumber = Math.floor(Math.random() * 8999 + 1000);
    const reference = `ref_${supplierId}${randomNumber}${anotherRandomNumber}`;
    return reference;
  },

  /**
   * calculates new product rating
   * @static
   * @param {number} overallRating
   * @param {number} currentRating
   * @param {number} newRating
   * @returns {number} productRating
   * @memberof Toolbox
   */
  calculateRating(totalRating, overallRating, newRating) {
    return parseFloat(((overallRating * totalRating) + newRating) / (totalRating + 1)).toFixed(1);
  }
};

export default Toolbox;
