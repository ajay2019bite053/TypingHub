const Competition = require('../models/Competition');
const CompetitionRegistration = require('../models/CompetitionRegistration');
// Temporary fix for http-status-codes import issue
const StatusCodes = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};
const PDFDocument = require('pdfkit');

// Advanced Scoring Functions for Competition Ranking
const calculateSpeedScore = (grossSpeed, netSpeed, timeTaken) => {
  // Base speed score (0-100)
  let baseScore = Math.min(100, (netSpeed / 80) * 100); // 80 WPM = 100 points
  
  // Bonus for gross speed vs net speed ratio (efficiency)
  const efficiencyRatio = netSpeed > 0 ? grossSpeed / netSpeed : 1;
  if (efficiencyRatio <= 1.1) {
    baseScore += 10; // Perfect efficiency bonus
  } else if (efficiencyRatio <= 1.3) {
    baseScore += 5; // Good efficiency bonus
  }
  
  // Time bonus (faster completion = higher score)
  const timeBonus = Math.max(0, (600 - timeTaken) / 600 * 20); // Up to 20 points for speed
  
  return Math.min(100, baseScore + timeBonus);
};

const calculateAccuracyScore = (accuracy, mistakes, backspaces, totalWords) => {
  // Base accuracy score
  let baseScore = accuracy;
  
  // Penalty for mistakes (each mistake reduces score by 2 points)
  const mistakePenalty = Math.min(20, mistakes * 2);
  
  // Penalty for backspaces (each backspace reduces score by 1 point)
  const backspacePenalty = Math.min(15, backspaces * 1);
  
  // Bonus for perfect accuracy
  if (accuracy === 100) baseScore += 10;
  else if (accuracy >= 95) baseScore += 5;
  
  return Math.max(0, Math.min(100, baseScore - mistakePenalty - backspacePenalty));
};

const calculateEfficiencyScore = (mistakes, backspaces, totalWords, correctWords) => {
  let score = 100;
  
  // Penalty for mistakes (more mistakes = lower efficiency)
  if (totalWords > 0) {
    const mistakeRate = mistakes / totalWords;
    if (mistakeRate > 0.1) score -= 30; // More than 10% mistakes
    else if (mistakeRate > 0.05) score -= 20; // More than 5% mistakes
    else if (mistakeRate > 0.02) score -= 10; // More than 2% mistakes
  }
  
  // Penalty for excessive backspaces
  if (totalWords > 0) {
    const backspaceRate = backspaces / totalWords;
    if (backspaceRate > 0.2) score -= 25; // More than 20% backspaces
    else if (backspaceRate > 0.1) score -= 15; // More than 10% backspaces
    else if (backspaceRate > 0.05) score -= 5; // More than 5% backspaces
  }
  
  // Bonus for high correct word ratio
  if (totalWords > 0) {
    const correctRatio = correctWords / totalWords;
    if (correctRatio >= 0.95) score += 15;
    else if (correctRatio >= 0.9) score += 10;
    else if (correctRatio >= 0.8) score += 5;
  }
  
  return Math.max(0, Math.min(100, score));
};

const calculateCompletionScore = (totalWords, timeTaken, expectedWords = 150) => {
  // Base completion percentage
  let completionPercent = Math.min(100, (totalWords / expectedWords) * 100);
  
  // Bonus for completing more than expected
  if (totalWords > expectedWords) {
    completionPercent += Math.min(20, (totalWords - expectedWords) / expectedWords * 100);
  }
  
  // Time efficiency bonus (completing faster than expected)
  const expectedTime = 600; // 10 minutes
  if (timeTaken < expectedTime) {
    const timeBonus = ((expectedTime - timeTaken) / expectedTime) * 15;
    completionPercent += timeBonus;
  }
  
  return Math.min(100, completionPercent);
};

const calculateRanks = (results) => {
  // Sort results by final score (descending) and then by time taken (ascending for tie-breaks)
  const sortedResults = results.sort((a, b) => {
    if (b.finalScore !== a.finalScore) {
      return b.finalScore - a.finalScore; // Higher score first
    }
    // If scores are equal, faster time gets higher rank
    return a.timeTaken - b.timeTaken;
  });
  
  // Assign ranks
  let currentRank = 1;
  let previousScore = null;
  let previousTime = null;
  
  sortedResults.forEach((result, index) => {
    // Check if this result should have the same rank as the previous one
    if (previousScore !== null && 
        result.finalScore === previousScore && 
        result.timeTaken === previousTime) {
      // Same rank for same score and time
      result.rank = currentRank;
    } else {
      // New rank
      currentRank = index + 1;
      result.rank = currentRank;
      previousScore = result.finalScore;
      previousTime = result.timeTaken;
    }
  });
  
  console.log('Ranks calculated:', sortedResults.map(r => ({ 
    name: r.name, 
    finalScore: r.finalScore, 
    rank: r.rank,
    timeTaken: r.timeTaken 
  })));
  
  // Verify all results have ranks
  const resultsWithoutRanks = sortedResults.filter(r => r.rank === undefined);
  if (resultsWithoutRanks.length > 0) {
    console.error('Some results missing ranks:', resultsWithoutRanks);
  }
  
  return sortedResults;
};

// Get current competition status
const getCompetitionStatus = async (req, res) => {
  try {
    let competition = await Competition.findOne({}).sort({ createdAt: -1 });
    
    if (!competition) {
      // Create a default competition if none exists
      competition = new Competition({
        isRegistrationActive: true,
        isCompetitionActive: false,
        entryFee: 10,
        maxSlots: 100,
        minSlots: 10,
        prizes: {
          first: 100,
          second: 50,
          third: 25
        },
        status: 'registration',
        totalRegistrations: 0,
        totalParticipants: 0
      });
      await competition.save();
    }

    const responseData = {
      isRegistrationActive: competition.isRegistrationActive,
      isCompetitionActive: competition.isCompetitionActive,
      entryFee: competition.entryFee,
      maxSlots: competition.maxSlots,
      minSlots: competition.minSlots,
      prizes: competition.prizes,
      totalRegistrations: competition.totalRegistrations,
      totalParticipants: competition.totalParticipants,
      status: competition.status,
      resultsPublished: competition.resultsPublished || false,
      passage: competition.passage || '' // Added passage to response
    };
    
    // console.log('getCompetitionStatus: Returning data:', responseData);
    // console.log('getCompetitionStatus: resultsPublished value:', competition.resultsPublished);
    
    res.status(StatusCodes.OK).json({
      success: true,
      data: responseData
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error fetching competition status',
      error: error.message
    });
  }
};

// Register for competition
const registerForCompetition = async (req, res) => {
  try {
    console.log('Registration request body:', req.body);
    console.log('Request headers:', req.headers);
    const { name, mobile, paymentId, paymentAmount } = req.body;

    // Validate input
    if (!name || !mobile) {
      console.log('Validation failed: missing name or mobile');
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Please provide name and mobile number'
      });
    }

    // Get current competition
    const competition = await Competition.findOne({}).sort({ createdAt: -1 });
    if (!competition) {
      console.log('No competition found');
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'No active competition found'
      });
    }

    console.log('Competition found:', {
      entryFee: competition.entryFee,
      isRegistrationActive: competition.isRegistrationActive,
      totalRegistrations: competition.totalRegistrations,
      maxSlots: competition.maxSlots
    });

    // Check if registration is active
    if (!competition.isRegistrationActive) {
      console.log('Registration not active');
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Registration is not active'
      });
    }

    // Check if slots are available
    if (competition.totalRegistrations >= competition.maxSlots) {
      console.log('All slots filled');
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'All slots are filled'
      });
    }

    // Check if user already registered
    const existingRegistration = await CompetitionRegistration.findOne({
      mobile,
      competitionId: competition._id
    });

    if (existingRegistration) {
      console.log('User already registered');
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'You are already registered for this competition'
      });
    }

    // Handle free vs paid competitions
    console.log('Processing competition type:', {
      entryFee: competition.entryFee,
      paymentId: paymentId,
      paymentAmount: paymentAmount
    });

    if (competition.entryFee > 0) {
      // Paid competition - require payment details
      console.log('Paid competition detected');
      if (!paymentId || !paymentAmount) {
        console.log('Payment details missing for paid competition');
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Payment details required for paid competition'
        });
      }
      
      if (paymentAmount !== competition.entryFee) {
        console.log('Payment amount mismatch');
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: `Payment amount must be ₹${competition.entryFee}`
        });
      }
    } else {
      // Free competition - no payment required
      console.log('Free competition detected - no payment required');
    }

    // Create registration
    const registrationData = {
      name,
      mobile,
      competitionId: competition._id,
      paymentId: paymentId || 'FREE_COMPETITION',
      paymentAmount: paymentAmount || 0,
      paymentStatus: competition.entryFee > 0 ? 'completed' : 'free'
    };
    
    console.log('Creating registration with data:', registrationData);
    
    const registration = new CompetitionRegistration(registrationData);

    await registration.save();
    console.log('Registration saved successfully');

    // Update competition stats
    competition.totalRegistrations += 1;
    await competition.save();

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: competition.entryFee > 0 ? 'Registration successful' : 'Free registration successful',
      data: {
        secretId: registration.secretId,
        name: registration.name,
        mobile: registration.mobile,
        isFree: competition.entryFee === 0
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error registering for competition',
      error: error.message
    });
  }
};

// Join live competition
const joinCompetition = async (req, res) => {
  try {
    const { name, secretId } = req.body;

    // Validate input
    if (!name || !secretId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Please provide name and secret ID'
      });
    }

    // Get current competition
    const competition = await Competition.findOne({}).sort({ createdAt: -1 });
    if (!competition) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'No active competition found'
      });
    }

    // Check if competition is active
    if (!competition.isCompetitionActive) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Competition is not active yet'
      });
    }

    // Find registration
    const registration = await CompetitionRegistration.findOne({
      secretId,
      competitionId: competition._id
    });

    if (!registration) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid secret ID'
      });
    }

    // Check if already attempted
    if (registration.hasAttempted) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'You have already attempted this competition'
      });
    }

    // Check if name matches
    if (registration.name.toLowerCase() !== name.toLowerCase()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Name does not match with registration'
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Competition joined successfully',
      data: {
        secretId: registration.secretId,
        name: registration.name,
        competitionId: competition._id,
        passage: competition.passage // Return the competition passage
      }
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error joining competition',
      error: error.message
    });
  }
};

// Submit competition result
const submitCompetitionResult = async (req, res) => {
  try {
    console.log('Competition result submission request:', req.body);
    
    const { 
      secretId, 
      name, // Add name field
      grossSpeed, 
      netSpeed, 
      accuracy, 
      wordAccuracy,
      mistakes, 
      backspaces, 
      totalWords, 
      correctWords, 
      incorrectWords, 
      timeTaken 
    } = req.body;

    // Validate input
    console.log('Validation check:', { secretId, name, netSpeed, accuracy, timeTaken });
    console.log('Data types:', { 
      secretId: typeof secretId, 
      name: typeof name,
      netSpeed: typeof netSpeed, 
      accuracy: typeof accuracy, 
      timeTaken: typeof timeTaken 
    });
    
    if (!secretId || !name || netSpeed === undefined || accuracy === undefined || timeTaken === undefined) {
      console.log('Validation failed: missing required fields');
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }
    
    // Validate data types and ranges
    if (typeof netSpeed !== 'number' || netSpeed < 0) {
      console.log('Validation failed: invalid netSpeed:', netSpeed);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid net speed value'
      });
    }
    
    if (typeof accuracy !== 'number' || accuracy < 0 || accuracy > 100) {
      console.log('Validation failed: invalid accuracy:', accuracy);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid accuracy value (must be 0-100)'
      });
    }
    
    if (typeof timeTaken !== 'number' || timeTaken < 0) {
      console.log('Validation failed: invalid timeTaken:', timeTaken);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid time taken value'
      });
    }
    
    // Allow 0 values for optional fields
    console.log('Allowing 0 values for:', { mistakes, backspaces, totalWords, correctWords, incorrectWords });

    // Get current competition
    const competition = await Competition.findOne({}).sort({ createdAt: -1 });
    if (!competition) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'No active competition found'
      });
    }

    // Find registration
    const registration = await CompetitionRegistration.findOne({
      secretId,
      competitionId: competition._id
    });

    if (!registration) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid secret ID'
      });
    }

    // Check if already attempted
    if (registration.hasAttempted) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'You have already submitted your result'
      });
    }

    // Check if name matches
    if (registration.name.toLowerCase() !== name.toLowerCase()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Name does not match with registration'
      });
    }

    // Calculate comprehensive scores with advanced ranking algorithm
    console.log('Calculating scores for:', {
      grossSpeed, netSpeed, accuracy, mistakes, backspaces, 
      totalWords, correctWords, incorrectWords, timeTaken
    });
    
    // 1. SPEED SCORE (40% weight)
    const speedScore = calculateSpeedScore(grossSpeed, netSpeed, timeTaken);
    console.log('Speed score calculated:', speedScore);
    
    // 2. ACCURACY SCORE (30% weight) 
    const accuracyScore = calculateAccuracyScore(accuracy, mistakes, backspaces, totalWords);
    console.log('Accuracy score calculated:', accuracyScore);
    
    // 3. EFFICIENCY SCORE (20% weight)
    const efficiencyScore = calculateEfficiencyScore(mistakes, backspaces, totalWords, correctWords);
    console.log('Efficiency score calculated:', efficiencyScore);
    
    // 4. COMPLETION SCORE (10% weight)
    const completionScore = calculateCompletionScore(totalWords, timeTaken, 150);
    console.log('Completion score calculated:', completionScore);
    
    // Calculate final weighted score
    const finalScore = Math.round(
      (speedScore * 0.4) + (accuracyScore * 0.3) + (efficiencyScore * 0.2) + (completionScore * 0.1)
    );
    
    console.log('Calculated scores:', {
      speedScore: Math.round(speedScore * 100) / 100,
      accuracyScore: Math.round(accuracyScore * 100) / 100,
      efficiencyScore: Math.round(efficiencyScore * 100) / 100,
      completionScore: Math.round(completionScore * 100) / 100,
      finalScore
    });
    
    console.log('Score calculation breakdown:', {
      speedScoreContribution: speedScore * 0.4,
      accuracyScoreContribution: accuracyScore * 0.3,
      efficiencyScoreContribution: efficiencyScore * 0.2,
      completionScoreContribution: completionScore * 0.1,
      finalScoreCalculation: (speedScore * 0.4) + (accuracyScore * 0.3) + (efficiencyScore * 0.2) + (completionScore * 0.1)
    });

    // Update registration with comprehensive result
    registration.hasAttempted = true;
    registration.testResult = {
      grossSpeed: grossSpeed || netSpeed,
      netSpeed,
      accuracy,
      wordAccuracy: wordAccuracy || accuracy,
      mistakes: mistakes || 0,
      backspaces: backspaces || 0,
      totalWords: totalWords || 0,
      correctWords: correctWords || 0,
      incorrectWords: incorrectWords || 0,
      timeTaken,
      speed: netSpeed, // Add the required speed field
      submittedAt: new Date()
    };
    registration.attemptedAt = new Date();

    console.log('Saving registration with result:', registration.testResult);
    try {
    await registration.save();
      console.log('Registration saved successfully');
    } catch (saveError) {
      console.error('Error saving registration:', saveError);
      throw saveError;
    }

    // Add comprehensive result to competition
    console.log('Adding result to competition:', {
      secretId: registration.secretId,
      netSpeed,
      accuracy,
      timeTaken
    });
    competition.results.push({
      secretId: registration.secretId,
      name: registration.name,
      mobile: registration.mobile,
      grossSpeed: grossSpeed || netSpeed,
      netSpeed,
      accuracy,
      wordAccuracy: wordAccuracy || accuracy,
      mistakes: mistakes || 0,
      backspaces: backspaces || 0,
      totalWords: totalWords || 0,
      correctWords: correctWords || 0,
      incorrectWords: incorrectWords || 0,
      timeTaken,
      speed: netSpeed, // Add the required speed field
      speedScore: Math.round(speedScore * 100) / 100,
      accuracyScore: Math.round(accuracyScore * 100) / 100,
      efficiencyScore: Math.round(efficiencyScore * 100) / 100,
      completionScore: Math.round(completionScore * 100) / 100,
      finalScore: Math.round(finalScore * 100) / 100,
      submittedAt: new Date()
    });

    competition.totalParticipants += 1;
    
    // Calculate and assign ranks to all participants
    const rankedResults = calculateRanks([...competition.results]); // Create a copy to avoid mutation
    competition.results = rankedResults;
    
    console.log('Saving competition with updated results and ranks');
    try {
    await competition.save();
      console.log('Competition saved successfully with ranks');
    } catch (saveError) {
      console.error('Error saving competition:', saveError);
      throw saveError;
    }

    // Find the current user's rank
    const userResult = competition.results.find(r => r.secretId === secretId);
    const userRank = userResult ? userResult.rank : 'N/A';
    
    console.log('User result found:', userResult);
    console.log('User rank assigned:', userRank);
    console.log('All results with ranks:', competition.results.map(r => ({ 
      secretId: r.secretId, 
      name: r.name, 
      rank: r.rank, 
      finalScore: r.finalScore 
    })));
    
    // Prepare response data
    const responseData = {
        grossSpeed: grossSpeed || netSpeed,
        netSpeed,
        accuracy,
        wordAccuracy: wordAccuracy || accuracy,
        mistakes: mistakes || 0,
        backspaces: backspaces || 0,
        totalWords: totalWords || 0,
        correctWords: correctWords || 0,
        incorrectWords: incorrectWords || 0,
        timeTaken,
      speedScore: Math.round(speedScore * 100) / 100,
      accuracyScore: Math.round(accuracyScore * 100) / 100,
      efficiencyScore: Math.round(efficiencyScore * 100) / 100,
      completionScore: Math.round(completionScore * 100) / 100,
      finalScore,
      rank: userRank,
      totalParticipants: competition.totalParticipants
    };
    
    console.log('Sending response data:', responseData);
    console.log('Response data types:', {
      speedScore: typeof responseData.speedScore,
      accuracyScore: typeof responseData.accuracyScore,
      efficiencyScore: typeof responseData.efficiencyScore,
      completionScore: typeof responseData.completionScore,
      finalScore: typeof responseData.finalScore,
      rank: typeof responseData.rank
    });
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Result submitted successfully',
      data: responseData
    });
  } catch (error) {
    console.error('Error in submitCompetitionResult:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error submitting result',
      error: error.message
    });
  }
};

// Admin: Get all registrations
const getAllRegistrations = async (req, res) => {
  try {
    const competition = await Competition.findOne({}).sort({ createdAt: -1 });
    if (!competition) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'No competition found'
      });
    }

    const registrations = await CompetitionRegistration.find({
      competitionId: competition._id
    }).sort({ registeredAt: -1 });

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        competition: {
          title: competition.title,
          entryFee: competition.entryFee,
          maxSlots: competition.maxSlots,
          prizes: competition.prizes,
          totalRegistrations: competition.totalRegistrations,
          totalParticipants: competition.totalParticipants,
          status: competition.status
        },
        registrations
      }
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error fetching registrations',
      error: error.message
    });
  }
};

// Public: Get published competition results
const getPublicResults = async (req, res) => {
  try {
    console.log('getPublicResults called');
    const competition = await Competition.findOne({}).sort({ createdAt: -1 });
    if (!competition) {
      console.log('No competition found');
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'No competition found'
      });
    }
    
    console.log('Competition found:', {
      title: competition.title,
      resultsPublished: competition.resultsPublished,
      totalResults: competition.results?.length || 0
    });

    // Check if results are published
    if (!competition.resultsPublished) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Results are not yet published'
      });
    }

    // Sort results by comprehensive final score (descending)
    const sortedResults = competition.results.sort((a, b) => {
      // Primary sort by final score
      if (b.finalScore !== a.finalScore) {
        return b.finalScore - a.finalScore;
      }
      // Secondary sort by net speed if final scores are equal
      if (b.netSpeed !== a.netSpeed) {
        return b.netSpeed - a.netSpeed;
      }
      // Tertiary sort by accuracy if speeds are equal
      return b.accuracy - a.accuracy;
    });

    // Assign ranks and prizes
    console.log('Processing results:', sortedResults.length);
    const resultsWithRanks = sortedResults.map((result, index) => {
      let rank = index + 1;
      let prize = 0;

      if (rank === 1) prize = competition.prizes?.first || 0;
      else if (rank === 2) prize = competition.prizes?.second || 0;
      else if (rank === 3) prize = competition.prizes?.third || 0;

      const processedResult = {
        rank,
        name: result.name,
        mobile: result.mobile,
        grossSpeed: result.grossSpeed,
        netSpeed: result.netSpeed,
        accuracy: result.accuracy,
        wordAccuracy: result.wordAccuracy || result.accuracy,
        mistakes: result.mistakes || 0,
        backspaces: result.backspaces || 0,
        totalWords: result.totalWords || 0,
        correctWords: result.correctWords || 0,
        incorrectWords: result.incorrectWords || 0,
        speedScore: result.speedScore || 0,
        accuracyScore: result.accuracyScore || 0,
        efficiencyScore: result.efficiencyScore || 0,
        completionScore: result.completionScore || 0,
        finalScore: result.finalScore,
        timeTaken: result.timeTaken,
        prize,
        submittedAt: result.submittedAt
      };
      
      console.log(`Result ${index + 1}:`, {
        name: processedResult.name,
        finalScore: processedResult.finalScore,
        speedScore: processedResult.speedScore,
        accuracyScore: processedResult.accuracyScore
      });
      
      return processedResult;
    });

    const responseData = {
      success: true,
      data: {
        competition: {
          title: competition.title || 'Weekly Competition',
          prizes: competition.prizes || { first: 0, second: 0, third: 0 },
          totalParticipants: competition.totalParticipants
        },
        results: resultsWithRanks
      }
    };
    
    console.log('Sending response with', resultsWithRanks.length, 'results');
    console.log('Sample result data:', resultsWithRanks[0]);
    
    res.status(StatusCodes.OK).json(responseData);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error fetching results',
      error: error.message
    });
  }
};

// Admin: Get competition results
const getCompetitionResults = async (req, res) => {
  try {
    const competition = await Competition.findOne({}).sort({ createdAt: -1 });
    if (!competition) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'No competition found'
      });
    }

    // Sort results by comprehensive final score (descending)
    const sortedResults = competition.results.sort((a, b) => {
      // Primary sort by final score
      if (b.finalScore !== a.finalScore) {
        return b.finalScore - a.finalScore;
      }
      // Secondary sort by net speed if final scores are equal
      if (b.netSpeed !== a.netSpeed) {
        return b.netSpeed - a.netSpeed;
      }
      // Tertiary sort by accuracy if speeds are equal
      return b.accuracy - a.accuracy;
    });

    // Assign ranks and prizes
    const resultsWithRanks = sortedResults.map((result, index) => {
      let rank = index + 1;
      let prize = 0;

      if (rank === 1) prize = competition.prizes.first;
      else if (rank === 2) prize = competition.prizes.second;
      else if (rank === 3) prize = competition.prizes.third;

      return {
        ...result.toObject(),
        rank,
        prize
      };
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        competition: {
          title: competition.title,
          prizes: competition.prizes,
          totalParticipants: competition.totalParticipants
        },
        results: resultsWithRanks
      }
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error fetching results',
      error: error.message
    });
  }
};

// Admin: Update competition settings
const updateCompetitionSettings = async (req, res) => {
  try {
    console.log('updateCompetitionSettings: Request received');
    console.log('updateCompetitionSettings: Request body:', req.body);
    console.log('updateCompetitionSettings: Request headers:', req.headers);
    
    const {
      isRegistrationActive,
      isCompetitionActive,
      entryFee,
      maxSlots,
      minSlots,
      prizes,
      passage,
      status,
      forceActivate,
      resultsPublished
    } = req.body;

    let competition = await Competition.findOne({}).sort({ createdAt: -1 });
    
    console.log('updateCompetitionSettings: Found competition:', {
      _id: competition?._id,
      resultsPublished: competition?.resultsPublished,
      isRegistrationActive: competition?.isRegistrationActive,
      isCompetitionActive: competition?.isCompetitionActive
    });
    
    // Validate minimum slots requirement when trying to activate competition
    // Allow force activation for testing purposes
    if (isCompetitionActive && competition && !forceActivate && competition.totalRegistrations < (minSlots || competition.minSlots)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: `Cannot activate competition. Minimum ${minSlots || competition.minSlots} registrations required. Current registrations: ${competition.totalRegistrations}. Use forceActivate: true to bypass this check for testing.`
      });
    }
    
    if (!competition) {
      // Create new competition if none exists
      competition = new Competition({
        isRegistrationActive,
        isCompetitionActive,
        entryFee,
        maxSlots,
        minSlots,
        prizes,
        passage,
        status,
        resultsPublished: false
      });
    } else {
      // Update existing competition
      console.log('updateCompetitionSettings: Updating existing competition');
      if (isRegistrationActive !== undefined) {
        console.log('Updating isRegistrationActive from', competition.isRegistrationActive, 'to', isRegistrationActive);
        competition.isRegistrationActive = isRegistrationActive;
      }
      if (isCompetitionActive !== undefined) {
        console.log('Updating isCompetitionActive from', competition.isCompetitionActive, 'to', isCompetitionActive);
        competition.isCompetitionActive = isCompetitionActive;
      }
      if (entryFee !== undefined) competition.entryFee = entryFee;
      if (maxSlots !== undefined) competition.maxSlots = maxSlots;
      if (minSlots !== undefined) competition.minSlots = minSlots;
      if (prizes !== undefined) competition.prizes = prizes;
      if (passage !== undefined) competition.passage = passage;
      if (status !== undefined) competition.status = status;
      if (resultsPublished !== undefined) {
        console.log('Updating resultsPublished from', competition.resultsPublished, 'to', resultsPublished);
        competition.resultsPublished = resultsPublished;
      }
    }

    await competition.save();
    
    console.log('updateCompetitionSettings: Competition saved successfully');
    console.log('updateCompetitionSettings: Final resultsPublished value:', competition.resultsPublished);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Competition settings updated successfully',
      data: competition
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error updating competition settings',
      error: error.message
    });
  }
};

// Admin: Delete all registrations
const deleteAllRegistrations = async (req, res) => {
  try {
    const competition = await Competition.findOne({}).sort({ createdAt: -1 });
    if (!competition) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'No competition found'
      });
    }

    // Delete all registrations for this competition
    const result = await CompetitionRegistration.deleteMany({
      competitionId: competition._id
    });

    // Clear all results and reset competition counters
    competition.results = [];
    competition.totalRegistrations = 0;
    competition.totalParticipants = 0;
    competition.resultsPublished = false;
    
    console.log('Deleting all registrations and results from competition:', competition._id);
    console.log('Deleted registrations count:', result.deletedCount);
    console.log('Results array length before deletion:', competition.results.length);
    console.log('Competition object before save:', {
      _id: competition._id,
      resultsLength: competition.results.length,
      totalRegistrations: competition.totalRegistrations,
      totalParticipants: competition.totalParticipants,
      resultsPublished: competition.resultsPublished
    });
    
    await competition.save();
    
    console.log('Registrations and results deleted successfully. New results array length:', competition.results.length);
    console.log('Competition object after save:', {
      _id: competition._id,
      resultsLength: competition.results.length,
      totalRegistrations: competition.totalRegistrations,
      totalParticipants: competition.totalParticipants,
      resultsPublished: competition.resultsPublished
        });

    // Verify deletion was successful
    const verification = await Competition.findById(competition._id);
    console.log('Verification after deletion (deleteAllRegistrations):', {
      _id: verification._id,
      resultsLength: verification.results.length,
      totalRegistrations: verification.totalRegistrations,
      totalParticipants: verification.totalParticipants,
      resultsPublished: verification.resultsPublished
    });
    
    if (verification.results.length > 0) {
      console.error('Results deletion verification failed. Results still exist:', verification.results.length);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Results deletion verification failed'
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'All registrations and results deleted successfully',
      data: {
        deletedRegistrationsCount: result.deletedCount,
        deletedResultsCount: competition.results.length,
        verification: 'Results array cleared successfully'
      }
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error deleting registrations',
      error: error.message
    });
  }
};

// Admin: Delete all results
const deleteAllResults = async (req, res) => {
  try {
    const competition = await Competition.findOne({}).sort({ createdAt: -1 });
    if (!competition) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'No competition found'
      });
    }

    // Update all registrations to remove test results
    await CompetitionRegistration.updateMany(
      { competitionId: competition._id },
      { 
        $unset: { 
          testResult: 1,
          rank: 1,
          prize: 1,
          attemptedAt: 1
        },
        $set: { hasAttempted: false }
      }
    );

    // Clear all results from competition and reset counters
    competition.results = [];
    competition.totalParticipants = 0;
    competition.resultsPublished = false;
    
    console.log('Deleting all results from competition:', competition._id);
    console.log('Results array length before deletion:', competition.results.length);
    console.log('Competition object before save:', {
      _id: competition._id,
      resultsLength: competition.results.length,
      totalParticipants: competition.totalParticipants,
      resultsPublished: competition.resultsPublished
    });
    
    await competition.save();
    
    console.log('Results deleted successfully. New results array length:', competition.results.length);
    console.log('Competition object after save:', {
      _id: competition._id,
      resultsLength: competition.results.length,
      totalParticipants: competition.totalParticipants,
      resultsPublished: competition.resultsPublished
    });
    
    // Verify deletion was successful
    const verification = await Competition.findById(competition._id);
    console.log('Verification after deletion (deleteAllResults):', {
      _id: verification._id,
      resultsLength: verification.results.length,
      totalParticipants: verification.totalParticipants,
      resultsPublished: verification.resultsPublished
    });
    
    if (verification.results.length > 0) {
      console.error('Results deletion verification failed. Results still exist:', verification.results.length);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Results deletion verification failed'
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'All results deleted successfully',
      data: {
        deletedResultsCount: competition.results.length,
        verification: 'Results array cleared successfully'
      }
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error deleting results',
      error: error.message
    });
  }
};

// Admin: Publish results
const publishResults = async (req, res) => {
  try {
    const competition = await Competition.findOne({}).sort({ createdAt: -1 });
    if (!competition) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'No competition found'
      });
    }

    // Check if there are any results to publish
    const participants = await CompetitionRegistration.find({
      competitionId: competition._id,
      hasAttempted: true
    });

    if (participants.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'No results to publish'
      });
    }

    // Mark results as published
    competition.resultsPublished = true;
    await competition.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Results published successfully',
      data: {
        participantsCount: participants.length
      }
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error publishing results',
      error: error.message
    });
  }
};

// Admin: Unpublish results
const unpublishResults = async (req, res) => {
  try {
    console.log('unpublishResults: Request received');
    
    const competition = await Competition.findOne({}).sort({ createdAt: -1 });
    if (!competition) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'No competition found'
      });
    }

    console.log('unpublishResults: Found competition:', {
      _id: competition._id,
      resultsPublished: competition.resultsPublished
    });

    // Check if results are currently published
    if (!competition.resultsPublished) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Results are not currently published'
      });
    }

    // Mark results as unpublished
    competition.resultsPublished = false;
    await competition.save();

    console.log('unpublishResults: Results unpublished successfully');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Results unpublished successfully',
      data: {
        resultsPublished: false
      }
    });
  } catch (error) {
    console.error('unpublishResults: Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error unpublishing results',
      error: error.message
    });
  }
};

// Admin: Download results as PDF
const downloadResultsPDF = async (req, res) => {
  try {
    const competition = await Competition.findOne({}).sort({ createdAt: -1 });
    if (!competition) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'No competition found'
      });
    }

    // Get all results with ranks
    const registrations = await CompetitionRegistration.find({
      competitionId: competition._id,
      hasAttempted: true
    }).sort({ 'testResult.finalScore': -1, 'testResult.timeTaken': 1 });

    if (registrations.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'No results to download'
      });
    }

    // Calculate ranks and prizes
    const resultsWithRanks = registrations.map((registration, index) => {
      const rank = index + 1;
      let prize = 0;
      
      if (rank === 1) prize = competition.prizes.first;
      else if (rank === 2) prize = competition.prizes.second;
      else if (rank === 3) prize = competition.prizes.third;

      return {
        rank,
        name: registration.name,
        mobile: registration.mobile,
        grossSpeed: registration.testResult.grossSpeed || 0,
        netSpeed: registration.testResult.netSpeed || 0,
        accuracy: registration.testResult.accuracy || 0,
        finalScore: registration.testResult.finalScore || 0,
        timeTaken: registration.testResult.timeTaken || 0,
        prize,
        submittedAt: registration.testResult.submittedAt || new Date()
      };
    });

    // Generate proper PDF using pdfkit
    const doc = new PDFDocument({
      size: 'A4',
      margins: {
        top: 40,
        bottom: 40,
        left: 40,
        right: 40
      }
    });

    // Use the best available fonts for professional look
    doc.font('Helvetica-Bold');

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="competition-results.pdf"');
    
    // Pipe PDF to response
    doc.pipe(res);
    
    // Add company header with professional styling
    doc.fontSize(28).font('Helvetica-Bold').text('TypingHub Competition', { align: 'center' });
    doc.fontSize(22).font('Helvetica-Bold').text('Detailed Results Report', { align: 'center' });
    doc.moveDown(0.5);
    
    // Add date with better formatting
    doc.fontSize(13).font('Helvetica').text(`Generated: ${new Date().toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`, { align: 'center' });
    doc.moveDown(1);
    
    // Add competition summary with better spacing
    doc.fontSize(17).font('Helvetica-Bold').text('Competition Summary', { underline: true });
    doc.moveDown(0.5);
    
    doc.fontSize(13).font('Helvetica').text(`Entry Fee: ₹${competition.entryFee || 0}`, 50, doc.y);
    doc.fontSize(13).font('Helvetica').text(`Total Participants: ${resultsWithRanks.length}`, 50, doc.y + 30);
    doc.fontSize(13).font('Helvetica').text(`Prizes: 1st: ₹${competition.prizes?.first || 0}, 2nd: ₹${competition.prizes?.second || 0}, 3rd: ₹${competition.prizes?.third || 0}`, 50, doc.y + 60);
    
    doc.moveDown(1.5);
    
    // Add detailed results table
    doc.fontSize(17).font('Helvetica-Bold').text('Detailed Results', { underline: true });
    doc.moveDown(0.5);
    
    // Define table structure with optimized column widths
    const tableStartY = doc.y;
    const colWidths = [40, 95, 50, 50, 50, 60, 50, 50, 65]; // Better proportions
    const colPositions = [50]; // Starting positions for each column
    
    // Calculate column positions
    for (let i = 1; i < colWidths.length; i++) {
      colPositions[i] = colPositions[i-1] + colWidths[i-1];
    }
    
    // Table headers - essential columns for detailed results
    const tableHeaders = ['Rank', 'Name', 'Gross WPM', 'Net WPM', 'Accuracy %', 'Final Score', 'Time (s)', 'Prize ₹', 'Status'];
    
    // Draw table header with professional dark background
    doc.rect(50, tableStartY - 5, colWidths.reduce((a, b) => a + b, 0), 30).fill('#1a237e');
    
    // Draw table headers with white text
    tableHeaders.forEach((header, index) => {
      doc.fontSize(11).font('Helvetica-Bold').fillColor('#ffffff').text(header, colPositions[index], tableStartY, { width: colWidths[index], align: 'center' });
    });
    doc.fillColor('#000000'); // Reset color
    
    doc.moveDown(0.5);
    
    // Add results data with professional formatting
    resultsWithRanks.forEach((result, index) => {
      const rowY = doc.y;
      const isEvenRow = index % 2 === 0;
      
      // Row background for better readability
      if (isEvenRow) {
        doc.rect(50, rowY - 2, colWidths.reduce((a, b) => a + b, 0), 24).fill('#ffffff');
      } else {
        doc.rect(50, rowY - 2, colWidths.reduce((a, b) => a + b, 0), 24).fill('#f5f5f5');
      }
      
      // Rank with special formatting for top 3
      let rankColor = '#000000';
      if (result.rank === 1) rankColor = '#FFD700'; // Gold
      else if (result.rank === 2) rankColor = '#C0C0C0'; // Silver
      else if (result.rank === 3) rankColor = '#CD7F32'; // Bronze
      
      doc.fontSize(12).font('Helvetica-Bold').fillColor(rankColor).text(result.rank.toString(), colPositions[0], rowY, { width: colWidths[0], align: 'center' });
      doc.fillColor('#000000'); // Reset color
      
      // Name (better handling)
      const name = result.name.length > 12 ? result.name.substring(0, 12) + '...' : result.name;
      doc.fontSize(11).font('Helvetica').text(name, colPositions[1], rowY, { width: colWidths[1], align: 'left' });
      
      // Gross WPM
      doc.fontSize(11).font('Helvetica').text(result.grossSpeed.toFixed(1), colPositions[2], rowY, { width: colWidths[2], align: 'center' });
      
      // Net WPM
      doc.fontSize(11).font('Helvetica').text(result.netSpeed.toFixed(1), colPositions[3], rowY, { width: colWidths[3], align: 'center' });
      
      // Accuracy
      doc.fontSize(11).font('Helvetica').text(result.accuracy.toFixed(1), colPositions[4], rowY, { width: colWidths[4], align: 'center' });
      
      // Final Score
      doc.fontSize(11).font('Helvetica-Bold').text(result.finalScore.toFixed(1), colPositions[5], rowY, { width: colWidths[5], align: 'center' });
      
      // Time Taken
      doc.fontSize(11).font('Helvetica').text(result.timeTaken.toString(), colPositions[6], rowY, { width: colWidths[6], align: 'center' });
      
      // Prize
      doc.fontSize(11).font('Helvetica-Bold').fillColor('#28a745').text(result.prize.toString(), colPositions[7], rowY, { width: colWidths[7], align: 'center' });
      doc.fillColor('#000000'); // Reset color
      
      // Status (Winner/Runner-up/Participant)
      let status = 'Participant';
      if (result.rank === 1) status = 'Winner';
      else if (result.rank === 2) status = 'Runner-up';
      else if (result.rank === 3) status = '3rd Place';
      
      doc.fontSize(10).font('Helvetica').text(status, colPositions[8], rowY, { width: colWidths[8], align: 'center' });
      
      doc.moveDown(0.5);
    });
    
    // Add detailed performance summary
    doc.moveDown(1);
    doc.fontSize(17).font('Helvetica-Bold').text('Performance Analysis', { underline: true });
    doc.moveDown(0.5);
    
    const avgSpeed = (resultsWithRanks.reduce((sum, r) => sum + r.netSpeed, 0) / resultsWithRanks.length).toFixed(1);
    const avgAccuracy = (resultsWithRanks.reduce((sum, r) => sum + r.accuracy, 0) / resultsWithRanks.length).toFixed(1);
    const topSpeed = Math.max(...resultsWithRanks.map(r => r.netSpeed));
    const bestAccuracy = Math.max(...resultsWithRanks.map(r => r.accuracy));
    const totalPrize = resultsWithRanks.reduce((sum, r) => sum + r.prize, 0);
    
    doc.fontSize(13).font('Helvetica-Bold').text('Average Net Speed:', 50, doc.y);
    doc.fontSize(13).font('Helvetica').text(`${avgSpeed} WPM`, 220, doc.y);
    
    doc.fontSize(13).font('Helvetica-Bold').text('Average Accuracy:', 50, doc.y + 30);
    doc.fontSize(13).font('Helvetica').text(`${avgAccuracy}%`, 220, doc.y + 30);
    
    doc.fontSize(13).font('Helvetica-Bold').text('Top Speed:', 50, doc.y + 60);
    doc.fontSize(13).font('Helvetica').text(`${topSpeed} WPM`, 220, doc.y + 60);
    
    doc.fontSize(13).font('Helvetica-Bold').text('Best Accuracy:', 50, doc.y + 90);
    doc.fontSize(13).font('Helvetica').text(`${bestAccuracy}%`, 220, doc.y + 90);
    
    doc.fontSize(13).font('Helvetica-Bold').text('Total Prize Distributed:', 50, doc.y + 120);
    doc.fontSize(13).font('Helvetica').text(`₹${totalPrize}`, 220, doc.y + 120);
    
    // Add footer
    doc.moveDown(2);
    doc.fontSize(12).font('Helvetica-Bold').text('TypingHub Competition System', { align: 'center' });
    doc.fontSize(11).font('Helvetica').text(`© ${new Date().getFullYear()} TypingHub.in - Professional Typing Competitions`, { align: 'center' });
    
    // Finalize PDF
    doc.end();

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error downloading PDF',
      error: error.message
    });
  }
};

module.exports = {
  getCompetitionStatus,
  registerForCompetition,
  joinCompetition,
  submitCompetitionResult,
  getPublicResults,
  getAllRegistrations,
  getCompetitionResults,
  updateCompetitionSettings,
  deleteAllRegistrations,
  deleteAllResults,
  publishResults,
  unpublishResults,
  downloadResultsPDF
};

