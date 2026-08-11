import { calculate7DayNetExertion } from "./calculate7DayNetExertion";
import { exertionCalculation } from "./exertionCalculation";
import { recoveryCalculation } from "./recoveryCalculation";

jest.mock("./exertionCalculation", () => ({
  exertionCalculation: jest.fn(),
}));

jest.mock("./recoveryCalculation", () => ({
  getRecoveryCalculationInput: jest.fn((daylog) => daylog),
  recoveryCalculation: jest.fn(),
}));

describe("calculate7DayNetExertion", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("applies the previous day's recovery before adding today's exertion", () => {
    const targetDate = new Date(2026, 7, 7);
    const history = {
      "2026-08-06": {
        id: "day-1",
        dateString: "2026-08-06",
        exercises: [],
        meals: [],
        sleep: [],
      },
      "2026-08-07": {
        id: "day-2",
        dateString: "2026-08-07",
        exercises: [],
        meals: [],
        sleep: [],
      },
    };

    (exertionCalculation as jest.Mock)
      .mockReturnValueOnce({ chest: 0.8 })
      .mockReturnValueOnce({ chest: 0.3 });
    (recoveryCalculation as jest.Mock)
      .mockReturnValueOnce(0.75) // recovery index for 2026-08-06
      .mockReturnValueOnce(0.5); // recovery index for 2026-08-07 - wont be used because recovery applies to the next day

    const result = calculate7DayNetExertion(history, targetDate);

    expect(result.chest).toBe(0.7); // 0.8 * (0.2 + 0.4 * 0.75) + 0.3 = 0.7
  });
});