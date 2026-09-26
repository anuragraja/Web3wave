import SubscriberService from "../services/subscriber.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class SubscriberController {
    constructor() {
        this.subscriberService = new SubscriberService();
    }

    subscribe = asyncHandler(async (req, res) => {
        const { email, frequency } = req.body;
        const result = await this.subscriberService.subscribe(email, frequency);

        res.status(200).json({
            success: true,
            message: result.message,
            alreadySubscribed: result.alreadySubscribed,
            data: result.subscriber,
        });
    });
}

export default SubscriberController;
