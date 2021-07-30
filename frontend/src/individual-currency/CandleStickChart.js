import React from 'react';
import 'fomantic-ui-css/semantic.css';
import Chart from "react-apexcharts";

class CandleStickChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: {
                colors: ["#f98815", "#158bf9", "#15f9f3", "#ee240e" ],
                chart: {
                  id: "candle-stick",
                  height: 600,
                  type: "candlestick",
                  animations: {
                    enabled: false
                  }
                },
                tooltip: {
                  enabled: true,
                },
                xaxis: {
                  type: 'category',                 
                  tooltip: {
                    enabled: true
                  }
                },
                yaxis: {
                  tooltip: {
                    enabled: true
                  },
                  labels: {
                    minWidth: 1,
                    formatter: (value) => { return value }
                  },
                  seriesName: "candlestick"
                },
                title: {
                  text: 'CandleStick Chart',
                  align: 'left'
                },
                stroke: {
                  curve : "smooth",
                  width : 3,
                  colors: ["#f98815", "#158bf9", "#15f9f3", "#ee240e" ]
                },
                legend: {
                  show: true,
                  labels: {
                    useSeriesColors: true
                  }
                }
          },
          series: [{
            name: 'Candle Stick',
            type: 'candlestick',
            data: this.props.candleStickData
          },{
            name: 'MA - 1',
            type: 'line',
            data: this.props.movingAverage01Data
          },{
            name: 'MA - 2',
            type: 'line',
            data: this.props.movingAverage02Data
          },
          {
            name: 'EMA -  1',
            type: 'line',
            data: this.props.expMovingAverage01Data
          },
          {
            name: 'EMA - 2',
            type: 'line',
            data: this.props.expMovingAverage02Data
          }]
        
        }
    }


    render () {
        return (
            <Chart
            options={this.state.options}
            type="candlestick"
            series={this.state.series}
            width="100%"
            height="600"
        />
        )
    }
}


export default CandleStickChart
