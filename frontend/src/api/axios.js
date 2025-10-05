import axios from 'axios';

// Ek central axios instance banao
const api = axios.create({
    // baseURL '/api' hai, kyunki humne package.json mein proxy set kiya hai
    // Har call '/api' se shuru hogi, jaise '/api/auth/login'
    baseURL: '/api', 
});

export default api;