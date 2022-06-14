var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users").then((users) => {
      if (users.find((x) => x.user_id === req.session.user_id)) {
        req.user_id = req.session.user_id;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});


/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    console.log(user_id,recipe_id)
    await user_utils.markAsFavorite(user_id,recipe_id);
    res.status(201).send("The Recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    let favorite_recipes = {};
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});

/**
 * This path gets body with recipe details and save this recipe in the privates list of the logged-in user
 */
 router.post('/privates', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const image = req.body.image;
    const title = req.body.title;
    const minutes = req.body.minutes;
    const vegan = req.body.vegan;
    const vegetarian = req.body.vegetarian
    const gluten = req.body.gluten;
    const ingrediants =req.body.ingrediants;
    const instructions = req.body.instructions;
    await user_utils.addPrivateRecipe(user_id,image,title,minutes,vegan,vegetarian,gluten,ingrediants,instructions);
    res.status(201).send("The private Recipe was added successfully");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the privates recipes that were saved by the logged-in user
 */
router.get('/privates', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    let private_recipes = {};
    const result = await user_utils.getPrivateRecipes(user_id);
    res.status(200).send(result);
  } catch(error){
    next(error); 
  }
});

/**
 * This path gets body with recipe details and save this recipe in the family recipes list of the logged-in user
 */
router.post('/familyrecipes', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const owner = req.body.recipe_owner;
    const custom_time = req.body.custom_time;
    const image = req.body.image;
    const title = req.body.title;
    const minutes = req.body.minutes;
    const ingrediants =req.body.ingrediants;
    const instructions = req.body.instructions;
    await user_utils.addFamilyRecipe(user_id,owner,custom_time,image,title,minutes,ingrediants,instructions);
    res.status(201).send("The family Recipe was added successfully");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the family recipes that were saved by the logged-in user
 */
router.get('/familyrecipes', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const result = await user_utils.getFamilyRecipes(user_id);
    res.status(200).send(result);
  } catch(error){
    next(error); 
  }
});


router.post('/watched',async(req,res,next)=>{
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId; 
    await user_utils.addWatchedRecipes(user_id,recipe_id);
    res.status(201).send("The watched Recipe was added successfully");
  } catch(error){
    next(error); 
  }
});

/**
 * This path returns the watched recipes that were watched by the logged-in user
 */
router.get('/watched',async(req,res,next)=>{
  try{
    const user_id = req.session.user_id;
    console.log("this",user_id)
    const all_watched = await user_utils.getWatchedRecipes(user_id);
    let lst=[]

    for (let i=all_watched.length-1 ; i>= 0;i--)
    {
      if(lst.length == 3) break;
      let recipeId =all_watched[i]["recipe_id"] 
      if(!lst.includes(recipeId)){
        lst.push(recipeId)
      }
    }
    let result =[]
    for (let i = 0 ; i<lst.length; i++){
      result.push(await recipe_utils.getRecipeDetails(lst[i]))
    }
    console.log(result)
    res.status(200).send(result);
  } catch(error){
    next(error); 
  }
});





module.exports = router;
