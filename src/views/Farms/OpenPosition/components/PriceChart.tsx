import React from 'react'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
import ReactEcharts from 'echarts-for-react'
import useTheme from 'hooks/useTheme'

const PriceChart = ({ xAxisdata, chartData1, chartData2, tokenName, quoteTokenName }) => {
  const { isDark } = useTheme()

  const getPriceOption = () => {
    const option = {
      tooltip: {
        formatter: (params) => {
          return `${params[1]?.name}%<br />
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
            return `${value}%`
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
              // console.info('as', params)
              return `In ${params?.seriesName}`
            },
          },
          markLine: {
            symbol: ['none', 'none'], // Remove the arrow
            itemStyle: {
              normal: {
                lineStyle: {
                  type: 'line',
                  color: '#6F767E',
                },
                label: {
                  show: false,
                  position: 'start',
                },
              },
            },
            data: [
              {
                xAxis: '0', // False cannot be hidden, so it can be set to -1
              },
            ],
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
              // console.info('a--s', params)
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
      <ReactEcharts option={getPriceOption()} style={{ height: '500px' }} />
    </div>
  )
}

export default PriceChart
