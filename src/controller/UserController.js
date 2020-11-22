/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
import database from '../models';
// import { env } from '../config';

const {
  User
} = database;

const UserController = {

  /**
     * get categories
     * @param {object} req
     * @param {object} res
     * @returns {JSON } A JSON response with the user's profile details.
     * @memberof UserController
     */
  async callUssd(req, res) {
    try {
    // Logic for 1 level response
      let response;
      let {
        sessionId, serviceCode, phoneNumber, text
      } = req.body;
      if (text = '') {
        response = `CON What would you want to check
          1. My Account
          2. My Phone Number
        `;
        res.send(response);
      } else if (text === '1') {
        // logic for 1
        response = `CON Choose account information you want to view
            1. Account Number
            2. Account Balance
        `;
        res.send(response);
      } else if (text === '2') {
        // logic for 2
        response = `END Your Phone Number is ${phoneNumber}`;
        res.send(response);
      } else if (text = '1*1') {
        // if the user selected 1 in the first instance
        const accountNumber = 'B45000YT76899';
        response = `END Your Account Number is ${accountNumber}`;
        res.send(response);
      } else if (text == '1*2') {
        // if the user selected 2 in the first instance
        const balance = 'NGN 100,000';
        response = `END Your Account Balance is ${balance}`;
        res.send(response);
      } else {
        res.status(400).send('You No Dey See Well');
      }
      // return successResponse(res, { categories });
    } catch (error) {
      errorResponse(res, {});
    }
  },
};

export default UserController;
