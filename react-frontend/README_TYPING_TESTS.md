# Typing Test Architecture

## 🎯 Overview

This project now uses a **modular architecture** for typing tests, where common functionality is extracted into reusable components and hooks. This allows for easy creation of new typing tests with different configurations.

## 🏗️ Architecture

### **Common Components**
- `src/hooks/useTypingTest.ts` - Main typing logic hook
- `src/components/common/TypingEngine.tsx` - Reusable typing test UI
- `src/components/common/TypingEngine.css` - Styling for typing engine

### **Test-Specific Components**
- `src/pages/TypingTest.tsx` - General typing test
- `src/pages/SSCGLTest.tsx` - SSC CGL specific test
- `src/pages/SSCCHSLTest.tsx` - SSC CHSL specific test

## 🚀 How to Create a New Typing Test

### Step 1: Create Test Component
```typescript
import React from 'react';
import TypingEngine from '../components/common/TypingEngine';

const YourTestName = () => {
  const config = {
    testName: "Your Test Name",
    timeLimit: 600, // Time in seconds
    passageCategory: "YOUR_TEST_CATEGORY",
    qualificationCriteria: {
      minWpm: 35,
      minAccuracy: 80
    }
  };

  return <TypingEngine config={config} />;
};

export default YourTestName;
```

### Step 2: Add Route (if needed)
```typescript
// In your routing file
<Route path="/your-test" element={<YourTestName />} />
```

## ⚙️ Configuration Options

### **testName** (string)
- Used for API calls to fetch passages
- Should match the test name in your backend database

### **timeLimit** (number)
- Default time limit in seconds
- Examples: 600 (10 min), 900 (15 min), 480 (8 min)

### **passageCategory** (string)
- Category for fetching passages from backend
- Used in API call: `/api/passages/test/${testName}`

### **qualificationCriteria** (object)
- `minWpm`: Minimum words per minute required
- `minAccuracy`: Minimum accuracy percentage required

## 📊 Features Available

### **Common Features**
✅ **Mode of Exam** - Screen Typing vs Paper Typing  
✅ **Duration Selection** - 2, 5, 10, 15 minutes  
✅ **Passage Selection** - Dynamic from backend  
✅ **Real-time Metrics** - WPM, accuracy, mistakes  
✅ **Character Highlighting** - For Screen Typing mode  
✅ **Timer** - Countdown with auto-submit  
✅ **Feedback Modal** - Detailed results and suggestions  
✅ **Responsive Design** - Works on all screen sizes  

### **Test-Specific Customizations**
- Different time limits
- Different qualification criteria
- Different passage categories
- Different test names

## 🔧 Backend Requirements

### **API Endpoint**
```
GET /api/passages/test/{testName}
```

### **Response Format**
```json
[
  {
    "_id": "passage_id",
    "title": "Passage Title",
    "content": "Passage content here...",
    "testTypes": ["SSC_CGL", "SSC_CHSL"]
  }
]
```

## 📝 Example Configurations

### **SSC CGL Test**
```typescript
{
  testName: "SSC CGL Typing Test",
  timeLimit: 600, // 10 minutes
  passageCategory: "SSC_CGL",
  qualificationCriteria: {
    minWpm: 35,
    minAccuracy: 80
  }
}
```

### **SSC CHSL Test**
```typescript
{
  testName: "SSC CHSL Typing Test",
  timeLimit: 480, // 8 minutes
  passageCategory: "SSC_CHSL",
  qualificationCriteria: {
    minWpm: 30,
    minAccuracy: 85
  }
}
```

### **Railway Test**
```typescript
{
  testName: "Railway Typing Test",
  timeLimit: 900, // 15 minutes
  passageCategory: "RAILWAY",
  qualificationCriteria: {
    minWpm: 25,
    minAccuracy: 90
  }
}
```

## 🎨 Customization

### **Adding New Features**
1. Add logic to `useTypingTest.ts` hook
2. Update `TypingEngine.tsx` component
3. All tests automatically get the new feature

### **Styling Changes**
- Modify `TypingEngine.css` for global changes
- Create test-specific CSS files for unique styling

## 🐛 Troubleshooting

### **Common Issues**
1. **Passages not loading** - Check API endpoint and testName
2. **Timer not working** - Verify timeLimit is in seconds
3. **Highlighting not working** - Check examMode state

### **Debug Mode**
Add console logs in the hook to debug:
```typescript
console.log('Config:', config);
console.log('Passages:', passages);
```

## 📈 Benefits

✅ **Code Reusability** - No duplicate code  
✅ **Easy Maintenance** - Fix once, works everywhere  
✅ **Consistent UI** - Same look across all tests  
✅ **Fast Development** - New test in minutes  
✅ **Scalable** - Easy to add more tests  

## 🚀 Future Enhancements

- [ ] Add more test types
- [ ] Custom qualification criteria per test
- [ ] Advanced analytics
- [ ] Practice mode vs Exam mode
- [ ] Offline support with cached passages 