// export const BASE_URL = "http://localhost:5000/api/v1/"
export const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// export const BASE_URL = "http://192.168.0.5:3000/api/v1/"

export const LOGIN = "users/login";
export const REGISTER = "users/register";
export const REGISTER_SETUP = "users/2fa/setup";
export const REGISTER_VERIFY_SETUP = "users/2fa/verify-setup";
export const RESET_USER = "users/2fa/reset";
export const GETALLUSERS = "users";

export const GETALLPROPERTIES = "properties"
export const CREATE_PROPERTY = "properties"
export const UPDATE_PROPERTY = "properties/"
export const GET_PROPERTY_BY_ID = "properties/"
export const DELETE_PROPERTY = "properties/"

export const UPLOAD_IMAGES = "uploads/images/"
export const GET_ABOUT = "real-state-site-content"
export const CREATE_ABOUT = "real-state-site-content"
export const UPDATE_ABOUT = "real-state-site-content/"
export const DELETE_ABOUT = "real-state-site-content/"

// Supabase ENV imports
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const SUPABASE_BUCKET = import.meta.env.VITE_SUPABASE_BUCKET;