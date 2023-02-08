describe('全局设置jsdom 不存在的 window参数和方法', (): void => {
  test('调用 matchMedia ', () => {
    // 全局设置jsdom 不存在的 window参数和方法 > 调用 matchMedia
    // jest.config.js 中设置 setupFilesAfterEnv
    window.matchMedia()
  });
});