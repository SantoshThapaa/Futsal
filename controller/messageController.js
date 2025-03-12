import { Message } from "../models/messageSchema";

export const sendMessage = async (req, res, next) => {
    const { firstName, lastName, email, phone, message } = req.body;
    if (!firstName || !lastName || !email || !phone || !message) {
        return res.status(400).json({
            success: false,
            message: "Please fill all the fields",
        });
    }
    await Message.create({ firstName, lastName, email, phone, message });
    res.status(201).json({
        success: true,
        message: "Message sent successfully!",
    });
};