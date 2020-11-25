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
      let welcomeMsg, personalDetails, orderDetails, message, endMessage, user;
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
        amount: "",
        email: "",
        open: true
      };
      const foodList = await findMultipleByKey(Food, {});
      let {
        sessionId, serviceCode, phoneNumber, text
      } = req.body;
      let textValue = text.split('*');
      console.log(text, textValue, personalDetails);


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
      } else if (text === '2' && textValue.length === 2) {
          user = await findByKey(User, { email: textValue[1] });
          if (!user) message = `END You haven't registered with our platform, please register and try again..`
          else message = "CON Where do we deliver it?"
          res.status(200).send(message);
        } else if (textValue === 4) {
          message = "CON What's your phone number?, Ensure you use your registered number";
          orderDetails.address = text.split('*')[2];
          // orderDetails.address = text.split('*')[2];
              res.status(200).send(message);
        } else if (textValue === 5) {
          message = `CON Would you like to place this order?
            1. Yes
            2. No`
          lastData = text.split('*')[3];
              res.status(200).send(message);
        } else {
          message = `END Thanks for your order
            Enjoy your meal in advance`
          orderDetails.telephone = lastData
        }
      // successResponse(res, { message });
    } catch (error) {
      errorResponse(res, {});
    }
  },
};

export default UserController;
