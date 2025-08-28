# Competition Ranking System

## Overview
The TypingHub Weekly Competition uses a sophisticated ranking system that evaluates participants based on multiple performance metrics to ensure fair and accurate results.

## Test Configuration
- **Duration**: 10 minutes (600 seconds)
- **Test Type**: Fixed-time typing test
- **Auto-submission**: Test automatically submits when time expires
- **Single Attempt**: Each participant can only attempt once per competition

## Comprehensive Ranking Algorithm

### **Multi-Factor Scoring System**
Instead of just ranking by WPM, we use a **comprehensive scoring system** that considers all typing metrics:

#### **1. Speed Score (40% weight)**
- **Gross Speed**: Raw typing speed without penalty
- **Net Speed**: Speed after mistake penalties
- **Formula**: `(Gross Speed × 0.3) + (Net Speed × 0.7)`

#### **2. Accuracy Score (30% weight)**
- **Character Accuracy**: Percentage of correct characters typed
- **Word Accuracy**: Percentage of correct words completed
- **Formula**: `(Character Accuracy × 0.6) + (Word Accuracy × 0.4)`

#### **3. Efficiency Score (20% weight)**
- **Mistake Rate**: Lower mistakes = Higher score
- **Backspace Usage**: Lower backspaces = Higher score
- **Formula**: `100 - (Mistakes × 2) - (Backspaces × 1.5)`

#### **4. Completion Score (10% weight)**
- **Total Words**: More words = Higher score
- **Completion Rate**: Percentage of passage completed
- **Formula**: `(Total Words / Expected Words) × 100`

### **Final Score Calculation**
```javascript
Final Score = (Speed Score × 0.4) + (Accuracy Score × 0.3) + (Efficiency Score × 0.2) + (Completion Score × 0.1)

// Example calculation:
// User A: Speed=45, Accuracy=95%, Mistakes=3, Backspaces=2, TotalWords=120
// Speed Score: (45 × 0.3) + (42 × 0.7) = 13.5 + 29.4 = 42.9
// Accuracy Score: (95 × 0.6) + (92 × 0.4) = 57 + 36.8 = 93.8
// Efficiency Score: 100 - (3 × 2) - (2 × 1.5) = 100 - 6 - 3 = 91
// Completion Score: (120/150) × 100 = 80
// Final Score: (42.9 × 0.4) + (93.8 × 0.3) + (91 × 0.2) + (80 × 0.1) = 17.16 + 28.14 + 18.2 + 8 = 71.5
```

## Detailed Metric Analysis

### **Gross Speed vs Net Speed**
- **Gross Speed**: Raw typing speed (includes mistakes)
- **Net Speed**: Effective speed after penalty deductions
- **Why Both Matter**: Gross speed shows potential, net speed shows actual performance

### **Accuracy Metrics**
- **Character Accuracy**: `(Correct Characters / Total Characters) × 100`
- **Word Accuracy**: `(Correct Words / Total Words) × 100`
- **Combined**: Both are weighted for comprehensive accuracy assessment

### **Efficiency Metrics**
- **Mistakes**: Each mistake reduces efficiency score
- **Backspaces**: Each backspace reduces efficiency score
- **Penalty System**: Mistakes penalized more than backspaces

### **Completion Metrics**
- **Total Words**: Shows how much of the passage was attempted
- **Expected Words**: Based on passage length and time limit
- **Completion Rate**: Percentage of passage completed within time

## Ranking Process

### **Step 1: Calculate Individual Scores**
1. **Speed Score**: Based on gross and net WPM
2. **Accuracy Score**: Based on character and word accuracy
3. **Efficiency Score**: Based on mistakes and backspaces
4. **Completion Score**: Based on words completed

### **Step 2: Calculate Final Score**
- Apply weights to each component
- Sum up weighted scores
- Normalize to 0-100 scale

### **Step 3: Sort and Rank**
- Sort by final score (descending)
- Assign ranks sequentially
- Handle ties by considering individual components

## Example Rankings

### **Sample Results with Scores**
```
1. Rahul Kumar: 
   - Gross: 52 WPM, Net: 48 WPM, Accuracy: 96%, Mistakes: 2, Backspaces: 1, Words: 125
   - Final Score: 78.5 → 1st Place (₹100)

2. Priya Singh: 
   - Gross: 50 WPM, Net: 47 WPM, Accuracy: 94%, Mistakes: 3, Backspaces: 2, Words: 120
   - Final Score: 75.2 → 2nd Place (₹50)

3. Amit Patel: 
   - Gross: 48 WPM, Net: 45 WPM, Accuracy: 98%, Mistakes: 1, Backspaces: 0, Words: 115
   - Final Score: 74.8 → 3rd Place (₹25)

4. Neha Sharma: 
   - Gross: 45 WPM, Net: 42 WPM, Accuracy: 95%, Mistakes: 4, Backspaces: 3, Words: 110
   - Final Score: 68.9 → 4th Place (₹0)
```

### **Why This Ranking Makes Sense**
- **Rahul**: High speed + good accuracy + low mistakes = Best overall
- **Priya**: Good speed + good accuracy + moderate mistakes = Second best
- **Amit**: Moderate speed + excellent accuracy + very low mistakes = Third best
- **Neha**: Lower speed + good accuracy + higher mistakes = Fourth

## Backend Implementation

### **Updated Result Schema**
```javascript
{
  secretId: String,
  name: String,
  mobile: String,
  
  // Raw Metrics
  grossSpeed: Number,      // Raw WPM
  netSpeed: Number,        // Effective WPM
  accuracy: Number,        // Character accuracy %
  wordAccuracy: Number,    // Word accuracy %
  mistakes: Number,        // Total mistakes
  backspaces: Number,      // Backspace count
  totalWords: Number,      // Words attempted
  correctWords: Number,    // Correct words
  incorrectWords: Number,  // Incorrect words
  timeTaken: Number,       // Time used (seconds)
  
  // Calculated Scores
  speedScore: Number,      // Weighted speed score
  accuracyScore: Number,   // Weighted accuracy score
  efficiencyScore: Number, // Weighted efficiency score
  completionScore: Number, // Weighted completion score
  finalScore: Number,      // Overall score (0-100)
  
  // Final Results
  rank: Number,            // Final ranking
  prize: Number,           // Prize amount
  submittedAt: Date        // Submission timestamp
}
```

### **Ranking Algorithm in Backend**
```javascript
// Calculate comprehensive scores for each result
const calculateFinalScore = (result) => {
  // Speed Score (40%)
  const speedScore = (result.grossSpeed * 0.3) + (result.netSpeed * 0.7);
  
  // Accuracy Score (30%)
  const accuracyScore = (result.accuracy * 0.6) + (result.wordAccuracy * 0.4);
  
  // Efficiency Score (20%)
  const efficiencyScore = Math.max(0, 100 - (result.mistakes * 2) - (result.backspaces * 1.5));
  
  // Completion Score (10%)
  const expectedWords = 150; // Based on 10-minute test
  const completionScore = Math.min(100, (result.totalWords / expectedWords) * 100);
  
  // Final Score
  const finalScore = (speedScore * 0.4) + (accuracyScore * 0.3) + (efficiencyScore * 0.2) + (completionScore * 0.1);
  
  return {
    speedScore: Math.round(speedScore * 100) / 100,
    accuracyScore: Math.round(accuracyScore * 100) / 100,
    efficiencyScore: Math.round(efficiencyScore * 100) / 100,
    completionScore: Math.round(completionScore * 100) / 100,
    finalScore: Math.round(finalScore * 100) / 100
  };
};

// Sort results by final score
const sortedResults = competition.results
  .map(result => ({ ...result, ...calculateFinalScore(result) }))
  .sort((a, b) => b.finalScore - a.finalScore)
  .map((result, index) => ({ ...result, rank: index + 1 }));
```

## Advantages of This System

### **1. Comprehensive Evaluation**
- Considers all typing aspects, not just speed
- Balances speed with accuracy and efficiency
- Rewards consistent performance across all metrics

### **2. Fair Competition**
- Fast typists with many mistakes don't automatically win
- Accurate typists with moderate speed can still rank high
- Efficiency is rewarded, not just raw speed

### **3. Anti-Cheating**
- Backspace usage is penalized
- Mistake patterns are analyzed
- Completion rate prevents gaming the system

### **4. Transparent Scoring**
- Clear weight distribution (40-30-20-10)
- All calculations are visible and understandable
- No hidden factors or arbitrary decisions

## Conclusion

This comprehensive ranking system ensures:
- **Balanced Evaluation**: Speed, accuracy, efficiency, and completion all matter
- **Fair Competition**: No single metric dominates the ranking
- **Anti-Cheating**: Gaming the system is difficult and penalized
- **Transparent Results**: Clear scoring methodology for all participants
- **Motivational**: Encourages improvement in all typing aspects

The system now provides a level playing field where participants must excel in multiple areas to achieve high rankings, making the competition more engaging and fair for everyone.
