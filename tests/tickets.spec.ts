import prisma from "../src/database";
import app from "../src/index";
import supertest from "supertest";
import { createNewTicket, createNewTicketBody } from "./factories/tickets-factory";


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

