/* global use, db */
// MongoDB Playground for Quizler application
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

const database = 'quizler';
const collections = ['users', 'quizzes', 'responses'];

// Connect to the quizler database
use(database);

// Create collections if they don't exist
collections.forEach(collection => {
  try {
    db.createCollection(collection);
    print(`Collection ${collection} created or already exists`);
  } catch (e) {
    print(`Error creating collection ${collection}: ${e}`);
  }
});

// Sample data for users collection
const sampleUsers = [
  {
    name: "Admin User",
    email: "admin@quizler.com",
    password: "$2a$10$XFAoTCGhcqGgozE.MkfGGOQocFQOJ5QC2qHWmz8iCFLCUbBQ5xb.i", // hashed 'password123'
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: "$2a$10$XFAoTCGhcqGgozE.MkfGGOQocFQOJ5QC2qHWmz8iCFLCUbBQ5xb.i", // hashed 'password123'
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Sample data for quizzes collection
const sampleQuizzes = [
  {
    title: "JavaScript Basics",
    description: "Test your knowledge of JavaScript fundamentals",
    questions: [
      {
        text: "What is JavaScript?",
        options: [
          "A programming language",
          "A markup language",
          "A styling language",
          "A database language"
        ],
        correctAnswer: "A programming language"
      },
      {
        text: "Which symbol is used for comments in JavaScript?",
        options: [
          "//",
          "#",
          "/* */",
          "Both // and /* */"
        ],
        correctAnswer: "Both // and /* */"
      }
    ],
    createdBy: null, // Will be updated with a real user ID
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Insert sample users if users collection is empty
if (db.users.countDocuments() === 0) {
  const result = db.users.insertMany(sampleUsers);
  print(`${result.insertedCount} users inserted`);
  
  // Update quiz createdBy with the first user's ID
  const firstUser = db.users.findOne();
  sampleQuizzes[0].createdBy = firstUser._id;
  
  // Insert sample quizzes
  if (db.quizzes.countDocuments() === 0) {
    const quizResult = db.quizzes.insertMany(sampleQuizzes);
    print(`${quizResult.insertedCount} quizzes inserted`);
  }
}

// Display collections in the database
print("\nCollections in the quizler database:");
db.getCollectionNames().forEach(collection => {
  print(` - ${collection}`);
});

// Display sample user count
print(`\nUsers count: ${db.users.countDocuments()}`);

// Display sample quiz count
print(`Quizzes count: ${db.quizzes.countDocuments()}`);

// Connection information (useful for connecting from your application)
print("\nConnection Information:");
print(`Database: ${database}`);
print(`Connection String (local): mongodb://localhost:27017/${database}`);
print(`Connection String (Docker): mongodb://admin:password@mongodb:27017/${database}?authSource=admin`);