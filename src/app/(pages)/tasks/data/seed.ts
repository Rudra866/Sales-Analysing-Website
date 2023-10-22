import fs from "fs"
import path from "path"
import {faker, fakerEN_CA} from "@faker-js/faker"

// todo have numbers that make sense.

const new_vehicle_sales = Array.from({ length: 100 }, () => ({
    stock_number: faker.number.int(1000),
    sales_rep: `${faker.person.firstName()} ${faker.person.lastName()}`,
    fin_mgr: `${faker.person.firstName()} ${faker.person.lastName()}`,
    financing: faker.helpers.arrayElement(['TD', 'RBC', 'BNS', 'CIBC', 'BMO']),
    customer_name: `${faker.person.firstName()} ${faker.person.lastName()}`,
    city: fakerEN_CA.location.city(),
    vehicle_make: faker.vehicle.manufacturer(),
    trade_in: faker.vehicle.manufacturer(),
    actual_cash_value: faker.finance.amount(1000, 100000, 2),
    gross_profit: faker.finance.amount(1000, 100000, 2),
    gross_profit_MTD: faker.finance.amount(1000, 100000, 2),
    f_i_gross: faker.finance.amount(1000, 100000, 2),
    f_i_gross_MTD: faker.finance.amount(1000, 100000, 2),
    hold_back_MTD: faker.finance.amount(1000, 100000, 2),
    total: faker.finance.amount(1000, 100000, 2),
    total_MTD: faker.finance.amount(1000, 100000, 2)
}))


fs.writeFileSync(
    path.join(__dirname, "new_vehicle_sales.json"),
    JSON.stringify(new_vehicle_sales, null, 2)
)

console.log("new_vehicle_sales.json created")
