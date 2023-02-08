const videos = require('../utils/spy');
// 和 mock 作用相同
// 通过 jest.spyOn 足够覆盖我们需要的大部分场景，不过它一次只能 mock 一个对应的函数，如果需要对整体模块覆写，那我们还是需要 mock 和 doMock 来协助实现的。
afterEach(() => {
  // 将所有 spyOn 模拟和替换属性恢复为其原始值。
  // 仅适用于使用创建的模拟jest.spyOn()和替换为的属性jest.replaceProperty()；其他模拟将需要您手动恢复它们。
  jest.restoreAllMocks();
});

test('plays videos', () => {
  // videos.play会被模拟，需要通过 jest.restoreAllMocks(); 来恢复
  const spy = jest.spyOn(videos, 'play');

  const isPlaying = videos.play();

  expect(spy).toHaveBeenCalled();
  expect(isPlaying).toBe(true);
});

test('plays videos', () => {
  // 由于调用了 jest.restoreAllMocks(); 所以 videos.play 不再被模拟
  console.log(`videos.play()`, videos.play());
});
