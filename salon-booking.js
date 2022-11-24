function salonBooking(db) {
    //find stylist
    async function findStylist(phone_number) {
        return db.oneOrNone('select * from stylist where phone_number = $1', phone_number);
    }
    //find client
    async function findClient(phone_number) {
        return db.oneOrNone('select * from clients where phone_number = $1', phone_number);
    }
    //find treatment by code
    async function findTreatment(code) {
        return db.oneOrNone('select * from treatments where code = $1', code);
    }
    //find all treatments
    async function findAllTreatments() {
        return db.any('select * from treatments');
    }
    //make a booking
    async function makeBooking(clientId, treatmentId, stylistId, date, time) {
        const treatMentCount = await db.oneOrNone('select count(*) from bookings where treatment_id = $1 and the_date = $2 and the_time = $3', [treatmentId, date, time]);
        const stylistCount = await db.oneOrNone('select count(*) from bookings where stylist_id = $1 and the_date = $2 and the_time = $3', [stylistId, date, time]);
        if (treatMentCount.count < 2 && stylistCount.count < 2) {
        return db.manyOrNone('insert into bookings (client_id, treatment_id, stylist_id, the_date, the_time) values ($1, $2, $3, $4, $5) returning *', [clientId, treatmentId, stylistId, date, time]);
        }
        else {
            return null;
        }
    }
    //find all bookings for a client
    async function findClientBookings(clientId) {
        return db.manyOrNone('select * from bookings where client_id = $1', clientId);
    }
    //find all bookings for a date
    async function findAllBookings(date) {
        return db.manyOrNone('select * from bookings where the_date = $1', date);
    }
    //total income for a date
    async function totalIncomeForDay(date) {
        return db.oneOrNone('select sum(price) from bookings join treatments on bookings.treatment_id = treatments.id where the_date = $1', date);
    }
    //most vauluable client
    async function mostValuableClient() {
        return db.oneOrNone('select clients.first_name, clients.phone_number, sum(price) from bookings join treatments on bookings.treatment_id = treatments.id join clients on bookings.client_id = clients.id group by clients.first_name, clients.phone_number order by sum desc limit 1');
    }

    return {
        findStylist,
        findClient,
        findTreatment,
        findAllTreatments,
        makeBooking,
        findClientBookings,
        findAllBookings,
        totalIncomeForDay,
        mostValuableClient
    }
}

export default salonBooking;
