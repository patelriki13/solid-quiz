import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RefreshCw, Trophy, Code, ArrowRight, AlertCircle } from 'lucide-react';

const SolidMatchingGame = () => {
  const [userName, setUserName] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [resultSubmitted, setResultSubmitted] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const codeExamples = [
    {
      id: 1,
      title: "User Management Class",
      code: `class UserManager {
  validateEmail(email) {
    return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
  }
  
  saveToDatabase(user) {
    database.insert('users', user);
  }
  
  sendWelcomeEmail(user) {
    emailService.send(user.email, 'Welcome!');
  }
  
  generateReport(users) {
    return users.map(u => \`\${u.name}: \${u.email}\`).join('\\n');
  }
}`,
      correctAnswer: "Single Responsibility Principle",
      explanation: "This class violates SRP by handling multiple responsibilities: validation, database operations, email sending, and report generation. Each should be in separate classes.",
      violation: true
    },
    {
      id: 2,
      title: "Shape Calculation System",
      code: `class AreaCalculator {
  calculateArea(shapes) {
    let totalArea = 0;
    for (let shape of shapes) {
      if (shape.type === 'circle') {
        totalArea += Math.PI * shape.radius * shape.radius;
      } else if (shape.type === 'rectangle') {
        totalArea += shape.width * shape.height;
      } else if (shape.type === 'triangle') {
        totalArea += 0.5 * shape.base * shape.height;
      }
      // Need to modify this method every time we add a new shape!
    }
    return totalArea;
  }
}`,
      correctAnswer: "Open/Closed Principle",
      explanation: "This violates OCP because adding new shapes requires modifying the existing calculateArea method. Instead, each shape should have its own calculateArea method.",
      violation: true
    },
    {
      id: 3,
      title: "Bird Inheritance Hierarchy",
      code: `class Bird {
  fly() { /* flying logic */ }
  makeNoise() { /* generic bird sound */ }
}

class Penguin extends Bird {
  fly() {
    throw new Error("Penguins cannot fly!");
  }
  
  makeNoise() {
    return "Squawk!";
  }
}

// Usage causes problems:
function makeBirdFly(bird) {
  bird.fly(); // This breaks with Penguin!
}`,
      correctAnswer: "Liskov Substitution Principle",
      explanation: "This violates LSP because Penguin cannot be substituted for Bird without breaking the program. Subclasses should be able to replace their parent class without altering program correctness.",
      violation: true
    },
    {
      id: 4,
      title: "Multi-Purpose Interface",
      code: `interface WorkerInterface {
  work();
  eat();
  sleep();
  attendMeeting();
  writeCode();
  designUI();
  testSoftware();
  manageTeam();
}

class Intern implements WorkerInterface {
  work() { /* can do */ }
  eat() { /* can do */ }
  sleep() { /* can do */ }
  attendMeeting() { /* can do */ }
  writeCode() { /* learning */ }
  designUI() { throw new Error("Not my job"); }
  testSoftware() { throw new Error("Not trained"); }
  manageTeam() { throw new Error("Not qualified"); }
}`,
      correctAnswer: "Interface Segregation Principle",
      explanation: "This violates ISP by forcing clients to depend on methods they don't use. The interface should be split into smaller, more specific interfaces like Coder, Designer, Tester, etc.",
      violation: true
    },
    {
      id: 5,
      title: "Direct Database Dependency",
      code: `class OrderService {
  constructor() {
    this.database = new MySQLDatabase(); // Direct dependency!
    this.emailer = new SMTPEmailer();   // Direct dependency!
  }
  
  processOrder(order) {
    // Business logic mixed with infrastructure concerns
    this.database.save(order);
    this.emailer.sendConfirmation(order.email);
  }
}`,
      correctAnswer: "Dependency Inversion Principle",
      explanation: "This violates DIP because high-level OrderService depends directly on low-level modules (MySQLDatabase, SMTPEmailer). It should depend on abstractions (interfaces) instead.",
      violation: true
    },
    {
      id: 6,
      title: "Well-Designed Repository Pattern",
      code: `interface UserRepository {
  save(user: User): void;
  findById(id: string): User;
  findByEmail(email: string): User;
}

class DatabaseUserRepository implements UserRepository {
  save(user: User): void { /* database logic */ }
  findById(id: string): User { /* database logic */ }
  findByEmail(email: string): User { /* database logic */ }
}

class UserService {
  constructor(private userRepo: UserRepository) {}
  
  createUser(userData: UserData): User {
    // Only handles business logic
    const user = new User(userData);
    this.userRepo.save(user);
    return user;
  }
}`,
      correctAnswer: "Dependency Inversion Principle",
      explanation: "This follows DIP correctly! UserService (high-level) depends on UserRepository abstraction, not concrete implementation. Dependencies are injected, making it testable and flexible.",
      violation: false
    },
    {
      id: 7,
      title: "Extensible Shape System",
      code: `abstract class Shape {
  abstract calculateArea(): number;
}

class Circle extends Shape {
  constructor(private radius: number) { super(); }
  calculateArea(): number {
    return Math.PI * this.radius * this.radius;
  }
}

class Rectangle extends Shape {
  constructor(private width: number, private height: number) { super(); }
  calculateArea(): number {
    return this.width * this.height;
  }
}

class AreaCalculator {
  calculateTotalArea(shapes: Shape[]): number {
    return shapes.reduce((total, shape) => total + shape.calculateArea(), 0);
  }
}`,
      correctAnswer: "Open/Closed Principle",
      explanation: "This follows OCP correctly! New shapes can be added by extending Shape class without modifying existing AreaCalculator code. The system is open for extension, closed for modification.",
      violation: false
    },
    {
      id: 8,
      title: "Specialized Interfaces",
      code: `interface Readable {
  read(): string;
}

interface Writable {
  write(data: string): void;
}

interface Executable {
  execute(): void;
}

class ConfigFile implements Readable {
  read(): string { /* read config */ }
}

class LogFile implements Readable, Writable {
  read(): string { /* read logs */ }
  write(data: string): void { /* write logs */ }
}

class Script implements Readable, Executable {
  read(): string { /* read script */ }
  execute(): void { /* run script */ }
}`,
      correctAnswer: "Interface Segregation Principle",
      explanation: "This follows ISP correctly! Each interface has a single, focused responsibility. Classes only implement the interfaces they actually need, avoiding forced dependencies on unused methods.",
      violation: false
    }
  ];

  const principles = [
    "Single Responsibility Principle",
    "Open/Closed Principle", 
    "Liskov Substitution Principle",
    "Interface Segregation Principle",
    "Dependency Inversion Principle"
  ];

  useEffect(() => {
    const shuffled = [...codeExamples].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
  }, []);

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setShowExplanation(true);
    
    const isCorrect = answer === currentQuestion?.correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }
    
    const answerRecord = {
      questionId: currentQuestion.id,
      questionTitle: currentQuestion.title,
      userAnswer: answer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: isCorrect,
      timestamp: new Date().toISOString()
    };
    setUserAnswers([...userAnswers, answerRecord]);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setShowExplanation(false);
    } else {
      setGameComplete(true);
    }
  };

  const submitToGoogleSheets = async (results) => {
    // Updated Google Apps Script Web App URL
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyhODwHogKWm4J2Ng4tip0hqoO_Q_dJSm6NpRarur0qs3axE_TOudrlzOL5cRSLEkoz/exec';
    
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Required for Google Apps Script
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(results)
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error submitting to Google Sheets:', error);
      throw error;
    }
  };

  const submitResults = async () => {
    setIsSubmitting(true);
    
    // Simplified data structure - only basic quiz info
    const finalResults = {
      userName: userName,
      score: score,
      totalQuestions: shuffledQuestions.length,
      percentage: Math.round((score / shuffledQuestions.length) * 100),
      completedAt: new Date().toISOString()
    };

    try {
      // Attempt to submit to Google Sheets
      await submitToGoogleSheets(finalResults);
      
      setResultSubmitted(true);
      setIsSubmitting(false);
      
    } catch (error) {
      console.error('Error submitting results:', error);
      setIsSubmitting(false);
      
      // Set submitted to true to show the manual submission option
      setResultSubmitted(true);
    }
  };

  const validateAndStartGame = () => {
    const trimmedName = userName.trim();
    setValidationError('');
    
    if (!trimmedName) {
      setValidationError('Please enter your full name to start the quiz!');
      return;
    }
    
    const nameParts = trimmedName.split(/\s+/).filter(part => part.length > 0);
    
    if (nameParts.length < 2) {
      setValidationError('Please enter both your first name and last name!');
      return;
    }
    
    const nameRegex = /^[a-zA-Z]{2,}$/;
    const invalidParts = nameParts.filter(part => !nameRegex.test(part));
    
    if (invalidParts.length > 0) {
      setValidationError('Please enter a valid name using only letters (minimum 2 characters per name part)!');
      return;
    }
    
    setGameStarted(true);
  };

  const resetGame = () => {
    const shuffled = [...codeExamples].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setShowExplanation(false);
    setScore(0);
    setGameComplete(false);
    setUserAnswers([]);
    setResultSubmitted(false);
    setGameStarted(false);
    setUserName('');
    setValidationError('');
    setIsSubmitting(false);
  };

  if (!gameStarted) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-lg w-full">
          <div className="text-center mb-8">
            <Code className="mx-auto mb-4 text-purple-600" size={64} />
            <h1 className="text-4xl font-bold text-gray-800 mb-2">SOLID Principles Quiz</h1>
            <p className="text-lg text-gray-600">Test your knowledge of SOLID design principles</p>
          </div>
          
          <div className="mb-6">
            <label htmlFor="userName" className="block text-lg font-semibold text-gray-700 mb-2">
              Enter your full name to begin:
            </label>
            <input
              id="userName"
              type="text"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
                if (validationError) setValidationError('');
              }}
              onKeyPress={(e) => e.key === 'Enter' && validateAndStartGame()}
              placeholder="First Name Last Name"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none text-lg transition-colors ${
                validationError 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:border-purple-500'
              }`}
            />
            
            {validationError && (
              <div className="mt-2 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle size={16} />
                <p className="text-sm font-medium">{validationError}</p>
              </div>
            )}
            
            {!validationError && (
              <p className="text-sm text-gray-500 mt-2">
                Please enter both your first and last name (e.g., "John Smith")
              </p>
            )}
          </div>
          
          <button
            onClick={validateAndStartGame}
            className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold text-lg"
          >
            Start Quiz
          </button>
          
          <div className="mt-6 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Quiz Info:</h3>
            <ul className="space-y-1">
              <li>• {codeExamples.length} questions about SOLID principles</li>
              <li>• Mix of code violations and correct implementations</li>
              <li>• Immediate feedback with explanations</li>
              <li>• Results will be submitted automatically</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (shuffledQuestions.length === 0) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (gameComplete) {
    const percentage = Math.round((score / shuffledQuestions.length) * 100);
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-green-50 to-blue-50 min-h-screen">
        <div className="text-center bg-white rounded-xl p-8 shadow-lg">
          <Trophy className="mx-auto mb-4 text-yellow-500" size={64} />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Great job, {userName}!</h1>
          <p className="text-lg text-gray-600 mb-4">You've completed the SOLID Principles Quiz</p>
          
          <div className="text-6xl font-bold text-blue-600 mb-2">{score}/{shuffledQuestions.length}</div>
          <div className="text-2xl text-gray-600 mb-6">{percentage}% Correct</div>
          
          <div className="mb-6">
            {percentage >= 80 && (
              <p className="text-green-600 text-xl font-semibold">Excellent, {userName}! You have a strong grasp of SOLID principles! 🎉</p>
            )}
            {percentage >= 60 && percentage < 80 && (
              <p className="text-blue-600 text-xl font-semibold">Good job, {userName}! Review the explanations to strengthen your understanding. 📚</p>
            )}
            {percentage < 60 && (
              <p className="text-orange-600 text-xl font-semibold">Keep practicing, {userName}! SOLID principles take time to master. 💪</p>
            )}
          </div>
          
          <div className="flex gap-4 justify-center">
            {!resultSubmitted && (
              <button
                onClick={submitResults}
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="animate-spin" size={24} />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle size={24} />
                    Submit Results
                  </>
                )}
              </button>
            )}
            
            <button
              onClick={resetGame}
              className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
            >
              <RefreshCw size={24} />
              Take Quiz Again
            </button>
          </div>
          
          {resultSubmitted && (
            <div className="mt-4 space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">📊 Your Quiz Results:</h3>
                <div className="bg-white p-3 rounded border text-sm font-mono">
                  <div><strong>Name:</strong> {userName}</div>
                  <div><strong>Score:</strong> {score}/{shuffledQuestions.length}</div>
                  <div><strong>Percentage:</strong> {Math.round((score / shuffledQuestions.length) * 100)}%</div>
                  <div><strong>Completed:</strong> {new Date().toLocaleString()}</div>
                </div>
              </div>
              
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">📋 Manual Submission:</h3>
                <p className="text-yellow-700 text-sm mb-3">
                  Due to security restrictions, please manually submit your results using the form below:
                </p>
                <div className="bg-white p-3 rounded border">
                  <p className="text-sm font-medium text-gray-700 mb-2">Copy this data and submit via your preferred method:</p>
                  <textarea 
                    className="w-full p-2 border rounded text-xs font-mono bg-gray-50"
                    rows="4"
                    readOnly
                    value={`Name: ${userName}
Score: ${score}/${shuffledQuestions.length}
Percentage: ${Math.round((score / shuffledQuestions.length) * 100)}%
Completed: ${new Date().toLocaleString()}`}
                  />
                  <button 
                    onClick={() => {
                      const textArea = document.querySelector('textarea');
                      textArea.select();
                      document.execCommand('copy');
                    }}
                    className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">SOLID Principles Quiz</h1>
        <p className="text-lg text-gray-600 mb-2">Welcome, <span className="font-semibold text-purple-600">{userName}</span>!</p>
        <div className="flex justify-center items-center gap-6 text-lg">
          <div className="bg-white px-4 py-2 rounded-lg shadow">
            Question {currentQuestionIndex + 1} of {shuffledQuestions.length}
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow">
            Score: {score}/{shuffledQuestions.length}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Code className="text-blue-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">{currentQuestion.title}</h2>
          </div>
          
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre className="whitespace-pre-wrap">{currentQuestion.code}</pre>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-gray-700 font-medium">
              {currentQuestion.violation 
                ? "❌ Which SOLID principle does this code violate?" 
                : "✅ Which SOLID principle does this code follow correctly?"}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Select the SOLID Principle:</h3>
          
          <div className="space-y-3">
            {principles.map((principle) => (
              <button
                key={principle}
                onClick={() => !showExplanation && handleAnswerSelect(principle)}
                disabled={showExplanation}
                className={`
                  w-full p-4 text-left rounded-lg border-2 transition-all duration-200 font-medium
                  ${showExplanation 
                    ? (principle === currentQuestion.correctAnswer
                      ? 'bg-green-100 border-green-500 text-green-800'
                      : principle === selectedAnswer && principle !== currentQuestion.correctAnswer
                        ? 'bg-red-100 border-red-500 text-red-800'
                        : 'bg-gray-100 border-gray-300 text-gray-500'
                    )
                    : 'bg-gray-50 border-gray-300 hover:bg-blue-50 hover:border-blue-400 cursor-pointer'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <span>{principle}</span>
                  {showExplanation && principle === currentQuestion.correctAnswer && (
                    <CheckCircle className="text-green-600" size={20} />
                  )}
                  {showExplanation && principle === selectedAnswer && principle !== currentQuestion.correctAnswer && (
                    <XCircle className="text-red-600" size={20} />
                  )}
                </div>
              </button>
            ))}
          </div>

          {showExplanation && (
            <div className="mt-6">
              <div className={`p-4 rounded-lg ${
                selectedAnswer === currentQuestion.correctAnswer 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {selectedAnswer === currentQuestion.correctAnswer ? (
                    <CheckCircle className="text-green-600" size={20} />
                  ) : (
                    <XCircle className="text-red-600" size={20} />
                  )}
                  <span className="font-bold">
                    {selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect'}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{currentQuestion.explanation}</p>
              </div>
              
              <button
                onClick={nextQuestion}
                className="w-full mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                {currentQuestionIndex < shuffledQuestions.length - 1 ? 'Next Question' : 'View Results'}
                <ArrowRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SolidMatchingGame;