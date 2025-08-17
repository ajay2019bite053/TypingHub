const Certificate = require('../models/Certificate');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Generate certificate
const generateCertificate = async (req, res) => {
  try {
    const { userId, userName, typingSpeed, accuracy } = req.body;

    // Check if user already has a certificate
    const existingCertificate = await Certificate.findOne({ userId });
    if (existingCertificate) {
      return res.status(400).json({ 
        success: false, 
        message: 'Certificate already exists for this user' 
      });
    }

    // Create new certificate
    const certificate = new Certificate({
      userId,
      userName,
      typingSpeed,
      accuracy
    });

    await certificate.save();

    // Generate PDF certificate
    const pdfPath = await generatePDFCertificate(certificate);
    
    // Update certificate with PDF URL
    certificate.certificateUrl = pdfPath;
    await certificate.save();

    res.status(201).json({
      success: true,
      message: 'Certificate generated successfully',
      certificate: {
        id: certificate.certificateId,
        verificationCode: certificate.verificationCode,
        downloadUrl: `/api/certificates/download/${certificate.certificateId}`
      }
    });

  } catch (error) {
    console.error('Error generating certificate:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error generating certificate' 
    });
  }
};

// Download certificate
const downloadCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    
    const certificate = await Certificate.findOne({ certificateId });
    if (!certificate) {
      return res.status(404).json({ 
        success: false, 
        message: 'Certificate not found' 
      });
    }

    // Increment download count
    certificate.downloadCount += 1;
    await certificate.save();

    // Send PDF file
    const pdfPath = path.join(__dirname, '..', 'uploads', 'certificates', `${certificateId}.pdf`);
    
    if (fs.existsSync(pdfPath)) {
      res.download(pdfPath, `typing-certificate-${certificateId}.pdf`);
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'Certificate file not found' 
      });
    }

  } catch (error) {
    console.error('Error downloading certificate:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error downloading certificate' 
    });
  }
};

// Verify certificate
const verifyCertificate = async (req, res) => {
  try {
    const { verificationCode } = req.params;
    
    const certificate = await Certificate.findOne({ verificationCode });
    if (!certificate) {
      return res.status(404).json({ 
        success: false, 
        message: 'Invalid verification code' 
      });
    }

    res.json({
      success: true,
      certificate: {
        userName: certificate.userName,
        typingSpeed: certificate.typingSpeed,
        accuracy: certificate.accuracy,
        testDate: certificate.testDate,
        certificateId: certificate.certificateId
      }
    });

  } catch (error) {
    console.error('Error verifying certificate:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error verifying certificate' 
    });
  }
};

// Get user certificate
const getUserCertificate = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const certificate = await Certificate.findOne({ userId });
    if (!certificate) {
      return res.status(404).json({ 
        success: false, 
        message: 'No certificate found for this user' 
      });
    }

    res.json({
      success: true,
      certificate: {
        id: certificate.certificateId,
        verificationCode: certificate.verificationCode,
        userName: certificate.userName,
        typingSpeed: certificate.typingSpeed,
        accuracy: certificate.accuracy,
        testDate: certificate.testDate,
        downloadUrl: `/api/certificates/download/${certificate.certificateId}`
      }
    });

  } catch (error) {
    console.error('Error getting user certificate:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error getting certificate' 
    });
  }
};

// Generate PDF certificate
const generatePDFCertificate = async (certificate) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape'
      });

      const uploadsDir = path.join(__dirname, '..', 'uploads', 'certificates');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const pdfPath = path.join(uploadsDir, `${certificate.certificateId}.pdf`);
      const stream = fs.createWriteStream(pdfPath);

      doc.pipe(stream);

      // Certificate design
      doc.fontSize(40)
         .font('Helvetica-Bold')
         .fill('#1a2a44')
         .text('TYPING CERTIFICATE', 0, 100, { align: 'center' });

      doc.fontSize(16)
         .font('Helvetica')
         .fill('#666')
         .text('This is to certify that', 0, 180, { align: 'center' });

      doc.fontSize(24)
         .font('Helvetica-Bold')
         .fill('#1976d2')
         .text(certificate.userName, 0, 220, { align: 'center' });

      doc.fontSize(16)
         .font('Helvetica')
         .fill('#666')
         .text('has successfully completed the typing test with', 0, 260, { align: 'center' });

      doc.fontSize(20)
         .font('Helvetica-Bold')
         .fill('#4caf50')
         .text(`${certificate.typingSpeed} WPM`, 0, 300, { align: 'center' });

      doc.fontSize(16)
         .font('Helvetica')
         .fill('#666')
         .text(`Accuracy: ${certificate.accuracy}%`, 0, 340, { align: 'center' });

      doc.fontSize(14)
         .font('Helvetica')
         .fill('#999')
         .text(`Certificate ID: ${certificate.certificateId}`, 50, 450);
      
      doc.text(`Verification Code: ${certificate.verificationCode}`, 50, 470);
      doc.text(`Date: ${new Date(certificate.testDate).toLocaleDateString()}`, 50, 490);

      doc.fontSize(12)
         .font('Helvetica')
         .fill('#999')
         .text('Verify at: typinghub.com/verify', 0, 520, { align: 'center' });

      doc.end();

      stream.on('finish', () => {
        resolve(pdfPath);
      });

      stream.on('error', reject);

    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generateCertificate,
  downloadCertificate,
  verifyCertificate,
  getUserCertificate,
  // New: list all certificates
  getAllCertificates: async (req, res) => {
    try {
      const certificates = await Certificate.find().sort({ createdAt: -1 }).lean();
      res.json({ success: true, certificates });
    } catch (error) {
      console.error('Error fetching certificates:', error);
      res.status(500).json({ success: false, message: 'Error fetching certificates' });
    }
  }
}; 