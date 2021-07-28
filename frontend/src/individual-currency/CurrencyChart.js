import React from 'react';
import 'fomantic-ui-css/semantic.css';
import IndividiualCurrencyContext from './IndividualCurrencyContext';
import MACDChart from './MACDChart'
import RSIChart from './RSIChart'
import CandleStickChart from './CandleStickChart';
class CurrencyChart extends React.Component {
    
  constructor(props) {
      super(props);
      this.state = {}
    }


    render() {

      return (
        <div className="app">
          <div className="row">
            <div className="mixed-chart">

            <CandleStickChart
              candleStickData={this.context.chartData.candleStick}
              movingAverage01Data={this.context.chartData.movingAverage01}
              movingAverage02Data={this.context.chartData.movingAverage02}
              expMovingAverage01Data={this.context.chartData.expMovingAverage01}
              expMovingAverage02Data={this.context.chartData.expMovingAverage02}
            />

            {this.context.enabledFilters.rsi ?
              <RSIChart
              rsiData={this.context.chartData.rsi}
              />
            : null}

            {this.context.enabledFilters.macd ?
              <MACDChart
              macdLineData={this.context.chartData.macdLine}
              macdSignalData={this.context.chartData.macdSignal}
              macdHistogramData={this.context.chartData.macdHistogram}
              />
            :null}
            </div>
          </div>
        </div>
      );
  }
}
  
  
CurrencyChart.contextType = IndividiualCurrencyContext
export default CurrencyChart;