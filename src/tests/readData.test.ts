import * as query from "../query";

beforeEach(() => {
    jest.clearAllMocks();
});

// mock of checkRedemptions
jest.spyOn(query, "checkRedemptions").mockImplementation(jest.fn())

const validStaffPass = "12345678";
const validTeamName = "team"
const validTime = "1620645693402";

// mock of createReadStream
jest.spyOn(require("fs"), "createReadStream").mockReturnValue({
    pipe: jest.fn().mockReturnThis(),
    on: jest.fn().mockImplementation((event, handler) => {
        if (event === "data") {
            handler([validStaffPass, validTeamName, validTime]);
        } else {
            handler();
        }
        return this;
    }),
    close: jest.fn()
})

it("should call checkRedemptions when staffPass is found", () => {
    query.readData(validStaffPass);
    expect(query.checkRedemptions).toHaveBeenCalledWith(validTeamName);
})

it("should not call checkRedemptions when staffPass is not found", () => {
    const invalidStaffPass = "1111111";
    query.readData(invalidStaffPass);
    expect(query.checkRedemptions).toHaveBeenCalledTimes(0);
})
