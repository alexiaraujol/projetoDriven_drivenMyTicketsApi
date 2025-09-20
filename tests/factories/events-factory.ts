

import prisma from "../../src/database";
import { faker } from "@faker-js/faker"

export async function createNewEventBody() {
    return {
        name: faker.company.name(),
        date: faker.date.future().toISOString()
    }

}


export async function createNewEvent() {
    return await prisma.event.create({
        data: {
            name: faker.company.name(),
            date: faker.date.future()
        }
    })
}
