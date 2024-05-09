const { PrismaClient } = require("@prisma/client");
const database = new PrismaClient();

async function main() {
    try {
        await database.category.createMany({
            data: [
                {
                    name: "Computer Science",
                },
                {
                    name: "Maths",
                },
                {
                    name: "Engineering",
                },
                {
                    name: "Business",
                },
                {
                    name: "Music",
                },
            ]
        })
        console.log("Success");
    } catch (e) {
        console.log("[ERROR SEEDING DB]",e)
    } finally {
        await database.$disconnect();
    }
}

main();