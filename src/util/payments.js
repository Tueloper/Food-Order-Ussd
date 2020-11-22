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
   * validate user payment via paystack
   * @param {string} reference - paystack reference
   * @returns {Promise<boolean>} - Returns json with payment details
   * @memberof Payments
   */
  async validatePaystack(reference) {
    let stackBody;
    try {
      await paystack.verifyTransaction({ reference }).then((body) => {
        // console.log('paystack body: ', body);
        stackBody = body.body;
      });
      return stackBody;
    } catch (error) {
      return error;
    }
  },

  /**
   * creates a transfer recipient
   *  @param {object} payload - An object
   * @returns {object} - Returns an object with recipinet code
   * @memberof Payments
   */
  async paystackCreateTransferRecipient(payload) {
    let stackBody;
    try {
      await paystack.createTransferRecipient(payload).then((body) => {
        stackBody = body.body.data;
      });

      return stackBody;
    } catch (error) {
      return error;
    }
  },

  /**
   * delete transfet recipient
   * @param {string} code - paystack recepient code
   * @returns {object} - Returns an object with recipinet code
   * @memberof Payments
   */
  async paystackDeleteTransferRecipient(code) {
    let stackBody;
    const payload = {
      recipient_code_or_id: code
    };
    try {
      await paystack.deleteTransferRecipient(payload)
        .then((body) => {
          stackBody = body.body.data;
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

  /**
   * creates a single transfer to supplier account
   *  @param {object} payload - an object
   * @returns {object} - Returns an object with recipinet code
   * @memberof Payments
   */
  async paystackSingleTransfer(payload) {
    let stackBody;
    try {
      await paystack.initiateTransfer(payload).then((body) => {
        stackBody = body.body.data;
      });

      return stackBody;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
};

export default Payments;
