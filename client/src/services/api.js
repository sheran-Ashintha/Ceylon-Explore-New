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

// Users
export const getUsers = () => API.get("/users");
export const deleteUser = (id) => API.delete(`/users/${id}`);

// Destinations
export const getDestinations = (params) => API.get("/destinations", { params });
export const getDestination = (id) => API.get(`/destinations/${id}`);
export const createDestination = (data) => API.post("/destinations", data);
export const deleteDestination = (id) => API.delete(`/destinations/${id}`);

// Packages
export const getPackages = (params) => API.get("/packages", { params });
export const getPackageBySlug = (slug) => API.get(`/packages/${slug}`);
export const createPackage = (data) => API.post("/packages", data);
export const updatePackage = (slug, data) => API.put(`/packages/${slug}`, data);
export const deletePackage = (slug) => API.delete(`/packages/${slug}`);

// Shops
export const getShops = (params) => API.get("/shops", { params });
export const getShopById = (id) => API.get(`/shops/${id}`);
export const createShop = (data) => API.post("/shops", data);
export const updateShop = (id, data) => API.put(`/shops/${id}`, data);
export const deleteShop = (id) => API.delete(`/shops/${id}`);

// Tours
export const getTourServices = (params) => API.get("/tours", { params });
export const getTourService = (id) => API.get(`/tours/${id}`);
export const createTourService = (data) => API.post("/tours", data);
export const updateTourService = (id, data) => API.put(`/tours/${id}`, data);
export const deleteTourService = (id) => API.delete(`/tours/${id}`);

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
export const updateChatLocation = (data) => API.put("/chat/location", data);
export const addChatFriend = (memberId) => API.post(`/chat/friends/${memberId}`);
export const acceptChatFriendRequest = (memberId) => API.post(`/chat/friends/${memberId}/accept`);
export const declineChatFriendRequest = (memberId) => API.post(`/chat/friends/${memberId}/decline`);

export default API;
