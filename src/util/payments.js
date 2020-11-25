import Paystack from 'paystack-node';
import env from '../config/env';

const environment = env.NODE_ENV;
const {
  PAYSTACK_TEST_SECRET_KEY
} = env;

const paystack = new Paystack(PAYSTACK_TEST_SECRET_KEY, environment);

const Payments = {
  /**
   * create user payment url via paystack
   * @param {obj} payload - { email, amount, }
   * @returns {JSON} - Returns json with paystack url
   * @memberof Payments
   */
  async viaPaystack(payload) {
    const { email, amount, metadata } = payload;
    let stackBody;
    try {
      await paystack.initializeTransaction({
        email,
        amount,
        metadata: JSON.stringify(metadata)
      }).then((body) => {
        // console.log('paystack body: ', body);
        stackBody = body.body;
      });
      return stackBody;
    } catch (error) {
      return error;
    }
  },

  /**
   * verify account number and bank code
   * @param {object} payload - object
   * @returns {object} - Returns an object with account details
   * @memberof Payments
   */
  async verifyAccount(payload) {
    let stackBody;
    // eslint-disable-next-line camelcase
    const { account_number, bank_code } = payload;
    try {
      await paystack.resolveAccountNumber({ account_number, bank_code })
        .then((body) => {
          stackBody = body.body.data;
        });
      return stackBody;
    } catch (error) {
      return error;
    }
  },
};

export default Payments;
