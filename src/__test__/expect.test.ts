// 一些基础操作，主要包括
// 类型比较 toBe、toBeCloseTo、not.toBe
// 真实性判断 toBeNaN、toBeTruthy、toBeFalsy、toBeDefined、toBeUndefined
// 引用类型比较、正则匹配、表单验证、错误抛出、自定义匹配器等


describe("基础类型比较", () => {
  test("普通匹配器", () => {
    // tobe
    expect(1 + 1).toBe(2);
    // not
    expect(1 + 1).not.toBe(3);

    // 整数判断
    expect(2 + 1).toBe(3);

    // 浮点数判断 等同于 Object.is 相对于 ===, 它修复了 JavaScript 历史的两个问题，NaN 和 +(-)0 。
    expect(0.2 + 0.1).toBeCloseTo(0.3);

    // ...
    // NaN
    expect(NaN).toBe(NaN);
    expect(NaN).toBeNaN();
    // +0 -0
    expect(+0).not.toBe(-0);

  })
  test("真实性判断", () => {
    // ...
    // boolean
    expect(true).toBe(true);
    expect(true).toBeTruthy();
    expect(false).toBeFalsy;
    // undefined
    expect(undefined).toBe(undefined);
    expect(undefined).not.toBeDefined();
    expect(undefined).toBeUndefined;

    const test = () => {
      console.log(test);
    };
    expect(test()).toBeUndefined();
  })

  test("引用类型的比较", () => {
    const a = { obj1: { name: "obj1", obj2: { name: "obj2" } } };
    const b = Object.assign(a);
    const c = JSON.parse(JSON.stringify(a));
    // toEqual 是采用深度递归的方式进行的原始值比较
    expect(a).toBe(b);
    expect(a).not.toBe(c);
    expect(a).toEqual(b);
    expect(a).toEqual(c);
  })

  test("数字符号", () => {
    // >
    expect(3).toBeGreaterThan(2);
    // <
    expect(3).toBeLessThan(4);
    // >=
    expect(3).toBeGreaterThanOrEqual(3);
    expect(3).toBeGreaterThanOrEqual(2);
    // <=
    expect(3).toBeLessThanOrEqual(3);
    expect(3).toBeLessThanOrEqual(4);
  });

  test("正则匹配", () => {
    expect("This is a regexp validation").toMatch(/regexp/);
    const obj = { prop1: "test", prop2: "regexp validation" };
    const childObj = { prop1: "test" };
    expect(obj).toMatchObject(childObj);
  });

  test("表单验证", () => {
    // toContain(value) ：判定某个值是否存在在数组中。
    // arrayContaining(value)：匹配接收到的数组，与 toEqual 结合使用可以用于判定某个数组是否是另一个数组的子集。
    // toContainEqual(value) ：用于判定某个对象元素是否在数组中。
    // toHaveLength(value)：断言数组的长度 。
    // toHaveProperty(value)：断言对象中是否包含某个属性，针对多层级的对象可以通过 xx.yy 的方式进行传参断言。

    // 数组元素验证
    expect([1, 2, 3]).toContain(1);
    expect([1, 2, 3]).toEqual(expect.arrayContaining([1, 2]));
    expect([{ a: 1, b: 2 }]).toContainEqual({ a: 1, b: 2 });
    // 数组长度
    expect([1, 2, 3]).toHaveLength(3);
    // 对象属性验证
    const testObj = {
      prop1: 1,
      prop2: {
        child1: 2,
        child2: "test",
      },
    };
    expect(testObj).toHaveProperty("prop1");
    expect(testObj).toHaveProperty("prop2.child1");
  });

  test("错误抛出", () => {
    const throwError = () => {
      const err = new Error("console err: this is a test error!");
      throw err;
    };
    expect(throwError).toThrow();
    expect(throwError).toThrowError();

    const catchError = () => {
      try {
        const err = new Error("console err: this is a test error!");
        throw err;
      } catch (err) {
        console.log(err);

      }
    };
    expect(catchError).not.toThrow();
    expect(catchError).not.toThrowError();
  });

  test("同步自定义匹配器", () => {
    const toBeBetweenZeroAndTen = (num: number, b: number) => {
      if (num >= 0 && num <= 10) {
        return {
          message: () => "",
          pass: true,
        };
      } else {
        return {
          message: () => "expected num to be a number between zero and ten",
          pass: false,
        };
      }
    };
    expect.extend({
      toBeBetweenZeroAndTen,
    });
    expect(8).toBeBetweenZeroAndTen(3);
    expect(11).not.toBeBetweenZeroAndTen();
  });

  test("异步自定义匹配器", async () => {
    const toBeBetweenZeroAndTen = async (num: number) => {
      const res = await new Promise<{ message: () => string; pass: boolean }>(
        (resolve) => {
          setTimeout(() => {
            if (num >= 0 && num <= 10) {
              resolve({
                message: () => "",
                pass: true,
              });
            } else {
              resolve({
                message: () =>
                  "expected num to be a number between zero and ten",
                pass: false,
              });
            }
          }, 1000);
        }
      );
      return (
        res || {
          message: () => "expected num to be a number between zero and ten",
          pass: false,
        }
      );
    };
    expect.extend({
      toBeBetweenZeroAndTen,
    });
    await expect(8).toBeBetweenZeroAndTen();
    await expect(11).not.toBeBetweenZeroAndTen();
  });

  test('Promise resolves、rejects判断', () => {
    const params = 'peanut butter';
    const fetchData = (p: string) => Promise.resolve(p)
    const fetchDataErr = (p: string) => Promise.reject(p)
    // 一定不要忘记把整个断言作为返回值返回⸺如果你忘了return语句的话会默认测试结束
    // Promise返回一定要符合resolves、rejects后再进行toBe判断
    // return expect(fetchData(params)).resolves.toBe('peanut butter');
    // return expect(fetchData(params)).rejects.toBe('peanut butter');
    // return expect(fetchDataErr(params)).resolves.toBe('peanut butter');
    return expect(fetchDataErr(params)).rejects.toBe('peanut butter');
  });

  describe('hooks 和作用域', () => {
    // 顶层的 before* 和 after* hook 函数会应用于文件中的每一条测试 在 describe 
    // 块中声明的 hook 函数，只会作用于 describe 中的测试
    beforeAll(() => console.log('1 - beforeAll'));
    afterAll(() => console.log('1 - afterAll'));
    beforeEach(() => console.log('1 - beforeEach'));
    afterEach(() => console.log('1 - afterEach'));

    test('', () => console.log('1 - test'));
    test('', () => console.log('111 - test'));

    describe('Scoped / Nested block', () => {
      beforeAll(() => console.log('2 - beforeAll'));
      afterAll(() => console.log('2 - afterAll'));
      beforeEach(() => console.log('2 - beforeEach'));
      afterEach(() => console.log('2 - afterEach'));

      test('', () => console.log('2 - test'));
    });
  })
  // 1 - beforeAll
  // 1 - beforeEach
  // 1 - test
  // 1 - afterEach

  // 每个it都会触发each hooks
  // 1 - beforeEach
  // 111 - test
  // 1 - afterEach

  // 2 - beforeAll
  // 1 - beforeEach
  // 2 - beforeEach
  // 2 - test
  // 2 - afterEach
  // 1 - afterEach
  // 2 - afterAll
  // 1 - afterAll


  // Jest 会在所有真正的测试开始之前执行测试文件里所有的 describe 处理程序
  describe('执行顺序', () => {
    console.log('describe outer-a');

    describe('describe inner 1', () => {
      console.log('describe inner 1');

      test('test 1', () => console.log('test 1'));
    });

    console.log('describe outer-b');

    test('test 2', () => console.log('test 2'));

    describe('describe inner 2', () => {
      console.log('describe inner 2');

      test('test 3', () => console.log('test 3'));
    });

    console.log('describe outer-c');
  });

  // describe outer-a
  // describe inner 1
  // describe outer-b
  // describe inner 2
  // describe outer-c
  // test 1
  // test 2
  // test 3

  // 多个相同hooks存在时，都会按顺序执行

});