import prisma from "../src/database";
import app from "../src/index";
import supertest from "supertest";
import { createNewEvent } from "./factories/events-factory";

const api = supertest(app); 

beforeEach(async () => {
    await prisma.ticket.deleteMany()
    await prisma.event.deleteMany()
})

describe("POST /events", () => {

    it("create a new event", async () => {

        const { status, body } = await api.post("/events").send({
            name: "Lia",
            date: "10-09-2025"
        })
        expect(status).toBe(201);

    })
})

describe("GET /events", () => {

    it("should return all event", async () => {

        await createNewEvent("driven", "2025-09-10");
        await createNewEvent("Samba", "2025-09-10");


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

        const { id } = await createNewEvent("driven", "2025-09-10T00:00:00.000Z");

        const { status, body } = await api.get(`/events/${id}`)
        expect(status).toBe(200);
        expect(body).toMatchObject({
            "id": id
        })

    })

})




