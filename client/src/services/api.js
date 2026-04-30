import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const loginWithGoogle = (data) => API.post("/auth/google", data);
export const getMe = () => API.get("/auth/me");

// Destinations
export const getDestinations = (params) => API.get("/destinations", { params });
export const getDestination = (id) => API.get(`/destinations/${id}`);

// Packages
export const getPackages = (params) => API.get("/packages", { params });
export const getPackageBySlug = (slug) => API.get(`/packages/${slug}`);

// Shops
export const getShops = (params) => API.get("/shops", { params });
export const getShopById = (id) => API.get(`/shops/${id}`);

// Tours
export const getTourServices = (params) => API.get("/tours", { params });
export const getTourService = (id) => API.get(`/tours/${id}`);

// Bookings
export const createBooking = (data) => API.post("/bookings", data);
export const getMyBookings = () => API.get("/bookings/my");
export const cancelBooking = (id) => API.patch(`/bookings/${id}/cancel`);

// Reviews
export const getReviews = (destId) => API.get(`/destinations/${destId}/reviews`);
export const addReview = (destId, data) => API.post(`/destinations/${destId}/reviews`, data);

// Chat
export const getChatMessages = () => API.get("/chat/messages");
export const sendChatMessage = (data) => API.post("/chat/messages", data);
export const getChatMembers = () => API.get("/chat/members");
export const addChatFriend = (memberId) => API.post(`/chat/friends/${memberId}`);
export const acceptChatFriendRequest = (memberId) => API.post(`/chat/friends/${memberId}/accept`);
export const declineChatFriendRequest = (memberId) => API.post(`/chat/friends/${memberId}/decline`);

export default API;
