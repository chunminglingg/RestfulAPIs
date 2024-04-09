import express  from 'express';
import { Request , Response } from 'express';

const route = express.Router();

// controller function
import { signUpUser, loginUser } from "../controllers/user.controller"; 


// Login routes
route.post('/login', loginUser)

// Sign in routes
route.post('/signup', signUpUser)

// google sign up

export default route;