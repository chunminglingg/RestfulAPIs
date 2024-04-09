import jwt from 'jsonwebtoken';

export const createToken = (_id: string) => {
   return jwt.sign({_id: _id}, process.env.SECRET as string, {expiresIn:"3d"} )
}