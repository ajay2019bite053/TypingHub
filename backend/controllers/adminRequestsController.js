const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

// Get all admin requests and approved admins
const getAdminRequests = async (req, res) => {
  try {
    console.log('Fetching admin requests and approved admins...');
    
    // Fetch pending admins (excluding default/super admins)
    const pendingAdmins = await Admin.find({ 
        isApproved: false,
        isDefaultAdmin: { $ne: true } 
      })
      .select('-password -refreshToken')
      .sort({ registrationDate: -1 });

    // Fetch approved admins (excluding default/super admins)
    const approvedAdmins = await Admin.find({
        isApproved: true,
        isDefaultAdmin: { $ne: true } 
      })
      .select('-password -refreshToken')
      .sort({ registrationDate: -1 });

    console.log(`Found ${pendingAdmins.length} pending admins and ${approvedAdmins.length} approved admins`);

    // Format the dates and prepare the response
    const formatAdminData = (admin) => ({
      ...admin.toObject(),
      registrationDate: admin.registrationDate ? 
        new Date(admin.registrationDate).toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) : 'N/A'
    });

    const formattedPendingAdmins = pendingAdmins.map(formatAdminData);
    const formattedApprovedAdmins = approvedAdmins.map(formatAdminData);

    res.status(200).json({
      pendingAdmins: formattedPendingAdmins,
      approvedAdmins: formattedApprovedAdmins
    });
  } catch (error) {
    console.error('Error in getAdminRequests:', error);
    res.status(500).json({ 
      message: 'Error fetching admin requests',
      error: error.message 
    });
  }
};

// Approve admin request
const approveAdmin = async (req, res) => {
  console.log('Approve admin called', { id: req.params.id });
  try {
    const { id } = req.params;
    console.log(`Approving admin with ID: ${id}`);

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    admin.isApproved = true;
    await admin.save();

    res.status(200).json({ message: 'Admin approved successfully' });
  } catch (error) {
    console.error('Error in approveAdmin:', error);
    res.status(500).json({ 
      message: 'Error approving admin',
      error: error.message 
    });
  }
};

// Reject admin request
const rejectAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Rejecting admin with ID: ${id}`);

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    await Admin.findByIdAndDelete(id);
    res.status(200).json({ message: 'Admin rejected successfully' });
  } catch (error) {
    console.error('Error in rejectAdmin:', error);
    res.status(500).json({ 
      message: 'Error rejecting admin',
      error: error.message 
    });
  }
};

// Remove an approved admin (soft delete or set inactive)
const removeAdmin = async (req, res) => {
  console.log('Remove admin called', { id: req.params.id });
  try {
    const { id } = req.params;
    console.log(`Attempting to remove admin with ID: ${id}`);

    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Prevent removing a default/super admin
    if (admin.isDefaultAdmin) {
      return res.status(403).json({ message: 'Cannot remove a default administrator' });
    }

    // For removal, we'll just delete the entry. Alternatively, you could set isApproved: false
    await Admin.findByIdAndDelete(id);
    res.status(200).json({ message: 'Admin removed successfully' });
  } catch (error) {
    console.error('Error in removeAdmin:', error);
    res.status(500).json({ 
      message: 'Error removing admin',
      error: error.message 
    });
  }
};

module.exports = {
  getAdminRequests,
  approveAdmin,
  rejectAdmin,
  removeAdmin
}; 