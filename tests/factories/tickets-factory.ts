import { faker } from "@faker-js/faker";
import { createNewEvent } from "./events-factory";


export async function createNewTicket() {

    const event = await createNewEvent();

    return {
        code: faker.random.numeric(16).toString(),
        owner: faker.name.fullName(),
        eventId: Number(event.id)

    }


}
export async function createNewTicketBody() {

    const event = await createNewEvent();

    return {
        code: faker.random.numeric(16).toString(),
        owner: faker.name.fullName(),
        eventId: Number(event.id)

    }


}