import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(config => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        const user = JSON.parse(userStr);
        if (config.method === 'get') {
            config.params = { ...config.params, user_id: user.id };
        } else if (config.method === 'post' || config.method === 'put') {
            config.data = { ...config.data, user_id: user.id };
        }
    }
    return config;
});

// We keep this to prevent old imports from crashing, but the interceptor overrides it.
export const currentUserId = 1;

export default api;
