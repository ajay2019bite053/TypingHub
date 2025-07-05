const Passage = require('../models/Passage');

// Validation helper functions
const validateTitle = (title) => {
  if (!title || typeof title !== 'string') {
    return { isValid: false, message: 'Title is required and must be a string' };
  }
  
  const trimmedTitle = title.trim();
  if (trimmedTitle.length === 0) {
    return { isValid: false, message: 'Title cannot be empty' };
  }
  
  if (trimmedTitle.length < 3) {
    return { isValid: false, message: 'Title must be at least 3 characters long' };
  }
  
  if (trimmedTitle.length > 200) {
    return { isValid: false, message: 'Title must be less than 200 characters' };
  }
  
  // Check for valid characters (letters, numbers, spaces, common punctuation)
  const validTitleRegex = /^[a-zA-Z0-9\s\-_.,!?()]+$/;
  if (!validTitleRegex.test(trimmedTitle)) {
    return { isValid: false, message: 'Title contains invalid characters' };
  }
  
  return { isValid: true, value: trimmedTitle };
};

const validateContent = (content) => {
  if (!content || typeof content !== 'string') {
    return { isValid: false, message: 'Content is required and must be a string' };
  }
  
  const trimmedContent = content.trim();
  if (trimmedContent.length === 0) {
    return { isValid: false, message: 'Content cannot be empty' };
  }
  
  if (trimmedContent.length < 10) {
    return { isValid: false, message: 'Content must be at least 10 characters long' };
  }
  
  if (trimmedContent.length > 5000) {
    return { isValid: false, message: 'Content must be less than 5000 characters' };
  }
  
  return { isValid: true, value: trimmedContent };
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove excessive whitespace
  let sanitized = input.replace(/\s+/g, ' ').trim();
  
  // Remove potential XSS vectors (basic sanitization)
  sanitized = sanitized
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
  
  return sanitized;
};

// Get all passages (public)
const getAllPassages = async (req, res) => {
  try {
    const passages = await Passage.find().sort({ createdAt: -1 });
    console.log('Fetched all passages:', passages.length);
    res.status(200).json(passages);
  } catch (error) {
    console.error('Error fetching passages:', error.message, error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get passage by ID (protected)
const getPassageById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Valid passage ID is required' });
    }
    
    const passage = await Passage.findById(id);
    if (!passage) {
      console.log(`Passage not found: ${id}`);
      return res.status(404).json({ message: 'Passage not found' });
    }
    console.log('Fetched passage by ID:', passage._id);
    res.status(200).json(passage);
  } catch (error) {
    console.error('Error fetching passage by ID:', error.message, error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new passage (protected)
const createPassage = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Validate title
    const titleValidation = validateTitle(title);
    if (!titleValidation.isValid) {
      console.log('Create passage failed:', titleValidation.message);
      return res.status(400).json({ message: titleValidation.message });
    }

    // Validate content
    const contentValidation = validateContent(content);
    if (!contentValidation.isValid) {
      console.log('Create passage failed:', contentValidation.message);
      return res.status(400).json({ message: contentValidation.message });
    }

    // Sanitize inputs
    const sanitizedTitle = sanitizeInput(titleValidation.value);
    const sanitizedContent = sanitizeInput(contentValidation.value);

    // Check for duplicate titles (case-insensitive)
    const existingPassage = await Passage.findOne({ 
      title: { $regex: new RegExp(`^${sanitizedTitle}$`, 'i') } 
    });
    
    if (existingPassage) {
      console.log('Create passage failed: Duplicate title');
      return res.status(409).json({ message: 'A passage with this title already exists' });
    }

    const passage = new Passage({ 
      title: sanitizedTitle, 
      content: sanitizedContent, 
      testTypes: [] 
    });
    
    await passage.save();
    console.log('Passage created:', passage._id);
    res.status(201).json(passage);
  } catch (error) {
    console.error('Error creating passage:', error.message, error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a passage (protected)
const updatePassage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, testTypes } = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Valid passage ID is required' });
    }

    // Validate title
    const titleValidation = validateTitle(title);
    if (!titleValidation.isValid) {
      console.log('Update passage failed:', titleValidation.message);
      return res.status(400).json({ message: titleValidation.message });
    }

    // Validate content
    const contentValidation = validateContent(content);
    if (!contentValidation.isValid) {
      console.log('Update passage failed:', contentValidation.message);
      return res.status(400).json({ message: contentValidation.message });
    }

    // Sanitize inputs
    const sanitizedTitle = sanitizeInput(titleValidation.value);
    const sanitizedContent = sanitizeInput(contentValidation.value);

    const passage = await Passage.findById(id);
    if (!passage) {
      console.log(`Passage not found for update: ${id}`);
      return res.status(404).json({ message: 'Passage not found' });
    }

    // Check for duplicate titles (excluding current passage)
    const existingPassage = await Passage.findOne({ 
      title: { $regex: new RegExp(`^${sanitizedTitle}$`, 'i') },
      _id: { $ne: id }
    });
    
    if (existingPassage) {
      console.log('Update passage failed: Duplicate title');
      return res.status(409).json({ message: 'A passage with this title already exists' });
    }

    passage.title = sanitizedTitle;
    passage.content = sanitizedContent;
    if (testTypes && Array.isArray(testTypes)) {
      passage.testTypes = testTypes;
    }
    
    await passage.save();

    console.log('Passage updated:', passage._id);
    res.status(200).json(passage);
  } catch (error) {
    console.error('Error updating passage:', error.message, error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a passage (protected)
const deletePassage = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Valid passage ID is required' });
    }

    const passage = await Passage.findById(id);
    if (!passage) {
      console.log(`Passage not found for deletion: ${id}`);
      return res.status(404).json({ message: 'Passage not found' });
    }

    await passage.deleteOne();
    console.log('Passage deleted:', id);
    res.status(200).json({ message: 'Passage deleted successfully' });
  } catch (error) {
    console.error('Error deleting passage:', error.message, error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get passages by test type (public)
const getPassagesByTestType = async (req, res) => {
  try {
    const { testType } = req.params;

    if (!testType || typeof testType !== 'string') {
      console.log('Get passages by test type failed: Valid testType required');
      return res.status(400).json({ message: 'Valid test type is required' });
    }

    const sanitizedTestType = sanitizeInput(testType);
    const passages = await Passage.find({ testTypes: sanitizedTestType }).sort({ createdAt: -1 });
    console.log(`Fetched passages for test type ${sanitizedTestType}:`, passages.length);
    res.status(200).json(passages);
  } catch (error) {
    console.error('Error fetching passages by test type:', error.message, error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Assign passage to test type (protected)
const assignPassage = async (req, res) => {
  try {
    const { passageId, category } = req.body;

    if (!passageId || typeof passageId !== 'string') {
      console.log('Assign passage failed: Valid passageId required');
      return res.status(400).json({ message: 'Valid passage ID is required' });
    }

    if (!category || typeof category !== 'string') {
      console.log('Assign passage failed: Valid category required');
      return res.status(400).json({ message: 'Valid category is required' });
    }

    const sanitizedCategory = sanitizeInput(category);
    
    // Validate category format
    const validCategories = ['SSC CGL', 'SSC CHSL', 'RRB NTPC', 'Junior Assistant', 'Junior Court Assistant', 'Superintendent'];
    if (!validCategories.includes(sanitizedCategory)) {
      console.log('Assign passage failed: Invalid category');
      return res.status(400).json({ message: 'Invalid category. Must be one of: ' + validCategories.join(', ') });
    }

    const passage = await Passage.findById(passageId);
    if (!passage) {
      console.log(`Passage not found for assignment: ${passageId}`);
      return res.status(404).json({ message: 'Passage not found' });
    }

    // Add category to testTypes if not already present
    if (!passage.testTypes.includes(sanitizedCategory)) {
      passage.testTypes.push(sanitizedCategory);
      await passage.save();
      console.log(`Passage ${passageId} assigned to category: ${sanitizedCategory}`);
    } else {
      console.log(`Passage ${passageId} already assigned to category: ${sanitizedCategory}`);
    }

    res.status(200).json({ 
      message: 'Passage assigned successfully', 
      passage: passage 
    });
  } catch (error) {
    console.error('Error assigning passage:', error.message, error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Bulk import passages
const bulkImportPassages = async (req, res) => {
  try {
    const { passages } = req.body;
    
    if (!passages || !Array.isArray(passages)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data format. Expected an array of passages.'
      });
    }

    if (passages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No passages provided for import.'
      });
    }

    if (passages.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Cannot import more than 100 passages at once.'
      });
    }

    const results = {
      success: 0,
      failed: 0,
      errors: []
    };

    const createdPassages = [];

    for (let i = 0; i < passages.length; i++) {
      const passageData = passages[i];
      
      try {
        // Validate required fields
        if (!passageData.title || !passageData.content) {
          results.failed++;
          results.errors.push(`Row ${i + 1}: Missing title or content`);
          continue;
        }

        // Sanitize and validate data
        const title = passageData.title.trim();
        const content = passageData.content.trim();
        
        if (title.length < 3 || title.length > 200) {
          results.failed++;
          results.errors.push(`Row ${i + 1}: Title must be between 3 and 200 characters`);
          continue;
        }

        if (content.length < 10 || content.length > 10000) {
          results.failed++;
          results.errors.push(`Row ${i + 1}: Content must be between 10 and 10000 characters`);
          continue;
        }

        // Check for duplicate title
        const existingPassage = await Passage.findOne({ 
          title: { $regex: new RegExp(`^${title}$`, 'i') }
        });

        if (existingPassage) {
          results.failed++;
          results.errors.push(`Row ${i + 1}: Passage with title "${title}" already exists`);
          continue;
        }

        // Create new passage
        const newPassage = new Passage({
          title,
          content,
          testType: passageData.testType || 'general',
          difficulty: passageData.difficulty || 'medium',
          language: passageData.language || 'english',
          wordCount: content.split(/\s+/).length,
          isActive: true,
          createdBy: req.user.id
        });

        const savedPassage = await newPassage.save();
        createdPassages.push(savedPassage);
        results.success++;

      } catch (error) {
        results.failed++;
        results.errors.push(`Row ${i + 1}: ${error.message}`);
      }
    }

    // Return results
    res.status(200).json({
      success: true,
      message: `Import completed. ${results.success} passages imported successfully, ${results.failed} failed.`,
      data: {
        ...results,
        importedPassages: createdPassages.map(p => ({
          id: p._id,
          title: p.title
        }))
      }
    });

  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during bulk import.',
      error: error.message
    });
  }
};

module.exports = {
  getAllPassages,
  getPassageById,
  createPassage,
  updatePassage,
  deletePassage,
  getPassagesByTestType,
  assignPassage,
  bulkImportPassages
};