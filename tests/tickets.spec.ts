import prisma from "../src/database";
import app from "../src/index";
import supertest from "supertest";


const api = supertest(app);

beforeEach(async () => {
    await prisma.ticket.deleteMany()
    await prisma.event.deleteMany()
})

describe("POST /tickets", () => {


    it("create a new tickets", async () => {

        const { id } = await prisma.event.create({
            data: {
                name: "driven",
                date: "2025-09-13T00:00:00.000Z"
            }
        })

        const { status, body } = await api.post("/tickets").send({
            code: "2541494168796519",
            owner: "Alexia",
            eventId: id
        })
        expect(status).toBe(201);

    })
})



describe("GET /tickets", () => {

    it("should return an especific ticket", async () => {

        const { id } = await prisma.event.create({
            data: {
                name: "driven",
                date: "2025-09-13T00:00:00.000Z"
            }
        })



        const { status, body } = await api.get(`/tickets/${id}`);
        expect(status).toBe(200);

        expect(body).toMatchObject({
            "eventId": id
        })

    })

})

