const { json } = require("express/lib/response");
const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where user_id='${user_id}'`);
    return recipes_id;
}

async function addPrivateRecipe(user_id,image,title,minutes,vegan,vegeterian,gluten,ingrediants,instructions){
    ingrediants_as_JSON = JSON.stringify(ingrediants)
    instructions_as_JSON = JSON.stringify(instructions)
    await DButils.execQuery(`insert into PrivateRecipes values ('0','${user_id}','${image}','${title}','${minutes}','0',${vegan},${vegeterian},${gluten},'${ingrediants_as_JSON}','${instructions_as_JSON}')`);
}

async function getPrivateRecipes(user_id){
    var result = []
    const private_recipes = await DButils.execQuery(`select * from PrivateRecipes where user_id='${user_id}'`);
    for (let i = 0 ; i<private_recipes.length; i++){
        var obj = {
            "id":private_recipes[i].user_id,
            "recipe_id":private_recipes[i].recipe_id,
            "image":private_recipes[i].image,
            "title":private_recipes[i].title,
            "minutes":private_recipes[i].minutes,
            "popularity":private_recipes[i].popularity,
            "vegan":private_recipes[i].vegan,
            "vegeterian":private_recipes[i].vegeterian,
            "glutenFree":private_recipes[i].glutenFree,
            "ingrediants":JSON.parse(private_recipes[i].ingrediants),
            "instructions":JSON.parse(private_recipes[i].instructions)
            }
            result.push(obj)
    }
    return result
}

async function addFamilyRecipe(user_id,recipe_owner,custom_time,image,title,minutes,ingrediants,instructions){
    ingrediants_as_JSON = JSON.stringify(ingrediants)
    instructions_as_JSON = JSON.stringify(instructions)
    await DButils.execQuery(`insert into FamilyRecipes values ('0','${user_id}','${recipe_owner}','${custom_time}','${image}','${title}','${minutes}','${ingrediants_as_JSON}','${instructions_as_JSON}')`);
}

async function getFamilyRecipes(user_id){
    let result = []
    const familyrecipes = await DButils.execQuery(`select * from FamilyRecipes where user_id='${user_id}'`);
    for (let i = 0 ; i<familyrecipes.length; i++){
        var obj = {
            "recipe_id":familyrecipes[i].recipe_id,
            "user_id":familyrecipes[i].user_id,
            "recipe_owner":familyrecipes[i].recipe_owner,
            "image":familyrecipes[i].image,
            "title":familyrecipes[i].title,
            "minutes":familyrecipes[i].minutes,
            "ingrediants":JSON.parse(familyrecipes[i].ingrediants),
            "instructions":JSON.parse(familyrecipes[i].instructions)
            }
            result.push(obj)
    }
    return result
}
async function addWatchedRecipes(user_id, recipe_id){
    await DButils.execQuery(`insert into watchedrecipes values('${user_id}','${recipe_id}')`);
}
async function getWatchedRecipes(user_id){
    return await DButils.execQuery(`select * from watchedrecipes where user_id='${user_id}'`)
}


exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.addPrivateRecipe = addPrivateRecipe;
exports.getPrivateRecipes = getPrivateRecipes;
exports.addFamilyRecipe = addFamilyRecipe;
exports.getFamilyRecipes = getFamilyRecipes;
exports.addWatchedRecipes = addWatchedRecipes;
exports.getWatchedRecipes = getWatchedRecipes;

