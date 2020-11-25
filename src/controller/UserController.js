/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
import database from '../models';
import { Toolbox } from './../util';
import { GeneralService } from '../services'
// import { env } from '../config';
import validData from './../validation/validData'

const {
  successResponse,
  errorResponse
} = Toolbox;
const {
  findMultipleByKey,
  findByKey
} = GeneralService;
const {
  User,
  Food,
  Order
} = database;

const UserController = {

  /**
     * get categories
     * @param {object} req
     * @param {object} res
     * @returns {JSON } A JSON message with the user's profile details.
     * @memberof UserController
     */
  async callUssd(req, res) {
    try {
    // Logic for 1 level message
      let welcomeMsg, personalDetails, orderDetails, message, endMessage, user, foodName, price;
      welcomeMsg = `CON Hello and welcome to La Turre Restuarante.
        Please if you are a new user ensure to register before making any order.
        Older members can make orders and food will be delivered to you fast and hot!.
        Please select Option to continue.
        1. Register An Account.
        2. Make Order.
      `;
      personalDetails = {
        bank_name: "",
        account_number: "",
        email: "",
        phone: "",
        address: "",
        open: true
      };
      orderDetails = {
        foodName: "",
        price: "",
        email: "",
        quantity: '',
        open: true
      };
      let foodList = await findMultipleByKey(Food, {});
      foodList = foodList.map((x) => ({ id: x.id, name: x.name, amount: x.amount }));
      let {
        sessionId, serviceCode, phoneNumber, text
      } = req.body;
      let textValue = text.split('*');
      console.log(text, textValue, orderDetails);

      if (text === '') {
        message = welcomeMsg
        res.status(200).send(message);
      } else if (text === '1') {
        message = `Please Input your email address`;
      } else if (textValue[0] === '1' && textValue.length === 2) {
        message = `Please Input your home address`;
        personalDetails.email = textValue[1];
        res.status(200).send(message);
      } else if (textValue[0] === '1' && textValue.length === 3) {
        message = `Please Input your bank account number`;
        personalDetails.address = textValue[2];
        res.status(200).send(message);
      } else if (textValue[0] === '1' && textValue.length === 4) {
        message = `Please select your Bank \n
          ${validData.map((x) =>
            x.id, x.bank_name
          )} `;
        personalDetails.account_number = textValue[3];
          res.status(200).send(message);
      } else if (text === '2') {
          message = "CON Please Input your Email"
          res.status(200).send(message);
      } else if (textValue[0] === '2' && textValue.length === 2) {
          // user = await findByKey(User, { email: textValue[1] });
          // if (!user) message = `END You haven't registered with our platform, please register and try again..`
           message = `CON Please select your Order
            1. Scambled Eggs
            2. Fried Potatoes
            3. Catalan Sausage
           `;
        // message = `CON Where do we deliver it?`;
        orderDetails.email = textValue[1];
          res.status(200).send(message);
      } else if (textValue[0] === '2' && textValue.length === 3) {
        const id = Number(textValue[2]) - 1;
        const food = foodList[id];
          message = `CON How many orders of ${food.name} do you want`;
          orderDetails.foodName = food.name;
        price = food.amount;
          res.status(200).send(message);
      } else if (textValue[0] === '2' && textValue.length === 4) {
        price = Number(price) * Number(textValue[3]);
        console.log(price);
        message = `CON Price is $${price}, Would you like to place this order?
            1. Yes
            2. No`;
        orderDetails.quantity = textValue[3];
        orderDetails.price = price;
        res.status(200).send(message);
      } else if (textValue[0] === '2' && textValue.length === 5) {
        if (textValue[4] === '1') {
          message = `End Your Order has been made and is coming straight to your address`
        } else {
            message = `END Thanks for using our platform`
        }
          res.status(200).send(message);
        }
      // successResponse(res, { message });
    } catch (error) {
      errorResponse(res, {});
    }
  },
};

export default UserController;
