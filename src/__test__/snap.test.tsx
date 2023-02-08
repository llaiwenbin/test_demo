import renderer from 'react-test-renderer';
import Link from '../components/Link';
import { asyncSleep } from '../utils/FakeTimer';
// 快照：一般对稳定不修改的方法或者组件进行快照，这样可以节约单元测试时间可以保证dom结构不改变
// https://jestjs.io/docs/snapshot-testing
describe('快照', () => {
  // 对方法进行快照 -- 还是推荐用单测的断言吧
  test('renders correctly', () => {
    expect(asyncSleep.toString()).toMatchSnapshot();
  })

  // 只对最终渲染效果进行快照，渲染效果一般和输入相关，如果输入改变也可能导致快照不通过
  test('对组件进行快照', () => {
    const link = renderer
      .create(<Link page="http://www.facebook.com">Facebook</Link>)
      .toJSON();
    expect(link).toMatchSnapshot()

    // 修改输入快照失败
    // const link = renderer
    //   .create(<Link page="123">Facebook</Link>)
    //   .toJSON();
    // expect(link).toMatchSnapshot()
  })
  
  // 通过提供的匹配器进行快照
  it('对变量对象进行快照', () => {
    const user = {
      createdAt: new Date(),
      id: Math.floor(Math.random() * 20),
      name: 'LeBron James',
    };

    expect(user).toMatchSnapshot({
      createdAt: expect.any(Date),
      id: expect.any(Number),
    });
  });

});
