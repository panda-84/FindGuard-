import jwt from "jsonwebtoken";

const SECRET_KEY = "findguard-secret-key"; 


export const generateToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" }); 
};


export const verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};
