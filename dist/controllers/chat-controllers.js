import User from "../models/User.js";
import axios from "axios";
const API_KEY = "sk-zZzIJERjR4QWTOjW28VCH7uXeSZopjC3y3xcAYZL5XTqrZoj"; // Replace with your ChatGPT API key
const BASE_URL = "https://api.chatanywhere.cn";
export const generateChatCompletion = async (req, res, next) => {
    const { message } = req.body;
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).json({ message: "User not registered OR Token malfunctioned" });
        }
        // Grab chats of user
        const chats = user.chats.map(({ role, content }) => ({ role, content }));
        chats.push({ content: message, role: "user" });
        user.chats.push({ content: message, role: "user" });
        // Send all chats with new one to the ChatGPT API
        const response = await axios.post(`${BASE_URL}/chat/completions`, {
            model: "gpt-3.5-turbo",
            messages: chats
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            }
        });
        // Assuming the response structure is similar to OpenAI's API
        if (response.data && response.data.choices && response.data.choices.length > 0) {
            user.chats.push(response.data.choices[0].message);
            await user.save();
            return res.status(200).json({ chats: user.chats });
        }
        else {
            console.error("Unexpected response format:", response.data);
            return res.status(500).json({ message: "Unexpected response format" });
        }
    }
    catch (error) {
        console.error("Error during API call:", error.message);
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
            console.error("Response headers:", error.response.headers);
        }
        return res.status(500).json({ message: "Something went wrong" });
    }
};
export const sendChatsToUser = async (req, res, next) => {
    // user oken check
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not found or Token malfunctioned");
        }
        console.log(user._id.toString(), res.locals.jwtData.id);
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permission didnt match");
        }
        return res.status(200).json({ message: "OK", chats: user.chats });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
export const deletsChats = async (req, res, next) => {
    // user oken check
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not found or Token malfunctioned");
        }
        console.log(user._id.toString(), res.locals.jwtData.id);
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permission didnt match");
        }
        //@ts-ignore
        user.chats = [];
        await user.save();
        return res.status(200).json({ message: "OK" });
    }
    catch (error) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message });
    }
};
//# sourceMappingURL=chat-controllers.js.map