// import { isAbsolutePath } from "../utils/utils";
// import path from "path"

// describe 函数的目的是将多个相关的测试用例分组在一起,以便更好的组织和管理测试.
describe("test isAbsolutePath", () => {

  // const testPath= path.resolve(__dirname,"./index.js")
  // expect(isAbsolutePath(testPath)).toThrow()

  // 用于比较两个值是否完全相等~  test 和it 测试名可以来回切换
  test('test sum', () => {
    expect(2 + 2).toBe(4)
  });

  // 用于深度比较两个值是否完全相等~
  // it("test toEqual", () => {
  //   const arr = ['123']
  //   expect(arr).toEqual(['123'])
  // })
})  