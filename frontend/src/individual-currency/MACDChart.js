import React from 'react';
import 'fomantic-ui-css/semantic.css';
import Chart from "react-apexcharts";




class MACDChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: {
                colors: [
                  // provides different coloring for MACD (macdline, signal line, programmatic histogram (if the value is less than 0 then histogram bar gets red))
                  function ({ value, seriesIndex, w }) {
                      if (seriesIndex === 0) return '#0000FF'
                      else if (seriesIndex === 1) return '#FF0000'
                      else if (seriesIndex === 2) {
                          if (value > 0 ) return '#00FF00'
                          else return '#FF0000'
                      }
                    }
                ],
                chart: {
                  id: "macd-histogram",
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
                  seriesName: "histogram",
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
                  }
                },
                title: {
                  text: 'Macd Histogram',
                  align: 'left'
                },
                stroke: {
                  curve : "smooth",
                  width : 3
                },
                legend: {
                  show: true,
                  labels: {
                    useSeriesColors: true
                  }
                }
          },
          series: [{
            name: 'MACD Line',
            type: 'line',
            data: this.props.macdLineData
          },{
            name: 'MACD Signal',
            type: 'line',
            data: this.props.macdSignalData
            
          },{
            name: 'Histogram',
            type: 'column',
            data: this.props.macdHistogramData
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
            height="400"
        />
        )
    }
}


export default MACDChart
