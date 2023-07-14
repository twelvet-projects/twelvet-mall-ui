import {request} from '@umijs/max'
import {download} from '@/utils/twelvet'

// 请求的控制器名称
const controller = "/gen";

/**
 * 获取分页 Data
 * @param params 搜索参数
 */
export async function pageQuery(params: Record<string, any>) {
  return request(`${controller}/pageQuery`, {
    method: 'GET',
    params: {
      ...params
    },
  });
}

/**
 * 删除表数据
 * @param tableIds
 */
export async function remove(tableIds: (string | number)[]) {
  return request(`${controller}/${tableIds}`, {
    method: 'DELETE',
  });
}

/**
 * 同步表结构
 * @param tableName 表ID
 */
export async function synchDb(tableName: string) {
  return request(`${controller}/synchDb/${tableName}`, {
    method: 'GET',
  });
}

/**
 * 生成代码
 * @param tableNames 表名称
 */
export async function batchGenCode(tableNames: string[]) {
  return download(`${controller}/batchGenCode?tables=${tableNames}`);
}
