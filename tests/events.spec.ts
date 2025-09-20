import prisma from "../src/database";
import app from "../src/index";
import supertest from "supertest";
import { createNewEvent, createNewEventBody } from "./factories/events-factory";
import { faker } from "@faker-js/faker";

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

    it("should return status 409", async () => {

        const data = await createNewEventBody();
        const res1 = await api.post("/events").send(data);
        expect(res1.status).toBe(201);
        const res2 = await api.post("/events").send(data);
        expect(res2.status).toBe(409);
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
    
    it("should return 404 when not found the event", async () => {

        const {status} = await api.get("/events/1");
        expect(status).toBe(404);

    })

})


describe("PUT /event/:id", () => {

    it("should return status 200 when updateData", async () => {

        const event = await createNewEvent();
        const newDate = faker.date.future();
        const res = await api.put(`/events/${event.id}`).send({
            date: newDate,
            name: event.name
        });

        expect(res.status).toBe(200);
        expect(new Date(res.body.date)).toEqual(newDate);
        expect(res.body.id).toEqual(event.id);

    });
})

describe("DELETE /events/:id", () => {

    it("should return status 200 when delete event", async () => {

        const event = await createNewEvent();


        const res = await api.delete(`/events/${event.id}`);


        expect(res.status).toBe(204);


    });

})

