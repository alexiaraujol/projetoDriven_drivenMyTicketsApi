import { CreateEventData } from "repositories/events-repository";
import prisma from "../../src/database";

export async function createNewEvent(data: CreateEventData){
    return await prisma.event.create({
            data: {
                name: data.name,
                date: data.date
            }
        })
}