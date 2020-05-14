const mongoose = require('mongoose');

// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require('./models/Recipe.model');
// Import of the data from './data.json'
const data = require('./data');

const MONGODB_URI = 'mongodb://localhost:27017/new-recipe-app';

// Connection to the database "new-recipe-app"
mongoose
  .connect(MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(self => {
    console.log(`Connected to the database: "${self.connection.name}"`);
    // Before adding any documents to the database, let's delete all previous entries
    return self.connection.dropDatabase();
    // MANDATORY for CHAINING then: *** return value ****          
  })
  .then( () => {
        // Run your code here, after you have insured that the connection was made
        const newRecipe = {
          title: 'crepes',
          level: 'Easy Peasy',
          ingredients: ['milk','eggs'],
          cuisine: 'belgian',
          dishType: 'breakfast',
          duration: 5,
          creator: 'David',
        }
    
        const p1 = Recipe.create(newRecipe)
          .then( (recipe) => console.log('recipe', recipe.title))
          .catch(err => console.log(`Create recipe error: ${err}`))
    
        const p2 = Recipe.insertMany(data)
          .then( insertedArray => {
            insertedArray.forEach(recipe => {
              console.log(recipe.title);
            });
            return insertedArray
          })
          .then( () => {
            Recipe.findOneAndUpdate({ title: "Rigatoni alla Genovese" }, { $set: { duration:  100 } })
              .then( updatedRecipe => {
                console.log(`updated recipe ${updatedRecipe.duration}`);
                return updatedRecipe
              })
              // .catch(err => console.log('err inside update', err))
              .then( () => {
                Recipe.deleteOne( {title: "Carrot Cake"})
                  .then( () => console.log(`Carrot cake deleted`))
                // .catch(err => console.log('Error while deleting'))
              })
          })
          .catch(err => console.log(`InsertMany error: ${err}`))      
  
          Promise.all([p1, p2])
          .then( () => {
            console.log('Close connection to db');
            mongoose.connection.close();
          })
          .catch(err => console.log(err))
        })
  .catch(error => {
    console.error('Error connecting to the database', error);
  })



      
