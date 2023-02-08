
// https://jestjs.io/docs/timer-mocks
import { sleep, asyncSleep } from "../utils/FakeTimer";
// 主要是对setTimeout之类延时处理API的重写，使得可以自由控制时间无需等待。

// useFakeTimers 启动假定时器
// useRealTimers 启动真定时器
// runAllTimers 启动所有定时器
// runOnlyPendingTimers 只运行等待的定时器
// advanceTimersByTime 提前具体毫秒执行 调用此 API 时，所有计时器都会提前msToRun毫秒。将执行所有已通过setTimeout()or排队setInterval()

describe("examples for fakeTimers", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    // 实现每一次测试结束后恢复真实的定时器。
    jest.useRealTimers();
  });
  test("测试简单定时器", async () => {
    const res = sleep(6000, "this is a simple setTimeout test");
    jest.runAllTimers();
    await expect(res).resolves.toBe("this is a simple setTimeout test");
  });

  test("测试异步定时器", async () => {
    const mockFun = jest.fn()
    const res = asyncSleep(6000, mockFun);
    jest.runAllTimers();
    await Promise.resolve();
    expect(mockFun).toHaveBeenCalledTimes(1)
    expect(mockFun).toHaveBeenCalled()
  });
});
