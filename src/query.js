"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRedemptions = exports.readData = void 0;
const fs_1 = require("fs");
const csv_parse_1 = require("csv-parse");
const longCsv = "./data/team-mapping-long.csv";
const shortCsv = "./data/team-mapping.csv";
const redemptionCsv = "./data/redemption-data.csv";
/**
 * Reads data based on staff pass id.
 *
 * @param staffPass
 */
const readData = (staffPass) => {
    let readStream = (0, fs_1.createReadStream)(longCsv);
    let readableStream = readStream.pipe((0, csv_parse_1.parse)({ delimiter: ",", from_line: 2 }));
    readableStream.on("data", (row) => {
        if (staffPass == row[0]) {
            (0, exports.checkRedemptions)(row[1]);
            readStream.close();
        }
    });
    readableStream.on("end", () => console.log("Staff id not found"));
};
exports.readData = readData;
/**
 * Check if team gift has been redeemed. If not, it redeems the gift
 * and logs it down.
 *
 * @param teamName
 */
const checkRedemptions = (teamName) => {
    let flag = true;
    let readStream = (0, fs_1.createReadStream)(redemptionCsv);
    let readableStream = readStream.pipe((0, csv_parse_1.parse)({ delimiter: ",", from_line: 2 }));
    readableStream.on("data", (row) => {
        if (teamName == row[0]) {
            flag = false;
        }
    });
    readableStream.on("end", () => {
        if (flag) {
            let writeData = `${teamName}, ${Date.now().toString()}\n`;
            (0, fs_1.appendFileSync)(redemptionCsv, writeData);
            console.log("Redemption Successful!");
        }
        else {
            console.log("Gift has been Redeemed!");
        }
    });
};
exports.checkRedemptions = checkRedemptions;
