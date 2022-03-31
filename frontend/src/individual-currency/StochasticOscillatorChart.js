import React from 'react';
import 'fomantic-ui-css/semantic.css';
import Chart from "react-apexcharts";

class StochasticOscillatorChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: {
                chart: {
                  id : "stochastic-oscillator-line",
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
                  seriesName: "stochastic-oscillator-data",
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
                  text: 'Stochastic Oscillator',
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
              name: 'stochastic-oscillator-data-kvalue',
              type: 'line',
              data: this.props.stochasticOscillatorDataKValue
            },
            {
                name: 'stochastic-oscillator-data-dvalue',
                type: 'line',
                data: this.props.stochasticOscillatorDataDValue
            },
            {
              name: 'stochastic-oscillator-data-upper-threshold',
              type: 'line',
              data: this.props.stochasticOscillatorDataKValue.map((point) => { return {"x": point.x, "y" : 80}})
            },
            {
              name: 'stochastic-oscillator-data-lower-threshold',
              type: 'line',
              data: this.props.stochasticOscillatorDataKValue.map((point) => { return {"x": point.x, "y" : 20}})
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


export default StochasticOscillatorChart
