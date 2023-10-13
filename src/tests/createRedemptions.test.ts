import { appendFileSync } from "fs";

import * as query from "../query";

beforeEach(() => {
    jest.clearAllMocks();
});

const existingTeamName = "team";
const validTime = "1620645693402";

// mock of appendFileSync
jest.spyOn(require("fs"), "appendFileSync").mockImplementation(jest.fn());

// mock of createReadStream
jest.spyOn(require("fs"), "createReadStream").mockReturnValue({
    pipe: jest.fn().mockReturnThis(),
    on: jest.fn().mockImplementation((event, handler) => {
        if (event === "data") {
            handler([existingTeamName, validTime]);
        } else {
            handler();
        }
        return this;
    })
})

it("should call appendFileSync when team gift is not redeemed", () => {
    const teamName = "hufflepuff";
    query.checkRedemptions(teamName);
    expect(appendFileSync).toHaveBeenCalled();
})

it("should not call appendFileSync when team gift is redeemed", () => {
    query.checkRedemptions(existingTeamName);
    expect(appendFileSync).toHaveBeenCalledTimes(0);
})
