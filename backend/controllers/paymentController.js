const Razorpay = require('razorpay');
const { StatusCodes } = require('http-status-codes');
const CompetitionRegistration = require('../models/CompetitionRegistration');
const User = require('../models/User');
const Competition = require('../models/Competition');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create payment order
const createPaymentOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    if (!amount || !receipt) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Amount and receipt are required'
      });
    }

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt,
      notes: notes || {}
    };

    const order = await razorpay.orders.create(options);

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt
      }
    });
  } catch (error) {
    console.error('Create payment order error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error creating payment order'
    });
  }
};

// Verify payment signature
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Payment verification failed - missing parameters'
      });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Payment verification failed - invalid signature'
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id
      }
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error verifying payment'
    });
  }
};

// Process competition registration payment
const processCompetitionPayment = async (req, res) => {
  try {
    const { name, mobile, competitionId, amount, paymentId } = req.body;

    if (!name || !mobile || !amount || !paymentId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Get current competition if competitionId is not provided
    let competition;
    if (competitionId) {
      competition = await Competition.findById(competitionId);
    } else {
      competition = await Competition.findOne({}).sort({ createdAt: -1 });
    }

    if (!competition) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'No active competition found'
      });
    }

    // Check if registration is active
    if (!competition.isRegistrationActive) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Registration is not active'
      });
    }

    // Check if slots are available
    if (competition.totalRegistrations >= competition.maxSlots) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'All slots are filled'
      });
    }

    // Check if already registered
    const existingRegistration = await CompetitionRegistration.findOne({
      mobile,
      competitionId: competition._id
    });

    if (existingRegistration) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'You are already registered for this competition'
      });
    }

    // Verify payment with Razorpay
    try {
      const payment = await razorpay.payments.fetch(paymentId);
      if (payment.status !== 'captured') {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Payment not completed'
        });
      }

      // Verify amount
      if (payment.amount !== amount * 100) { // Convert to paise for comparison
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Payment amount mismatch'
        });
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid payment ID'
      });
    }

    // Create registration with payment details
    const registration = new CompetitionRegistration({
      name,
      mobile,
      competitionId: competition._id,
      paymentId,
      paymentAmount: amount,
      paymentStatus: 'completed'
    });

    await registration.save();

    // Update competition stats
    competition.totalRegistrations += 1;
    await competition.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Registration successful',
      data: {
        secretId: registration.secretId,
        registrationId: registration._id
      }
    });
  } catch (error) {
    console.error('Process competition payment error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error processing payment'
    });
  }
};

// Get payment status
const getPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;

    if (!paymentId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Payment ID is required'
      });
    }

    const payment = await razorpay.payments.fetch(paymentId);

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        paymentId: payment.id,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        method: payment.method,
        description: payment.description,
        created_at: payment.created_at
      }
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error fetching payment status'
    });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  processCompetitionPayment,
  getPaymentStatus
};

