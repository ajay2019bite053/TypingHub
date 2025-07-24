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
    console.log('Fetching all passages...');
    const passages = await Passage.find().sort({ createdAt: -1 });
    console.log(`Successfully fetched ${passages.length} passages`);
    res.status(200).json(passages);
  } catch (error) {
    console.error('Error in getAllPassages:', error);
    res.status(500).json({ 
      message: 'Failed to fetch passages',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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
  console.log('Create passage called with body:', JSON.stringify(req.body, null, 2));
  console.log('User info:', req.user ? req.user.email : 'No user info');
  console.log('Admin info:', req.admin ? req.admin.email : 'No admin info');
  
  try {
    const { title, content } = req.body;

    // Validate title
    const titleValidation = validateTitle(title);
    if (!titleValidation.isValid) {
      console.log('Title validation failed:', titleValidation.message);
      return res.status(400).json({ message: titleValidation.message });
    }

    // Validate content
    const contentValidation = validateContent(content);
    if (!contentValidation.isValid) {
      console.log('Content validation failed:', contentValidation.message);
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
      console.log('Duplicate title found:', existingPassage.title);
      return res.status(409).json({ message: 'A passage with this title already exists' });
    }

    const passage = new Passage({ 
      title: sanitizedTitle, 
      content: sanitizedContent, 
      testTypes: [] 
    });
    
    console.log('Attempting to save passage:', {
      title: sanitizedTitle,
      contentLength: sanitizedContent.length
    });
    
    await passage.save();
    console.log('Passage created successfully:', passage._id);
    res.status(201).json(passage);
  } catch (error) {
    console.error('Error creating passage:', {
      error: error.message,
      stack: error.stack,
      body: req.body
    });
    res.status(500).json({ 
      message: 'Failed to create passage',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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
    console.log(`Fetching passages for test type: ${testType}`);

    if (!testType || typeof testType !== 'string') {
      console.log('Invalid test type provided:', testType);
      return res.status(400).json({ message: 'Valid test type is required' });
    }

    const sanitizedTestType = sanitizeInput(testType);
    console.log(`Sanitized test type: ${sanitizedTestType}`);
    
    // Case-insensitive search for test type
    const passages = await Passage.find({
      testTypes: { 
        $regex: new RegExp(`^${sanitizedTestType}$`, 'i')
      }
    }).sort({ createdAt: -1 });
    
    console.log(`Found ${passages.length} passages for test type ${sanitizedTestType}`);
    res.status(200).json(passages);
  } catch (error) {
    console.error('Error in getPassagesByTestType:', error);
    res.status(500).json({ 
      message: 'Failed to fetch passages by test type',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Assign passage to test type (protected)
const assignPassage = async (req, res) => {
  try {
    console.log('Assign passage request:', JSON.stringify(req.body, null, 2));
    const { passageId, categories } = req.body;

    if (!passageId || typeof passageId !== 'string') {
      console.log('Assign passage failed: Valid passageId required');
      return res.status(400).json({ message: 'Valid passage ID is required' });
    }

    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      console.log('Assign passage failed: Valid categories array required');
      return res.status(400).json({ message: 'Valid categories array is required' });
    }
    
    // Validate all categories
    const validCategories = [
      'SSC CGL',
      'SSC CHSL',
      'RRB NTPC',
      'Junior Assistant',
      'Junior Court Assistant',
      'Superintendent',
      'Certificate Test',
      'Create Test',
      'Typing Test',
      'UP Police',
      'Bihar Police',
      'AIIMS CRC',
      'Allahabad High Court'
    ];

    const sanitizedCategories = categories.map(cat => sanitizeInput(cat));
    console.log('Sanitized categories:', sanitizedCategories);
    
    // Case-insensitive category validation
    for (const category of sanitizedCategories) {
      const isValid = validCategories.some(validCat => 
        validCat.toLowerCase() === category.toLowerCase()
      );
      if (!isValid) {
        console.log('Invalid category:', category);
        return res.status(400).json({ 
          message: 'Invalid category. Must be one of: ' + validCategories.join(', '),
          invalidCategory: category
        });
      }
    }

    const passage = await Passage.findById(passageId);
    if (!passage) {
      console.log(`Passage not found for assignment: ${passageId}`);
      return res.status(404).json({ message: 'Passage not found' });
    }

    // Add categories to testTypes if not already present (case-insensitive)
    const newCategories = sanitizedCategories.filter(cat => {
      return !passage.testTypes.some(existingCat => 
        existingCat.toLowerCase() === cat.toLowerCase()
      );
    });

    if (newCategories.length > 0) {
      passage.testTypes.push(...newCategories);
      await passage.save();
      console.log(`Passage ${passageId} assigned to categories:`, newCategories);
    } else {
      console.log(`Passage ${passageId} already assigned to all requested categories`);
    }

    res.status(200).json({ 
      message: 'Passage assigned successfully', 
      passage: passage,
      newlyAssigned: newCategories
    });
  } catch (error) {
    console.error('Error assigning passage:', {
      error: error.message,
      stack: error.stack,
      body: req.body
    });
    res.status(500).json({ 
      message: 'Failed to assign passage',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Unassign passage from test type (protected)
const unassignPassage = async (req, res) => {
  try {
    const { passageId, categories } = req.body;

    if (!passageId || typeof passageId !== 'string') {
      console.log('Unassign passage failed: Valid passageId required');
      return res.status(400).json({ message: 'Valid passage ID is required' });
    }

    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      console.log('Unassign passage failed: Valid categories array required');
      return res.status(400).json({ message: 'Valid categories array is required' });
    }

    // Validate all categories
    const validCategories = [
      'SSC CGL',
      'SSC CHSL',
      'RRB NTPC',
      'Junior Assistant',
      'Junior Court Assistant',
      'Superintendent',
      'Certificate Test',
      'Create Test',
      'Typing Test',
      'UP Police',
      'Bihar Police',
      'AIIMS CRC',
      'Allahabad High Court'
    ];
    const sanitizedCategories = categories.map(cat => sanitizeInput(cat));
    
    for (const category of sanitizedCategories) {
      if (!validCategories.includes(category)) {
        console.log('Unassign passage failed: Invalid category');
        return res.status(400).json({ message: 'Invalid category. Must be one of: ' + validCategories.join(', ') });
      }
    }

    const passage = await Passage.findById(passageId);
    if (!passage) {
      console.log(`Passage not found for unassignment: ${passageId}`);
      return res.status(404).json({ message: 'Passage not found' });
    }

    // Remove categories from testTypes
    const originalLength = passage.testTypes.length;
    passage.testTypes = passage.testTypes.filter(cat => !sanitizedCategories.includes(cat));
    
    if (passage.testTypes.length < originalLength) {
      await passage.save();
      const removedCategories = sanitizedCategories.filter(cat => 
        passage.testTypes.indexOf(cat) === -1
      );
      console.log(`Passage ${passageId} unassigned from categories: ${removedCategories.join(', ')}`);
    } else {
      console.log(`Passage ${passageId} was not assigned to any of the requested categories`);
    }

    res.status(200).json({ 
      message: 'Passage unassigned successfully', 
      passage: passage,
      removedCategories: sanitizedCategories.filter(cat => 
        passage.testTypes.indexOf(cat) === -1
      )
    });
  } catch (error) {
    console.error('Error unassigning passage:', error.message, error.stack);
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
  unassignPassage,
  bulkImportPassages
};