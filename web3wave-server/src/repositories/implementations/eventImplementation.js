import mongoose from "mongoose";
import IEventRepository from "../contracts/IEventRepo.js";
import Event from "../../models/event.model.js";
import { AppError } from "../../utils/appError.js";
import { paginateAggregation } from "../../utils/pagination.js";
import { EVENT_STATUS } from "../../constants/events.js";

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

class MongoEventRepository extends IEventRepository {
    async createEvent(eventData) {
        try {
            const event = new Event(eventData);
            const savedEvent = await event.save();
            return savedEvent;
        } catch (error) {
            console.error("Error creating event:", error);
            if (error.code === 11000) {
                throw new AppError("An event with this slug already exists", 409);
            }
            throw new AppError("Failed to create event", 500, error);
        }
    }

    async findEventById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        try {
            return await Event.findById(id)
                .populate("createdBy", "_id name email")
                .populate("updatedBy", "_id name email");
        } catch (error) {
            throw new AppError("Failed to find event by ID", 500, error);
        }
    }

    async findEventBySlug(slug) {
        try {
            return await Event.findOne({ slug })
                .populate("createdBy", "_id name email")
                .populate("updatedBy", "_id name email");
        } catch (error) {
            throw new AppError("Failed to find event by slug", 500, error);
        }
    }

    async findAllAdminEvents({ page = 1, limit = 10, category, status, search = "" } = {}) {
        try {
            const matchStage = {};

            if (category) {
                matchStage.category = category.toUpperCase();
            }

            if (status) {
                matchStage.status = status.toUpperCase();
            }

            const cleanSearch = search ? escapeRegex(search.trim()) : "";
            if (cleanSearch) {
                const regex = new RegExp(cleanSearch, "i");
                matchStage.$or = [
                    { title: regex },
                    { description: regex },
                    { location: regex },
                    { organizerName: regex },
                    { slug: regex },
                ];
            }

            const pipeline = [
                { $match: matchStage },
                {
                    $lookup: {
                        from: "users",
                        localField: "createdBy",
                        foreignField: "_id",
                        as: "creator",
                    },
                },
                {
                    $unwind: {
                        path: "$creator",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        slug: 1,
                        category: 1,
                        description: 1,
                        capacity: 1,
                        date: 1,
                        startTime: 1,
                        endTime: 1,
                        location: 1,
                        organizerName: 1,
                        organizerEmail: 1,
                        organizerPhone: 1,
                        poster: 1,
                        status: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        createdBy: {
                            _id: "$creator._id",
                            name: "$creator.name",
                            email: "$creator.email",
                        },
                    },
                },
                { $sort: { createdAt: -1 } },
            ];

            return await paginateAggregation(Event, pipeline, { page, limit });
        } catch (error) {
            throw new AppError("Failed to fetch admin events", 500, error);
        }
    }

    async findAllPublicEvents({ page = 1, limit = 10, category, search = "" } = {}) {
        try {
            // Public events MUST ONLY return PUBLISHED events
            const matchStage = {
                status: EVENT_STATUS.PUBLISHED,
            };

            if (category) {
                matchStage.category = category.toUpperCase();
            }

            const cleanSearch = search ? escapeRegex(search.trim()) : "";
            if (cleanSearch) {
                const regex = new RegExp(cleanSearch, "i");
                matchStage.$or = [
                    { title: regex },
                    { description: regex },
                    { location: regex },
                    { organizerName: regex },
                ];
            }

            const pipeline = [
                { $match: matchStage },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        slug: 1,
                        category: 1,
                        description: 1,
                        capacity: 1,
                        date: 1,
                        startTime: 1,
                        endTime: 1,
                        location: 1,
                        organizerName: 1,
                        organizerEmail: 1,
                        organizerPhone: 1,
                        poster: 1,
                        status: 1,
                        createdAt: 1,
                    },
                },
                { $sort: { date: 1 } },
            ];

            return await paginateAggregation(Event, pipeline, { page, limit });
        } catch (error) {
            throw new AppError("Failed to fetch public events", 500, error);
        }
    }

    async updateEvent(id, updateData) {
        try {
            return await Event.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
                .populate("createdBy", "_id name email")
                .populate("updatedBy", "_id name email");
        } catch (error) {
            if (error.code === 11000) {
                throw new AppError("An event with this slug already exists", 409);
            }
            throw new AppError("Failed to update event", 500, error);
        }
    }

    async deleteEvent(id) {
        try {
            return await Event.findByIdAndDelete(id);
        } catch (error) {
            throw new AppError("Failed to delete event", 500, error);
        }
    }

    async getEventStats() {
        try {
            const [statusStats] = await Event.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        published: {
                            $sum: { $cond: [{ $eq: ["$status", EVENT_STATUS.PUBLISHED] }, 1, 0] },
                        },
                        draft: {
                            $sum: { $cond: [{ $eq: ["$status", EVENT_STATUS.DRAFT] }, 1, 0] },
                        },
                        completed: {
                            $sum: { $cond: [{ $eq: ["$status", EVENT_STATUS.COMPLETED] }, 1, 0] },
                        },
                        cancelled: {
                            $sum: { $cond: [{ $eq: ["$status", EVENT_STATUS.CANCELLED] }, 1, 0] },
                        },
                    },
                },
            ]);

            const categoryStats = await Event.aggregate([
                {
                    $group: {
                        _id: "$category",
                        count: { $sum: 1 },
                    },
                },
            ]);

            const byCategory = {
                WORKSHOP: 0,
                HACKATHON: 0,
                MEETUP: 0,
                GRANT_SPRINT: 0,
            };

            categoryStats.forEach((stat) => {
                if (stat._id) {
                    byCategory[stat._id] = stat.count;
                }
            });

            const recentEvents = await Event.find()
                .select("title slug category status date location createdAt")
                .sort({ createdAt: -1 })
                .limit(5);

            return {
                total: statusStats?.total || 0,
                published: statusStats?.published || 0,
                draft: statusStats?.draft || 0,
                completed: statusStats?.completed || 0,
                cancelled: statusStats?.cancelled || 0,
                byCategory,
                recentEvents,
            };
        } catch (error) {
            throw new AppError("Failed to compute event statistics", 500, error);
        }
    }
}

export default MongoEventRepository;
