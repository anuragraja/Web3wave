import MongoEventRepository from "../repositories/implementations/eventImplementation.js";
import MongoUserRepository from "../repositories/implementations/userImplementation.js";
import Company from "../models/company.model.js";

class DashboardService {
    constructor() {
        this.eventRepository = new MongoEventRepository();
        this.userRepository = new MongoUserRepository();
    }

    async getDashboardOverview() {
        const [eventStats, userStats, totalCompanies, verifiedCompanies] = await Promise.all([
            this.eventRepository.getEventStats(),
            this.userRepository.getUserStats(),
            Company.countDocuments(),
            Company.countDocuments({ isVerified: true }),
        ]);

        return {
            events: {
                total: eventStats.total,
                published: eventStats.published,
                draft: eventStats.draft,
                completed: eventStats.completed,
                cancelled: eventStats.cancelled,
                byCategory: eventStats.byCategory,
            },
            users: {
                total: userStats.total,
                verified: userStats.verified,
                unverified: userStats.unverified,
                admins: userStats.admins,
                regularUsers: userStats.regularUsers,
            },
            companies: {
                total: totalCompanies,
                verified: verifiedCompanies,
            },
            recentEvents: eventStats.recentEvents,
            recentUsers: userStats.recentUsers,
        };
    }
}

export default DashboardService;
