/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
import database from '../models';
import { Toolbox, Payments } from './../util';
import { GeneralService } from '../services'
// import { env } from '../config';
import validData from './../validation/validData'

const {
  successResponse,
  errorResponse
} = Toolbox;
const {
  findMultipleByKey,
  findByKey,
  addEntity
} = GeneralService;
const {
  paystackBankNamesAndCodes
} = validData;
const {
  verifyAccount,
  viaPaystack
} = Payments;
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
      let welcomeMsg, message, user, price, food, bank, bank_name, bank_code;


      welcomeMsg = `CON Hello and welcome to La Turre Restuarante.
        Please if you are a new user ensure to register before making any order.
        Older members can make orders and food will be delivered to you fast and hot!.
        Please select Option to continue.
        1. Register An Account.
        2. Make Order.
      `;

      const orderDetails = {};
      // If this is not still showing, we can try using (req.orderDetails or req.body)
      // to store order details of users information till the session has ended

      // list of food in the database
      let foodList = await findMultipleByKey(Food, {});
      foodList = foodList.map((x) => ({ id: x.id, name: x.name, amount: x.amount }));

      let {
        sessionId, serviceCode, phoneNumber, text
      } = req.body;
      let textValue = text.split('*');

      if (text === '') {

        message = welcomeMsg
        res.status(200).send(message);

      } else if (text  === '1') {

        message = `CON Please Input your email address`;
        res.status(200).send(message);

      } else if (textValue[0] === '1' && textValue.length === 2) {

        user = await findByKey(User, { email: textValue[1] });
        if (user) message = `END User ${user.fullName} have registered with our platform, Please proceed to make your order.`;
        else message = `CON Please Input your home address`;
        res.status(200).send(message);

      } else if (textValue[0] === '1' && textValue.length === 3) {

        message = `CON Please Input your bank account number`;
        res.status(200).send(message);

      } else if (textValue[0] === '1' && textValue.length === 4) {

        // This is just for testing, i will still find a better way of making the presentation
        message = `CON Please select your Bank
          1. Access Bank
          2. Access Bank (Diamond)
          3. ALAT by WEMA
          4. ASO Savings and Loans
          5. CEMCS Microfinance Bank
          6. Citibank Nigeria
          7. Ecobank Nigeria
          8. Ekondo Microfinance Bank
          9. Fidelity Bank
          10. First Bank of Nigeria
          11. First City Monument Bank
          12. Globus Bank
          13. Guaranty Trust Bank
          14. Heritage Bank
          15. Jaiz Bank
          16. Keystone Bank
          17. Kuda Bank
          18. Parallex Bank
          19. Polaris Bank
          20. Providus Bank
          21. Rubies MFB
          22. Sparkle Microfinance Bank
          23. Stanbic IBTC Bank
          24. Standard Chartered Bank
          25. Sterling Bank
          26. Suntrust Bank
          27. TAJ Bank
          28. Titan Bank
          29. Union Bank of Nigeria
          30. United Bank For Africa
          31. Unity Bank
          32. VFD
          33. Wema Bank
          34. Zenith Bank
        `;
        res.status(200).send(message);

      } else if (textValue[0] === '1' && textValue.length === 5) {

        const id = Number(textValue[4] - 1);
        bank = paystackBankNamesAndCodes[id];
        const account_number = textValue[3];
        bank_name = bank.bank_name;
        bank_code = bank.bank_code;
        const bankProfile = await verifyAccount({ account_number, bank_code });
        if (bankProfile) {
          const fullName = bankProfile.account_name;
          const userProfile = {
            fullName,
            bank_code,
            account_number,
            bank_name,
            phone: phoneNumber,
            email: textValue[1],
            address: textValue[2]
          }

          const user = await addEntity(User, userProfile);
          if (user) message = `END User ${fullName} is Registered with La Turre Restuarante..`
        } else message = `END Error in confirming bank account details, Please check your network and try again later.`;
        res.status(200).send(message);

      } else if (text === '2') {

        message = "CON Please Input your Email"
        res.status(200).send(message);

      } else if (textValue[0] === '2' && textValue.length === 2) {

        user = await findByKey(User, { email: textValue[1] });
        if (!user) message = `END You haven't registered with our platform, please register and try again..`;
        else {
          const username = user.fullName;
          message = `CON Welcome ${username}, Please select your Order
            1. Scambled Eggs
            2. Fried Potatoes
            3. Catalan Sausage
            4. Pasta
            5. Mussels
            6. Bacon
            7. Toast Coffee
            8. Shrimps
            9. Sandwich
            10. Paella
            11. Hamburgers
            12. Shawarma
            13. Rice
            14. Green Salad
            15. Cheesecake
            16. Baguette
            17. Cappuccino
            18. Smoothies
            19. Potato Pie
            20. Fresh Squeezed Juice
            21. Steak
            `;
        }

        // orderDetails.email = textValue[1];
        res.status(200).send(message);

      } else if (textValue[0] === '2' && textValue.length === 3) {
        const id = Number(textValue[2]) - 1;
        if (id > foodList.length) {
          textValue.pop();
        } else {
          food = foodList[id];
          orderDetails.food = food;
          message = `CON How many orders of ${food.name} do you want`;
        }
        res.status(200).send(message);

      } else if (textValue[0] === '2' && textValue.length === 4) {

        const id = Number(textValue[2]) - 1;
        food = foodList[id];
        price = food.amount * textValue[3];
        console.log(price);
        message = `CON Price is $${price}, Would you like to place this order?
            1. Yes
            2. No`;
        res.status(200).send(message);

      } else if (textValue[0] === '2' && textValue.length === 5) {

        if (textValue[4] === '1') {
          const id = Number(textValue[2]) - 1;
          food = foodList[id];
          price = food.amount * textValue[3];
          user = await findByKey(User, { email: textValue[1] });
          const body = {
            foodId: food.id,
            userId: user.id,
            quantity: textValue[3],
            price,
          };
          const order = await addEntity(Order, body);

          // remember to add paystact to this operarion.
          // const pay = await viaPaystack({ email: user.email, amount: body.amount, metadata: 'NGN' });
          if (order) message = `END Your Order has been made and is coming straight to your address`;
          else message = `END Network Issue. Please check your network and try again`
        } else message = `END Your Order has been cancelled!!.`;
        res.status(200).send(message);

      } else {

        message = `End Session has ended, Please try again later`;
        res.status(200).send(message);

      }

    } catch (error) {
      console.error(error);
      errorResponse(res, {});
    }
  },
};

export default UserController;
