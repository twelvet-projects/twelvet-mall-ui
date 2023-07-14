import React, {useEffect, useState} from 'react'
import {Checkbox} from 'antd'
import {getDictionariesType} from './service'
import {system} from '@/utils/twelvet'

/**
 * 字典模块数据管理类型选择器
 */
const DictionariesCheckbox: React.FC<{
  type: string
}> = (props) => {

  const [treeData, setTreeData] = useState<any>([])

  const {type} = props

  const makeTree = async () => {
    try {
      const {data} = await getDictionariesType(type)

      // 制作数据
      const tree: any = []
      data.map((item: {
        dictCode: number
        dictValue: string
        dictLabel: string
      }) => {
        tree.push(
          {label: item.dictLabel, value: item.dictValue}
        )
      })

      setTreeData(tree)

    } catch (e) {
      system.error(e)
    }
  }

  useEffect(() => {
    makeTree()
  }, [])

  return (
    <Checkbox.Group
      {...props}
      options={treeData}
    />
  )

}

export default DictionariesCheckbox
