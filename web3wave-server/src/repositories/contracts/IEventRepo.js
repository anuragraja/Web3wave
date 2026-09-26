class IEventRepository {
    async createEvent(eventData) {
        throw new Error("Method not implemented");
    }

    async findEventById(id) {
        throw new Error("Method not implemented");
    }

    async findEventBySlug(slug) {
        throw new Error("Method not implemented");
    }

    async findAllAdminEvents(options) {
        throw new Error("Method not implemented");
    }

    async findAllPublicEvents(options) {
        throw new Error("Method not implemented");
    }

    async updateEvent(id, updateData) {
        throw new Error("Method not implemented");
    }

    async deleteEvent(id) {
        throw new Error("Method not implemented");
    }

    async getEventStats() {
        throw new Error("Method not implemented");
    }
}

export default IEventRepository;
