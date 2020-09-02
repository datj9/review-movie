const {Movie} = require('../../../models/Movie')
const isInt = require('validator/lib/isInt')
const isURL = require('validator/lib/isURL')

const getMovies = async(req,res) =>{
    const {pageSize,pageIndex} = req.query;
    const limit = isInt(pageSize + '') ? +pageSize : 10
    const skip = isInt(pageIndex + '') ? +pageIndex * limit : 0;

   try {
        const movies = await Movie.find().skip(skip).limit(limit);
        movies.forEach((movie,i) => movies[i]= movie.transform());

        return res.status(200).json(movies)
   } catch (error) {
       return res.status(500).json(error)
   }
}

const createMovie = async (req,res) => {
    const {name,image,runningTime,filmDirectors,actors,description,trailer} = req.body;
    const validatedFields = ['name','description','filmDirectors','actors','trailer' ,'image','runningTime']
    const errors = {}

    validatedFields.forEach(field => {
        if(!req.body[field]) errors[field] = `${field} is required`
    });
    if(Object.keys(errors).length) return res.status(400).json(errors)

    // validate data type and valid data
    validatedFields.slice(0,2).forEach(field => {
        if(typeof req.body[field] != 'string') errors[field] = `${field} is invalid`
    })
    validatedFields.slice(2,4).forEach(field => {
        if(!Array.isArray(req.body[field])) errors[field] = `${field} must be an array`
    })
    validatedFields.slice(4,6).forEach(field => {
        if(!isURL(req.body[field]+'')) errors[field] = `${field} must be URL`
    })
    if(!isInt(runningTime+'')) errors.runningTime = 'runningTime must be int'
    if(Object.keys(errors).length) return res.status(400).json(errors)

    filmDirectors.forEach((director) => {
        if(typeof director != 'string') errors.director = 'director must be string'
    })
    actors.forEach((actor) => {
        if(typeof actor != 'string') errors.actor = 'actor must be string'
    })
    if(Object.keys(errors).length) return res.status(400).json(errors)
    
    try {
        const newMovie = new Movie({
            name,
            image,
            runningTime,
            filmDirectors,
            actors,
            description,
            trailer
        })
        await newMovie.save()

        return res.status(201).json(newMovie.transform())
    } catch (error) {
        return res.status(500).json(error)
    }
}

module.exports = { getMovies,createMovie }