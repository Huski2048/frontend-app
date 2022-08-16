import React from 'react'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
import ReactEcharts from 'echarts-for-react'
import useTheme from 'hooks/useTheme'

const TimeChart = ({ xAxisdata, chartData1, chartData2, tokenName, quoteTokenName }) => {
  const { isDark } = useTheme()

  const getTimeOption = () => {
    const option = {
      tooltip: {
        formatter: (params) => {
          // console.info('time', params)
          return `${params[1]?.name}<br />
                            ${params[0]?.marker} ${params[0]?.seriesName}: ${(params[0]?.data * 100).toFixed(2)}%<br />
                            ${params[1]?.marker} ${params[1]?.seriesName}: ${(params[1]?.data * 100).toFixed(2)}%`
        },
        trigger: 'axis',
      },
      grid: {
        left: '3%',
        right: '12%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxisdata,
        axisLabel: {
          formatter: (value) => {
            return value ? `${value}` : ''
          },
        },
      },
      yAxis: {
        name: 'ROI%',
        nameLocation: 'center',
        nameRotate: '90',
        nameGap: 30,
        nameTextStyle: {
          padding: [0, 0, 10, 0],
        },
        type: 'value',
        axisLabel: {
          formatter: (value) => {
            return `${value * 100}%`
          },
        },
        splitLine: {
          lineStyle: {
            color: isDark ? '#ffe7eb1a' : '#0000001a',
            width: 1,
          },
        },
      },
      series: [
        {
          name: `${tokenName}`,
          type: 'line',
          symbol: 'none',
          symbolSize: 8,
          itemStyle: {
            color: '#FF7D04',
          },
          data: chartData1,
          endLabel: {
            show: true,
            formatter(params) {
              return `In ${params?.seriesName}`
            },
          },
        },
        {
          name: `${quoteTokenName}`,
          type: 'line',
          symbol: 'none',
          symbolSize: 8,
          itemStyle: {
            color: '#7B3FE4',
          },
          data: chartData2,
          endLabel: {
            show: true,
            formatter(params) {
              return `In ${params?.seriesName}`
            },
          },
        },
      ],
    }

    return option
  }

  return (
    <div>
      <ReactEcharts option={getTimeOption()} style={{ height: '500px' }} />
    </div>
  )
}

export default TimeChart
