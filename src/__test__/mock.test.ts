// 异步： https://jestjs.io/docs/tutorial-async
// 手动模拟： https://jestjs.io/docs/manual-mocks
// 

import axios from 'axios';
import Users from '../api/users';
// jest.mock可以进行模拟路径、库的模拟


// 手动模拟：如果在 ../api/users-request/request 下有 __mocks__ 目录则走对应__mocks__/request下的代码
jest.mock('../api/users-request/request');
// 自动模拟：将axios内所有方法都进行 ，为方法添加对应方法和参数。
jest.mock('axios');
import moduleName, { foo } from '../utils/modulesName'
import * as user from '../api/users-request';

// 最重要的部分，使用 mock 对方法、api等进行模拟，相当于加了一层代理，使得mock对象可以被监听到、获取到被调用的次数、参数以及可以重写内容等。一般用来模拟库、文件、方法输入输出。
// mock和 spy 很类似，spy是只对对象的某个方法进行 mock，一般场景都够用了。mock对整个库、文件、方法进行 mock或者是重写。
// mock操作包括: jest.fn、mock、spy

describe('mock方法 模拟返回值、获取返回值、获取参数操作', (): void => {
  test('jest.fn', () => {
    // jest.fn 可以返回一个被模拟的方法，这个方法可以被计算到当前方法被调用次数、参数等等。
    // 参数为空时默认为 ()=>{}
    jest.fn(x => 42 + x);
    const mockCallback = jest.fn(x => 42 + x);
  });
  test('使用 jest.fn 来 mock forEach 获取参数、返回值、调用次数', () => {
    // jest.fn 可以返回一个被模拟的方法，这个方法可以被计算到当前方法被调用次数、参数等等。
    // 参数为空时默认为 ()=>{}
    const mockCallback = jest.fn(x => 42 + x);
    function forEach(items: number[], callback: jest.Mock<any, [x: any], any>) {
      for (let index = 0; index < items.length; index++) {
        callback(items[index]);
      }
    }
    forEach([0, 1], mockCallback);

    // 方法被调用2次
    expect(mockCallback.mock.calls).toHaveLength(2);
    console.log(`mockCallback.mock.calls`, mockCallback.mock.calls);
    // [ [ 0,2,3 ], [ 1 ] ]

    // 第一次调用的第1个参数为0
    expect(mockCallback.mock.calls[0][0]).toBe(0);

    // 第一次调用的第2个参数为1
    expect(mockCallback.mock.calls[1][0]).toBe(1);

    // [ { type: 'return', value: 42 }, { type: 'return', value: 43 } ]
    console.log('mockCallback.mock.results', mockCallback.mock.results);
    expect(mockCallback.mock.results[0].value).toBe(42);

    // mockCallback.mock.contexts 用于bind、apply、call
    // mockCallback.mock.instances 用于实例对象

  });

  test('mock返回值 ', () => {
    const myMock = jest.fn();
    console.log(myMock());
    // > undefined

    // 大多数现实世界例子中，实际是在依赖的组件上配一个模拟函数并配置它，但手法是相同的。 在这些情况下，尽量避免在非真正想要进行测试的任何函数内实现逻辑。
    myMock.mockReturnValueOnce(10).mockReturnValueOnce('x').mockReturnValue(true);

    console.log(myMock(), myMock(), myMock(), myMock());
    // > 10, 'x', true, true
  });
});

describe('对路径、第三方库进行 mock、doMock ', () => {
  test('jest进行mock、doMock', () => {

    // jest.mock(moduleName, factory, options)
    // moduleName 模块名
    // 具体模块模拟内容
    // options :{virtual: true},用于创建虚拟模拟

    // 使用 时babel-jest，对 的调用mock将自动提升到代码块的顶部。可以使用jest.doMock避免

    jest.mock('../utils/modulesName', () => {
      return {
        // es6模块需要手动添加
        __esModule: true,
        default: jest.fn(() => 42),
        foo: jest.fn(() => 43),
      };
    });

    // doMock 和 mock使用方法一模一样
    // 但是只会对我们这个 test 生效，而不会提升到 import 之前去覆写原有模块，
    // jest.doMock('../utils/modulesName', () => {
    //   return {
    //     // es6模块需要手动添加
    //     __esModule: true,
    //     default: jest.fn(() => 42),
    //     foo: jest.fn(() => 43),
    //   };
    // });

    moduleName(); // Will return 42
    foo(); // Will return 43

  });


  // mockFn.mockReturnValue(value)	Mock 返回值，同步
  // mockFn.mockReturnValueOnce(value)	Mock 返回值，同步，只生效一次
  // mockFn.mockResolvedValue(value)	Mock resolve 返回值，异步
  // mockFn.mockResolvedValueOnce(value)	Mock resolve 返回值，异步，只生效一次
  // mockFn.mockRejectedValue(value)	Mock reject 返回值，异步
  // mockFn.mockRejectedValueOnce(value)	Mock reject 返回值，异步, 只生效一次

  test('模拟 api 请求', () => {
    const users = [{ name: 'Bob' }];
    const resp = { data: users };
    // axios.get.mockResolvedValue(resp);

    // or you could use the following depending on your use case:
    axios.get.mockImplementation(() => Promise.resolve(resp))

    return Users.all().then(data => expect(data).toEqual(users));
  });

  test('模拟实现函数', () => {
    // jest.fn(implementation)是 的简写jest.fn().mockImplementation(implementation)。
    const myMockFn = jest
      .fn(() => 'default')
      .mockImplementationOnce(() => 'first call')
      .mockImplementationOnce(() => 'second call');

    console.log(myMockFn(), myMockFn(), myMockFn(), myMockFn());
    // > 'first call', 'second call', 'default', 'default'
  });


  //断言必须返回一个primose
  // 注意：为了正确模拟，Jest 需要​jest.mock('moduleName')​与​require/import​语句在同一范围内。
  // Testing promise can be done using `.resolves`.
  test('通过return Promise 使得测试等待', () => {
    expect.assertions(1);
    // 有一个 expect被执行
    return expect(user.getUserName(5)).resolves.toBe('Paul');
  });
  // expect.test.ts promise可以看到基本操作

  // The assertion for a promise must be returned.
  test('通过链式调用来断言', () => {
    expect.assertions(1);
    return user.getUserName(4).then(data => expect(data).toBe('Mark'));
  });

  // async/await can be used.
  test('async await 等待测试', async () => {
    expect.assertions(1);
    const data = await user.getUserName(4);
    expect(data).toBe('Mark');
  });

  // async/await can also be used with `.resolves`.
  test('works with async/await and resolves', async () => {
    expect.assertions(1);
    await expect(user.getUserName(5)).resolves.toBe('Paul');
  });


  // Testing for async errors using `.rejects`.
  test('tests error with rejects', () => {
    expect.assertions(1);
    return expect(user.getUserName(3)).rejects.toEqual({
      error: 'User with 3 not found.',
    });
  });

  // Testing for async errors using Promise.catch.
  test('promise catch错误', async () => {
    expect.assertions(1);
    return user.getUserName(2).catch(e =>
      expect(e).toEqual({
        error: 'User with 2 not found.',
      }),
    );
  });

  // Or using async/await.
  test('promise try catch错误', async () => {
    expect.assertions(1);
    try {
      await user.getUserName(1);
    } catch (e) {
      expect(e).toEqual({
        error: 'User with 1 not found.',
      });
    }
  });

  // Or using async/await with `.rejects`.
  test('promise async/await 的 rejects', async () => {
    expect.assertions(1);
    await expect(user.getUserName(3)).rejects.toEqual({
      error: 'User with 3 not found.',
    });
  });
});
