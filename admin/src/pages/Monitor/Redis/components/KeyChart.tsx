import {useEffect, useState} from 'react';
import * as echarts from 'echarts'
import styles from './styles.less';
import React from 'react';
import {Card} from 'antd';

/**
 * 折线图
 */
const LineChart: React.FC<{ dbSize: number, time: string }> = props => {

  // 图表参数
  const {dbSize, time} = props

  const [timeData, setTimeData] = useState<string[]>([])
  const [dbSizeData, setDbSizeData] = useState<number[]>([])

  const config: Record<string, any> = {
    xAxis: {
      data: [],
      boundaryGap: false,
      axisTick: {
        show: false
      }
    },
    grid: {
      left: 10,
      right: 10,
      bottom: 20,
      top: 30,
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      padding: [5, 10]
    },
    yAxis: {
      axisTick: {
        show: false
      }
    },
    legend: {},
    series: [{
      name: 'key数量',
      itemStyle: {
        color: '#FF005A',
        lineStyle: {
          color: '#FF005A',
          width: 2
        },

      },
      smooth: true,
      type: 'line',
      data: [],
      animationDuration: 2000,
      animationEasing: 'cubicInOut',
    },
    ]

  }

  // 设置echarts属性
  const setEcharts = (instance: any | undefined = undefined) => {
    if (!dbSize) {
      return
    }

    const ctr = instance || lineChart

    // 时间
    if (timeData.length >= 6) {
      timeData.shift();
    }
    const timeTemp = [...timeData, time]
    config.xAxis.data.push(...timeTemp)
    setTimeData(timeTemp)

    // 分配内存
    if (dbSizeData.length >= 6) {
      dbSizeData.shift();
    }
    const dbSizeTemp = [...dbSizeData, dbSize]
    config.series[0].data.push(...dbSizeTemp)
    setDbSizeData(dbSizeTemp)
    // 设置数据
    ctr.setOption(config)
    ctr.hideLoading()

  }

  let lineChartRef: HTMLDivElement;
  const [lineChart, setLineChart] = useState()

  // 第一次渲染时执行
  useEffect(() => {
    // 获取echarts实例
    const instance: any = echarts.init(lineChartRef)
    instance.showLoading()
    // 设置参数
    setEcharts(instance)
    // 开启自适应
    window.addEventListener('resize', instance.resize)

    // 设置到state
    setLineChart(instance)

  }, [])

  // 依赖props更新
  useEffect(() => {
    if (!lineChart) {
      return
    }
    setEcharts()
  }, [props])

  return (
    <Card title="key数量">
      <div
        ref={(ref: HTMLDivElement) => {
          lineChartRef = ref
        }}
        className={styles.lineChart}
      />
    </Card>
  )

}

export default LineChart
