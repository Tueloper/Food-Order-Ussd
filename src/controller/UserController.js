/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
import database from '../models';
import { Toolbox } from './../util';
// import { env } from '../config';

const {
  successResponse,
  errorResponse
} = Toolbox;
const {
  User
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
      let welcomeMsg, personalDetails, orderDetails, message, endMessage;
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
      let {
        sessionId, serviceCode, phoneNumber, text
      } = req.body;
      let textValue = text.split('*').length;


      if (text === '') {
        message = welcomeMsg
        res.status(200).send(message);
      } else if (text === '1') {
          message = `END This feature is still loading`;
          res.status(200).send(message);
        } else if (text === '2') {
          message = "CON What do you want to eat?"
          console.log(text);
          res.status(200).send(message);
        } else if (text === 3) {
          message = "CON Where do we deliver it?"
          orderDetails.foodName = text.split('*')[1];
          res.status(200).send(message);
        } else if (textValue === 4) {
          message = "CON What's your phone number?, Ensure you use your registered number";
          orderDetails.address = text.split('*')[2];
          orderDetails.address = text.split('*')[2];
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

            console.log(text, orderDetails, textValue);
      return successResponse(res, { orderDetails });
    } catch (error) {
      errorResponse(res, {});
    }
  },
};

export default UserController;
