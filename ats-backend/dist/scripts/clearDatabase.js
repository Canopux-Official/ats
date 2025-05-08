"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function clearDatabase() {
    await prisma.jobResume.deleteMany({});
    await prisma.job.deleteMany({});
    await prisma.resume.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('✅ All data cleared!');
}
clearDatabase()
    .catch((err) => {
    console.error(err);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=clearDatabase.js.map