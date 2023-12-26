const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

const app = express();
const port = 3000;

// Initialize Firebase Admin SDK with the service account key
const serviceAccount = require('./todo-list-f91ad-firebase-adminsdk-xqvrl-1a39df9e68.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-firebase-project-id.firebaseio.com', // replace with your database URL
});

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Define routes
app.get('/', async (req, res) => {
  // Fetch todos from Firestore and pass them to the template
  const snapshot = await admin.firestore().collection('todos').get();
  const todos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.render('index', { todos });
});

app.post('/add', async (req, res) => {
  const { todo } = req.body;
  // Add todo to Firestore
  await admin.firestore().collection('todos').add({ todo });
  res.redirect('/');
});

app.post('/delete/:id', async (req, res) => {
  const todoId = req.params.id;
  // Delete todo from Firestore
  await admin.firestore().collection('todos').doc(todoId).delete();
  res.redirect('/');
});

// Add the following route for updating todo
app.post('/update/:id', async (req, res) => {
    const todoId = req.params.id;
    const updatedTodo = req.body.updatedTodo;
  
    // Update todo in Firestore
    await admin.firestore().collection('todos').doc(todoId).update({ todo: updatedTodo });
  
    res.redirect('/');
  });
  
// Start the server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
