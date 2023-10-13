import { createReadStream, appendFileSync } from "fs";
import { parse } from "csv-parse";

const longCsv = "./data/team-mapping-long.csv"
const shortCsv = "./data/team-mapping.csv"
const redemptionCsv = "./data/redemption-data.csv"

/**
 * Reads data based on staff pass id. Calls checkRedemptions if staff id is found.
 * 
 * @param staffPass 
 */
export const readData = (staffPass: string): void => {
    let readStream = createReadStream(longCsv);
    let readableStream = readStream.pipe(parse({ delimiter: ",", from_line: 2 }));
    readableStream.on("data", (row) => {
        if (staffPass == row[0]) {
            checkRedemptions(row[1]);
            readStream.close();
        }
    });
    readableStream.on("end", () => console.log("Staff id not found"));
}

/**
 * Check if team gift has been redeemed. If not, it redeems the gift
 * and logs it down.
 * 
 * @param teamName
 */
export const checkRedemptions = (teamName: string): void => {
    let flag = true;
    let readStream = createReadStream(redemptionCsv)
    let readableStream = readStream.pipe(parse({ delimiter: ",", from_line: 2 }))
    readableStream.on("data", (row) => {
        if (teamName == row[0]) {
            flag = false;
        }
    });
    readableStream.on("end", () => {
        if (flag) {
            let writeData = `${teamName}, ${Date.now().toString()}\n`
            appendFileSync(redemptionCsv, writeData);
            console.log("Redemption Successful!");
        } else {
            console.log("Gift has been Redeemed!");
        }
    });
}