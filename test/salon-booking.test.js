import assert from 'assert';
import SalonBooking from '../salon-booking.js';
import pgPromise from 'pg-promise';
import moment from 'moment';

// TODO configure this to work.
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://codex:pg123@localhost:5432/salon_bookings";
const config = {
	connectionString : DATABASE_URL
}

const pgp = pgPromise();
const db = pgp(config);

let booking = SalonBooking(db);

describe("The Booking Salon", function () {

    beforeEach(async function () {
        await db.none(`Truncate table bookings restart identity cascade`);
    });

    it("should be able to list treatments", async function () {
        const treatments = await booking.findAllTreatments();
        console.log(treatments);
        assert.deepEqual([
            {
                code: 'PED',
                id: 1,
                price: '175.00',
                type: 'Pedicure'
            },
            {
                code: 'MAN',
                id: 2,
                price: '215.00',
                type: 'Manicure'
            },
            {
                code: 'MAK',
                id: 3,
                price: '185.00',
                type: 'Makeup'
            },
            {
                code: 'BRO',
                id: 4,
                price: '240.00',
                type: 'Brows and Lashes'
            }
        ], treatments);
    });

    it("should be able to find a stylist", async function () {
        const stylist = await booking.findStylist("01207456789");
        const stylistName = stylist.first_name + " " + stylist.last_name;
        assert.equal('Sive Mavesta', stylistName);
    });

    it("should be able to allow a client to make a booking", async function () {
        const client = await booking.findClient("0120987654");
        const clientId = client.id;
        const clientTreatmentFirstTreatment = "MAN";
        const clientTreatmentSecondTreatment = "PED";
        const clientTreatmentThirdTreatment = "BRO";
        const selectTreatment1 = await booking.findTreatment(clientTreatmentFirstTreatment);
        const selectTreatment2 = await booking.findTreatment(clientTreatmentSecondTreatment);
        const selectTreatment3 = await booking.findTreatment(clientTreatmentThirdTreatment);
        const choosenStylist = "01207459039";
        const choosenStylist2 = "01207440289";
        const selectStylist = await booking.findStylist(choosenStylist);
        const selectStylist2 = await booking.findStylist(choosenStylist2);
        const stylistId = selectStylist.id;
        const stylistId2 = selectStylist2.id;
        const treatmentId = selectTreatment1.id;
        const treatmentId2 = selectTreatment2.id;
        const treatmentId3 = selectTreatment3.id;
        const date = new Date();
        const theDate = moment(date).format("YYYY-MM-DD");
        const time = moment(date).format("LT");
        const roundTime = moment(time, "HH:mm").startOf('hour').format("HH:mm");
         const firstBooking = await booking.makeBooking(clientId, treatmentId, stylistId, theDate, roundTime);
        const secondBooking = await booking.makeBooking(clientId, treatmentId, stylistId, theDate, roundTime);
        const thirdBooking = await booking.makeBooking(clientId, treatmentId, stylistId, theDate, roundTime);
        const fourthBooking = await booking.makeBooking(clientId, treatmentId, stylistId, theDate, roundTime);
        const fifthBooking = await booking.makeBooking(clientId, treatmentId, stylistId, theDate, roundTime);
        const sixthBooking = await booking.makeBooking(clientId, treatmentId2, stylistId2, theDate, roundTime);
        const seventhBooking = await booking.makeBooking(clientId, treatmentId2, stylistId2, theDate, roundTime);
        const eighthBooking = await booking.makeBooking(clientId, treatmentId2, stylistId2, theDate, roundTime);
        const ninthBooking = await booking.makeBooking(clientId, treatmentId2, stylistId2, theDate, roundTime);
        const bookings = await booking.findClientBookings(clientId);
        assert.equal(bookings.length, 4);
    });

    it("should be able to get client booking(s)", async function () {

        const client1 = await booking.findClient("0123456789");
        const client2 = await booking.findClient("0789012345");

        const treatment1 = await booking.findTreatment("PED");
        const treatment2 = await booking.findTreatment("MAN");
        const stylist = await booking.findStylist("01207456789");
        const date = new Date();
        const theDate = moment(date).format("YYYY-MM-DD");
        const time = moment(date).format("LT");
        const roundTime = moment(time, "HH:mm").startOf('hour').format("HH:mm");

        await booking.makeBooking(client1.id, treatment1.id, stylist.id, theDate, roundTime);
        await booking.makeBooking(client1.id, treatment2.id, stylist.id, theDate, roundTime);
        await booking.makeBooking(client2.id, treatment1.id, stylist.id, theDate, roundTime);

        const bookings = await booking.findClientBookings(client1.id);

        assert.deepEqual([
            {
                client_id: client1.id,
                id: 1,
                stylist_id: stylist.id,
                the_date: theDate,
                the_time: roundTime + ":00",
                treatment_id: treatment1.id
            },
            {
                client_id: client1.id,
                id: 2,
                stylist_id: stylist.id,
                the_date: theDate,
                the_time: roundTime + ":00",
                treatment_id: treatment2.id
            }
            ], bookings);
    })

    it("should be able to get bookings for a date", async function () {
        const client1 = await booking.findClient("0123456789");
        const client2 = await booking.findClient("0789012345");

        const treatment1 = await booking.findTreatment("PED");
        const treatment2 = await booking.findTreatment("MAN");
        const treatment3 = await booking.findTreatment("BRO");

        const stylist = await booking.findStylist("01207456789");
        const theDate1 = "2022-11-23";
        const theDate2 = "2022-11-24";
        const theDate3 = "2022-11-25";
        const date = new Date();
        const time = moment(date).format("LT");
        const roundTime = moment(time, "HH:mm").startOf('hour').format("HH:mm");
        await booking.makeBooking(client1.id, treatment1.id, stylist.id, theDate1, roundTime);
        await booking.makeBooking(client1.id, treatment2.id, stylist.id, theDate1, roundTime);
        await booking.makeBooking(client1.id, treatment3.id, stylist.id, theDate1, roundTime);
        await booking.makeBooking(client1.id, treatment2.id, stylist.id, theDate2, roundTime);
        await booking.makeBooking(client2.id, treatment1.id, stylist.id, theDate3, roundTime);
        const selectedDate = await booking.findAllBookings(theDate1);
        assert.deepEqual([
            {
                client_id: client1.id,
                id: 1,
                stylist_id: stylist.id,
                the_date: theDate1,
                the_time: roundTime + ":00",
                treatment_id: treatment1.id
            },
            {
                client_id: client1.id,
                id: 2,
                stylist_id: stylist.id,
                the_date: theDate1,
                the_time: roundTime + ":00",
                treatment_id: treatment2.id
            }
        ], selectedDate);
    });

    it("should be able to find the total income for a day", async function() {
        const client1 = await booking.findClient("0123456789");
        const client2 = await booking.findClient("0789012345");

        const treatment1 = await booking.findTreatment("PED");
        const treatmentPrice1 = treatment1.price;
        const treatment2 = await booking.findTreatment("MAN");
        const treatmentPrice2 = treatment2.price;
        const stylist = await booking.findStylist("01207456789");
        const stylistPercentage = stylist.commission;
        // console.log(stylistPercentage);
        const date = new Date();
        const theDate = moment(date).format("YYYY-MM-DD");
        const time = moment(date).format("LT");
        const roundTime = moment(time, "HH:mm").startOf('hour').format("HH:mm");
        await booking.makeBooking(client1.id, treatment1.id, stylist.id, theDate, roundTime);
        await booking.makeBooking(client1.id, treatment2.id, stylist.id, theDate, roundTime);
        await booking.makeBooking(client2.id, treatment1.id, stylist.id, theDate, roundTime);
        const totalIncome = await booking.totalIncomeForDay(theDate);
        const theTotalSum = totalIncome.sum
        const totalIncomeForDay = totalIncome.sum * (stylistPercentage / 100) * 100;
        const theTotal = theTotalSum - totalIncomeForDay;
        assert.equal(theTotal, 331.5);
    })

    it("should be able to find the most valuable client", async function() {
        const myStylist = await booking.findStylist("01207440289");
        const myStylistId = myStylist.id;
        const treatment = await booking.findTreatment("PED");
        const treatmentId = treatment.id;
        const secondtreatment = await booking.findTreatment("MAN");
        const secondTreatmentId = secondtreatment.id;
        //use 3 clients
        const date = new Date();
        const theDate = moment(date).format("YYYY-MM-DD");
        const time = moment(date).format("LT");
        const roundTime = moment(time, "HH:mm").startOf('hour').format("HH:mm");
        const client1 = await booking.findClient("0123456789");
        const client2 = await booking.findClient("0456789012");
        const client3 = await booking.findClient("0454904321");
        await booking.makeBooking(client1.id, treatmentId, myStylistId, theDate, roundTime);
        await booking.makeBooking(client2.id, treatmentId, myStylistId, theDate, roundTime);
        await booking.makeBooking(client3.id, secondTreatmentId, myStylistId, theDate, roundTime);
        await booking.makeBooking(client1.id, secondTreatmentId, myStylistId, theDate, roundTime);
        const mostValuableClient = await booking.mostValuableClient()
        console.log(mostValuableClient.first_name);
        assert.deepEqual("Jane", mostValuableClient.first_name);
    })
    // it("should be able to find the total commission for a given stylist", function() {
    //     assert.equal(1, 2);
    // })

    after(function () {
        db.$pool.end()
    });

});
