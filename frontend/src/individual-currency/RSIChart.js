import React from 'react';
import 'fomantic-ui-css/semantic.css';
import Chart from "react-apexcharts";

class RSIChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: {
                chart: {
                  id : "rsi-line",
                  type: "chart",
                  animations: {enabled:false}
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
                    minWidth: 1,
                    formatter: (value) => { return value }
                  },
                  forceNiceScale: true,
                  tooltip: {
                    enabled: true
                  },
                  seriesName: "rsi-data",
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
                  text: 'RSI',
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
          series: [
            {
              name: 'rsi-data',
              type: 'line',
              data: this.props.rsiData
            },
            {
              name: 'rsi-data-upper-threshold',
              type: 'line',
              data: this.props.rsiData.map((point) => { return {"x": point.x, "y" : 70}})
            },
            {
              name: 'rsi-data-lower-threshold',
              type: 'line',
              data: this.props.rsiData.map((point) => { return {"x": point.x, "y" : 30}})
            }
          ]
        
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


export default RSIChart
