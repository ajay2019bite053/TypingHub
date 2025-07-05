const DeleteRequest = require('../models/DeleteRequest');
const Passage = require('../models/Passage');
const Test = require('../models/Test');
const Question = require('../models/Question');
const Admin = require('../models/Admin');

// Create a new delete request
exports.createDeleteRequest = async (req, res) => {
  try {
    const { type, itemId, itemName } = req.body;
    const adminId = req.admin.id;

    // Verify that the item exists
    let item;
    switch (type) {
      case 'passage':
        item = await Passage.findById(itemId);
        break;
      case 'test':
        item = await Test.findById(itemId);
        break;
      case 'question':
        item = await Question.findById(itemId);
        break;
      default:
        return res.status(400).json({ message: 'Invalid item type' });
    }

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Get admin email
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Create the delete request
    const deleteRequest = new DeleteRequest({
      type,
      itemId,
      itemName,
      requestedBy: {
        id: adminId,
        email: admin.email
      }
    });

    await deleteRequest.save();

    res.status(201).json(deleteRequest);
  } catch (error) {
    console.error('Error creating delete request:', error);
    res.status(500).json({ message: 'Error creating delete request' });
  }
};

// Get all delete requests
exports.getDeleteRequests = async (req, res) => {
  try {
    const deleteRequests = await DeleteRequest.find()
      .sort({ createdAt: -1 });
    res.json(deleteRequests);
  } catch (error) {
    console.error('Error fetching delete requests:', error);
    res.status(500).json({ message: 'Error fetching delete requests' });
  }
};

// Approve a delete request
exports.approveDeleteRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const deleteRequest = await DeleteRequest.findById(requestId);

    if (!deleteRequest) {
      return res.status(404).json({ message: 'Delete request not found' });
    }

    if (deleteRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Request is not pending' });
    }

    // Delete the item based on its type
    switch (deleteRequest.type) {
      case 'passage':
        await Passage.findByIdAndDelete(deleteRequest.itemId);
        break;
      case 'test':
        await Test.findByIdAndDelete(deleteRequest.itemId);
        break;
      case 'question':
        await Question.findByIdAndDelete(deleteRequest.itemId);
        break;
      default:
        return res.status(400).json({ message: 'Invalid item type' });
    }

    // Update the request status
    deleteRequest.status = 'approved';
    await deleteRequest.save();

    res.json(deleteRequest);
  } catch (error) {
    console.error('Error approving delete request:', error);
    res.status(500).json({ message: 'Error approving delete request' });
  }
};

// Reject a delete request
exports.rejectDeleteRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const deleteRequest = await DeleteRequest.findById(requestId);

    if (!deleteRequest) {
      return res.status(404).json({ message: 'Delete request not found' });
    }

    if (deleteRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Request is not pending' });
    }

    deleteRequest.status = 'rejected';
    await deleteRequest.save();

    res.json(deleteRequest);
  } catch (error) {
    console.error('Error rejecting delete request:', error);
    res.status(500).json({ message: 'Error rejecting delete request' });
  }
}; 