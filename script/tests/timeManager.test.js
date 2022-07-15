const TimeManager = require("../TimeManager.js");

test("First test", () => {
    const time1 = "15:30";
    const time2 = "16:30";

    expect(TimeManager.timeBeforeTime(time1, time2)).toBe(true);
});