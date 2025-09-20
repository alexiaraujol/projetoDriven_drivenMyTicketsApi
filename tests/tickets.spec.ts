import prisma from "../src/database";
import app from "../src/index";
import supertest from "supertest";
import { createNewTicket } from "./factories/tickets-factory";
import { createNewEvent, createNewEventBody } from "./factories/events-factory";
import { faker } from "@faker-js/faker";


const api = supertest(app);

beforeEach(async () => {
    await prisma.ticket.deleteMany()
    await prisma.event.deleteMany()
})

describe("POST /tickets", () => {


    it("create a new tickets", async () => {

        const data = await createNewTicket();
        const { status, body } = await api.post("/tickets").send(data)
        expect(status).toBe(201);


    })


    it("should return 422 if the request body is invalid", async () => {
      const res = await api.post('/tickets').send({});
      expect(res.status).toBe(422);
    });


    it("should return status 409", async () => {

        const data = await createNewTicket();

        const res1 = await api.post("/tickets").send(data);
        expect(res1.status).toBe(201);
        const res2 = await api.post("/tickets").send(data);
        expect(res2.status).toBe(409);


    })

    it('should return 404 if eventId ', async () => {
      const body = {
        owner: faker.name.fullName(),
        code: faker.random.numeric(8),
        eventId: 999999,
      };

      const res = await api.post('/tickets').send(body);
      expect(res.status).toBe(404);
    });

     it("should return 403 if the event has already passed (expired ticket)", async () => {
      const pastEvent = await prisma.event.create({
        data: {
          name: faker.lorem.words(3),
          date: faker.date.past(),
        },
      });

      const body = {
        owner: faker.name.fullName(),
        code: faker.random.numeric(8),
        eventId: pastEvent.id,
      };

      const res = await api.post('/tickets').send(body);
      expect(res.status).toBe(403);
      expect(typeof res.text).toBe('string');
      expect(res.text.toLowerCase()).toMatch(/already happened/);
    });


})



describe("GET /tickets", () => {

    it("should return an especific ticket", async () => {

        const newTicket = await createNewTicket();
        const postResponse = await api.post("/tickets").send(newTicket);
        expect(postResponse.status).toBe(201);

        const ticketId = postResponse.body.id;
        const { status, body } = await api.get(`/tickets/${ticketId}`);
        expect(status).toBe(200);

        expect(postResponse.body).toMatchObject({
            code: postResponse.body.code,
            owner: postResponse.body.owner,
            eventId: postResponse.body.eventId
        });


    })



})

