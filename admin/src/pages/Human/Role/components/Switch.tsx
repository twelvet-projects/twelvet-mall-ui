import React, {useState} from 'react'
import {message, Switch} from 'antd'
import {system} from '@/utils/twelvet'
import {changeStatus} from './../service'

/**
 * 状态组件操作
 * @param props row 参数
 */
const RoleSwitch: React.FC<{
  row: Record<string, any>
}> = (props) => {

  const [loading, setLoading] = useState<boolean>(false)
  const [checked, setChecked] = useState<string>(props.row.status)

  const toggle = async () => {
    try {
      setLoading(true);
      const params: { roleId: number, status: string } = {roleId: 0, status: "0"}
      params.roleId = props.row.roleId;
      params.status = checked === '1' ? '0' : '1'
      const {msg} = await changeStatus(params);

      if (checked === '1') {
        setChecked('0')
      } else {
        setChecked('1')
      }

      message.success(msg);
    } catch (e) {
      system.log(e)
    } finally {
      setLoading(false);
    }
  };

  return (
    <Switch
      loading={loading}
      onClick={toggle}
      checked={checked === '0'}
    />
  )
}

export default RoleSwitch
