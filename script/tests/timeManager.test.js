const TimeManager = require("../TimeManager.js");

test("Testing TimeManager", () => {
    const time1 = "15:30";
    const time2 = "16:30";

    expect(TimeManager.timeBeforeTime(time1, time2)).toBe(true);
    expect(TimeManager.timeBeforeTime(time2, time1)).toBe(false);

    expect(TimeManager.durationFitTimeFrame(time1, time2, 60)).toBe(true);
    expect(TimeManager.durationFitTimeFrame(time1, time2, 30)).toBe(true);
    expect(TimeManager.durationFitTimeFrame(time1, time2, 61)).toBe(false);
    expect(TimeManager.durationFitTimeFrame(time1, time2, 1000)).toBe(false);

    expect(TimeManager.timePointWithinFrame(time1, time2, "16:00")).toBe(true);
    expect(TimeManager.timePointWithinFrame(time1, time2, "16:30")).toBe(true);
    expect(TimeManager.timePointWithinFrame(time1, time2, "15:30")).toBe(true);
    expect(TimeManager.timePointWithinFrame(time1, time2, "20:00")).toBe(false);
    expect(TimeManager.timePointWithinFrame(time1, time2, "15:29")).toBe(false);
    expect(TimeManager.timePointWithinFrame(time1, time2, "16:31")).toBe(false);
});