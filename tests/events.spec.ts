import prisma from "../src/database";
import app from "../src/index";
import supertest from "supertest";
import { createNewEvent, createNewEventBody } from "./factories/events-factory";

const api = supertest(app); 

beforeEach(async () => {
    await prisma.ticket.deleteMany()
    await prisma.event.deleteMany()
})

describe("POST /events", () => {

    it("create a new event", async () => {

        const data = await createNewEventBody();
        const { status, body } = await api.post("/events").send(data)
        expect(status).toBe(201);

    }) 
})

describe("GET /events", () => {

    it("should return all event", async () => {

        await createNewEvent();
        await createNewEvent();


        const { status, body } = await api.get("/events")

        expect(status).toBe(200);
        expect(body).toHaveLength(2);
        expect(body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    date: expect.any(String),
                    id: expect.any(Number),
                    name: expect.any(String)
                })
            ])
        )

    })

    it("should return an specific event", async () => {

        const { id } = await createNewEvent();

        const { status, body } = await api.get(`/events/${id}`)
        expect(status).toBe(200);
        expect(body).toMatchObject({
            "id": id
        })

    })

})




