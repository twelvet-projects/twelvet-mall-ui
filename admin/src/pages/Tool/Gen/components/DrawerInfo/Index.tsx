import React, { useRef, useState } from 'react';

import { ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { proTableConfigs } from '@/setting';
import { Button, Divider, Drawer, message } from 'antd';
import type { FormInstance } from 'antd/lib/form';
import { pageQuery, importTable } from './service';
import { system } from '@/utils/twelvet';
import type { Key } from 'antd/lib/table/interface';

/**
 * 数据导入
 */
const DrawerInfo: React.FC<{
  visible: boolean;
  onClose: () => void;
}> = (props) => {
  const acForm = useRef<ActionType>();

  const formRef = useRef<FormInstance>();

  const [state] = useState<ToolGenDrawerInfo.State>({
    pageSize: 10,
  });

  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const { visible, onClose } = props;

  /**
   * 关闭抽屉
   */
  const close = () => {
    if (!loading) {
      onClose();
    }
  };

  /**
   * 导入数据表
   */
  const importTableRef = async () => {
    try {
      setLoading(true);

      const { code, msg } = await importTable(selectedRowKeys);

      if (code !== 200) {
        return message.error(msg);
      }
      message.success(msg);
      close();
    } catch (e) {
      system.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Form参数
  const columns: ProColumns<ToolGenDrawerInfo.PageListItem>[] = [
    {
      title: '表名称',
      ellipsis: true,
      width: 200,
      valueType: 'text',
      dataIndex: 'tableName',
    },
    {
      title: '表描述',
      width: 200,
      valueType: 'text',
      dataIndex: 'tableComment',
    },
    {
      title: '创建时间',
      search: false,
      width: 200,
      valueType: 'text',
      dataIndex: 'createTime',
    },
    {
      title: '更新时间',
      search: false,
      width: 200,
      valueType: 'dateTime',
      dataIndex: 'updateTime',
    },
  ];

  return (
    <Drawer
      // 关闭时销毁子元素
      destroyOnClose={true}
      width="80%"
      placement="right"
      closable={false}
      onClose={() => {
        close();
      }}
      open={visible}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={() => close()}>取消</Button>
          <Divider type="vertical" />
          <Button loading={loading} type="primary" onClick={() => importTableRef()}>
            导入
          </Button>
        </div>
      }
    >
      <ProTable<ToolGenDrawerInfo.PageListItem, ToolGenDrawerInfo.PageParams>
        {...proTableConfigs}
        pagination={{
          // 是否允许每页大小更改
          showSizeChanger: true,
          // 每页显示条数
          pageSize: state.pageSize,
        }}
        headerTitle="数据导入"
        actionRef={acForm}
        formRef={formRef}
        rowKey="tableName"
        columns={columns}
        request={async (params) => {
          const { data } = await pageQuery(params);
          const { records, total } = data;
          return Promise.resolve({
            data: records,
            success: true,
            total,
          });
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => {
            setSelectedRowKeys(keys);
          },
        }}
        toolBarRender={() => []}
      />
    </Drawer>
  );
};

export default DrawerInfo;
