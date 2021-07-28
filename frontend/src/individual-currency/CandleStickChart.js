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
                  type: "line",
                  animations: {
                    enabled: false
                  }
                },
                xaxis: {
                  type: 'category',
                  label: {
                    datetimeUTC: false
                  },
                  crosshairs: {
                    show: true
                  },
                  floating: false,
                  tooltip: {
                    enabled: true
                  }
                },
                yaxis: {

                  labels: {
                    minWidth: 1
                  },
                  forceNiceScale: true,
                  tooltip: {
                    enabled: true
                  },
                  seriesName: "candlestick",
                  crosshairs: { 
                    show: true,
                    position: 'front',
                    dropShadow :{
                      enabled: true
                    }
                  },
                  floating: false,
                  tooltip: {
                    enabled: true
                  },
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
            type="line"
            series={this.state.series}
            width="100%"
            height="600"
        />
        )
    }
}


export default CandleStickChart
