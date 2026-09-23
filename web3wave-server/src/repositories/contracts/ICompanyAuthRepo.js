export default class CompanyRepository {
    async createCompany(companyData) {
        throw new Error("createCompany() must be implemented");
    }

    async findCompanyById(id) {
        throw new Error("findCompanyById() must be implemented");
    }

    async findCompanyByEmail(email) {
        throw new Error("findCompanyByEmail() must be implemented");
    }

    async findCompanyByEmailWithPassword(email) {
        throw new Error("findCompanyByEmailWithPassword() must be implemented");
    }

    async updateCompany(id, companyData) {
        throw new Error("updateCompany() must be implemented");
    }

    async updateCompanyPassword(id, hashedPassword) {
        throw new Error("updateCompanyPassword() must be implemented");
    }

    async deleteCompany(id) {
        throw new Error("deleteCompany() must be implemented");
    }

    async findCompanyByResetToken(resetPasswordToken) {
        throw new Error("findCompanyByResetToken() must be implemented");
    }

    async findAllCompanies(filter = {}, options = {}) {
        throw new Error("findAllCompanies() must be implemented");
    }

    async findCompanyByVerificationToken(id, tokenHash) {
        throw new Error("findCompanyByVerificationToken() must be implemented");
    }

    async updateVerificationToken(id, verifyTokenHash, verifyTokenExpiry) {
        throw new Error("updateVerificationToken() must be implemented");
    }

    async verifyCompanyEmail(id) {
        throw new Error("verifyCompanyEmail() must be implemented");
    }
}