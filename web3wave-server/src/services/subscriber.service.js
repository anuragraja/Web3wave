import Subscriber from "../models/subscriber.model.js";
import { AppError } from "../utils/appError.js";

class SubscriberService {
    async subscribe(email, frequency = "Every New Event") {
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            throw new AppError("A valid email address is required.", 400);
        }

        const normalizedEmail = email.trim().toLowerCase();
        const existing = await Subscriber.findOne({ email: normalizedEmail });

        if (existing) {
            if (!existing.isSubscribed) {
                existing.isSubscribed = true;
                existing.frequency = frequency || existing.frequency;
                await existing.save();
                return {
                    subscriber: existing,
                    alreadySubscribed: false,
                    message: "You're resubscribed to Web3Wave event updates!",
                };
            }
            return {
                subscriber: existing,
                alreadySubscribed: true,
                message: "Already subscribed to event updates.",
            };
        }

        const newSubscriber = await Subscriber.create({
            email: normalizedEmail,
            frequency,
            isSubscribed: true,
        });

        return {
            subscriber: newSubscriber,
            alreadySubscribed: false,
            message: "✓ You're subscribed to Web3Wave event updates.",
        };
    }

    async getSubscribers() {
        return await Subscriber.find({ isSubscribed: true }).lean();
    }
}

export default SubscriberService;
