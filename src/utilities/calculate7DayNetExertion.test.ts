import { calculate7DayNetExertion } from "./calculate7DayNetExertion";

describe("calculate7DayNetExertion", () => {
  it("generates the last 7 consecutive date keys ending on the target date", () => {
    
    const targetDate = new Date(2026, 7, 7);

    const result = calculate7DayNetExertion({}, targetDate);

    console.log("Generated 7-Day List:", result);

    expect(result).toEqual([
      { dateString: "2026-08-07" },
      { dateString: "2026-08-06" },
      { dateString: "2026-08-05" },
      { dateString: "2026-08-04" },
      { dateString: "2026-08-03" },
      { dateString: "2026-08-02" },
      { dateString: "2026-08-01" },
    ]);
  });
});