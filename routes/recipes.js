var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here"));


/**
 * This path returns a full details of a recipe by its id
 */
router.get("/recipeDetails/:recipeId", async (req, res, next) => {
  
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

router.get("/fullinfo/:recipeId", async (req, res, next) => {
  
  try {
    const recipe = await recipes_utils.getRecipeFullinfo(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

router.get("/threeRandom",async(req,res,next)=>
{

  try {
    const radnomThree = await recipes_utils.random();
    res.send(radnomThree);
  } catch (error) {
    next(error);
  }

}

);

router.get("/search/", async (req, res, next) => {

  try {
    let num=5
    let query="?query="+req.query.query

    if(req.query.cusine!= undefined)
    {query=query+"&cusine="+req.query.cusine}

    if(req.query.number!= undefined)
    {num=req.query.number}
      
   

    if(req.query.diet!= undefined)
    { query=query+"&diet="+req.query.diet}

    if(req.query.intolerances!= undefined)
    {query=query+"&intolerances="+req.query.intolerances}

    //console.log(query)
    
  
  const result = await recipes_utils.search(query,num) 
   // res.send(recipe);
   res.send(result)
  } catch (error) {
    next(error);
  }
});


module.exports = router;

