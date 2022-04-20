import React from 'react';
import 'fomantic-ui-css/semantic.css';
import { Button, Segment, Form, Dimmer, Loader, Label, Icon, Accordion } from 'semantic-ui-react';
import TickerFilter from './TickerFilterComponent'
import IntervalFilter from '../common/IntervalFilter'
import DateFilter from '../common/DateFilter'
import TickerTableData from './TickerTableDataComponent'
import TickerChart from './TickerChart'
import Information from '../common/Information'
import MAFilter from './MAFilterComponent'
import MACDFilter  from './MACDFilterComponent';
import RSIFilter from './RSIFilterComponent';
import TickerAnalysisContext from './TickerAnalysisContext';
import moment from 'moment'
import StochasticOscillatorFilter from './StochasticOscillatorFilterComponent';



class TickerAnalysisComponent extends React.Component {
    constructor(props) {
        super(props)
        this.defaultQuery = "// It will be updated just after the query is executed \ndb.{collectionName}.aggregate([...])"
        this.state = {
            currencyHistoryDataForTable: undefined,
            renderTable: false,
            renderChart: false,
            queryIsRunning : false,
            query: this.defaultQuery,
            currency : "",
            interval : 1,
            hourFilter: 72,
            isStatisticsAccordionOpen : false,
            enabledFilters : {
                movingAverage:[false, false, false, false],
                macd: false,
                rsi: false,
                stochasticOscillator: false
            },
            latestInformation : {
                isQueryRunning: true,
                latestCurrencyDateLocalStr : "Loading ...",
                firstCurrencyDateLocalStr: "Loading ..."
            },
            movingAverageFilters: [1,1,1,1],
            numOfPrevDataPointsMacdLine1: 12,
            numOfPrevDataPointsMacdLine2: 26,
            numOfPrevDataPointsMacdSignal: 9,
            numOfPrevDataPointsRSI: 14,
            numOfPrevDataPointsStochasticOscillator: 14,

            htmlTableData: {
                currencyData: undefined
            },
            chartData: {
                candleStick: [],
                movingAverage01: [],
                movingAverage02: [],
                expMovingAverage01: [],
                expMovingAverage02: [],
                macdLine: [],
                macdSignal: [],
                macdHistogram: [],
                rsi: [],
                stocOsscK: [],
                stocOsscD: []
            }
        }
    }


    fetchLatestInfo() {

        this.setState({latestInformation: {isQueryRunning: true}})
        this.props.user.functions.GetLatestTSCollectionStatistics().then(
            data => {
                let result = data
                result.latestCurrencyDateLocalStr=moment(result.latestCurrencyDate).local().format();
                result.firstCurrencyDateLocalStr=moment(result.firstCurrencyDate).local().format();

                this.setState({
                    latestInformation: {
                        isQueryRunning: false,
                        latestCurrencyDateLocalStr: moment(result.latestCurrencyDate).local().format(),
                        firstCurrencyDateLocalStr: moment(result.firstCurrencyDate).local().format(),
                        totalNumberOfRecords: result.totalNumberOfRecords,
                        totalNumberOfBuckets: result.totalNumberOfBuckets
                    }
                });
            }

        )
        
      
    }

    UNSAFE_componentWillMount() { this.fetchLatestInfo() }

    fetchAndRender (type) { 
        this.setState({queryIsRunning: true})

        let parameterObject = {
            symbol: this.state.currency,
            hourFilter: this.state.hourFilter,
            candleStickUnit: "minute",
            candleStickInterval: this.state.interval,
            ma1: (this.state.enabledFilters.movingAverage[0]) ? parseInt(this.state.movingAverageFilters[0]) : null,
            ma2: (this.state.enabledFilters.movingAverage[1]) ? parseInt(this.state.movingAverageFilters[1]) : null,
            ema1: (this.state.enabledFilters.movingAverage[2]) ? parseInt(this.state.movingAverageFilters[2]) : null,
            ema2: (this.state.enabledFilters.movingAverage[3]) ? parseInt(this.state.movingAverageFilters[3]) : null,
            macd1: (this.state.enabledFilters.macd) ? parseInt(this.state.numOfPrevDataPointsMacdLine1) : null,
            macd2: (this.state.enabledFilters.macd) ? parseInt(this.state.numOfPrevDataPointsMacdLine2) : null,
            macdSignal: (this.state.enabledFilters.macd) ? parseInt(this.state.numOfPrevDataPointsMacdSignal) : null,
            rsi: (this.state.enabledFilters.rsi)? parseInt(this.state.numOfPrevDataPointsRSI) : null,
            stocOsc: (this.state.enabledFilters.stochasticOscillator) ? parseInt(this.state.numOfPrevDataPointsStochasticOscillator) : null
        }

        this.props.user.functions.GetTickerReport(parameterObject).then(data =>
            {
                let result = data.result
                let query = JSON.stringify(data.query, null, 4)

                if (type === "TABLE") {
                    let currencyHistory = result.map((currency) => {
                        return currency
                    });
                    this.setState({query: query, currencyHistoryDataForTable: currencyHistory})                
                    this.setState({queryIsRunning: false})
                    this.renderTable()
                }
                else if (type === "CHART") {
                
                    // keep maximum last 100 elements of result array to mitigate chart freezing in the case of huge data
                    let optimizedArray = result.slice(Math.max(result.length-100,0))
                    optimizedArray = optimizedArray.map(x => {
                        x.localTimeStr = moment.utc(x._id.time).local().format()
                        return x
                    })
    
                  
                    
                    // candlestick chart update
                    let candleStickData = optimizedArray.map((currency) => {
                        return {"x": currency.localTimeStr, "y": [currency.open,currency.high,currency.low,currency.close]}
                    });
    
                    // MA 1 - line chart update
                    let movingAverageData_01 = optimizedArray.map((currency) => {
                        return {"x": currency.localTimeStr, "y" : currency.movingAverage01}
                    });
                    
                    // MA 2 - line chart update
                    let movingAverageData_02 = optimizedArray.map((currency) => {
                        return {"x": currency.localTimeStr, "y" : currency.movingAverage02}
                    });
    
                    // EMA 1 - line chart update
                    let expMovingAverageData_01 = optimizedArray.map((currency) => {
                        return {"x": currency.localTimeStr, "y" : currency.expMovingAverage01}
                    });
    
                    // EMA 2 - line chart update
                    let expMovingAverageData_02 = optimizedArray.map((currency) => {
                        return {"x": currency.localTimeStr, "y" : currency.expMovingAverage02}
                    });
    
                    var macdLineData = null
                    var macdSignalData = null
                    var macdHistogramData = null
                    if (this.state.numOfPrevDataPointsMacdLine1 !== 0) {
                        // draw MACD chart
                        macdLineData = optimizedArray.map((currency) => {
                            return {"x": currency.localTimeStr, "y" : currency.macdLine}
                        });
    
                        macdSignalData = optimizedArray.map((currency) => {
                            return {"x": currency.localTimeStr, "y" : currency.macdSignal}
                        });
    
                        macdHistogramData = optimizedArray.map((currency) => {
                            return {"x": currency.localTimeStr, "y" : currency.macdHistogram}
                        });
    
                    }
    
    
                    var rsiData = null
                    if (this.state.numOfPrevDataPointsRSI !== 0) {
                        rsiData = optimizedArray.map((currency) => {
                            return {"x": currency.localTimeStr, "y" : currency.rsi}
                        });
                    }
    
                    var stocOsscDataKValue = null
                    var stocOsscDataDValue = null
                    if (this.state.numOfPrevDataPointsStochasticOscillator !== 0) {
                        stocOsscDataKValue = optimizedArray.map((currency) => {
                            return {"x": currency.localTimeStr, "y" : currency.stocOsscKValue}
                        });
    
                        stocOsscDataDValue = optimizedArray.map((currency) => {
                            return {"x": currency.localTimeStr, "y" : currency.stocOsscDValue}
                        });
                    }
    
    
                    this.setState({
                        query: query, 
                        chartData: {
                            candleStick: candleStickData,
                            movingAverage01: movingAverageData_01,
                            movingAverage02: movingAverageData_02,
                            expMovingAverage01: expMovingAverageData_01,
                            expMovingAverage02: expMovingAverageData_02,
                            macdLine: macdLineData,
                            macdSignal: macdSignalData,
                            macdHistogram: macdHistogramData,
                            rsi: rsiData,
                            stocOsscK: stocOsscDataKValue,
                            stocOsscD: stocOsscDataDValue
                        }
                    })
                    this.setState({queryIsRunning: false})
                    this.renderChart()
                }
            }    
        )
 
    }

    renderTable() {
        this.setState({renderTable: false})
        this.setState({renderChart: false})
        this.setState({renderTable: true})
    }
    
    renderChart() {
        this.setState({renderChart: false})
        this.setState({renderTable: false})
        this.setState({renderChart: true})
    }

    handleInterval(value) {
        this.setState({interval: value})
    }

    handleHourFilter(value) {
        this.setState({hourFilter: value})
    }
    
    handleSymbol(value) {
        this.setState({currency: value})

    }


  
    render () {
        
        return (

            <TickerAnalysisContext.Provider value={{

                movingAverageFilters: this.state.movingAverageFilters,
                setMovingAverageFilter: (index, value) => {
                    const movingAverageFilters = Object.assign({}, this.state.movingAverageFilters);
                    movingAverageFilters[index] = value;
                    this.setState({
                        movingAverageFilters: movingAverageFilters
                    })
                },

                numOfPrevDataPointsMacdLine1: this.state.numOfPrevDataPointsMacdLine1,
                setNumOfPrevDataPointsMacdLine1: value => {
                    this.setState({numOfPrevDataPointsMacdLine1: value})
                },

                numOfPrevDataPointsMacdLine2: this.state.numOfPrevDataPointsMacdLine2,
                setNumOfPrevDataPointsMacdLine2: value => {
                    this.setState({numOfPrevDataPointsMacdLine2: value})
                },

                numOfPrevDataPointsMacdSignal: this.state.numOfPrevDataPointsMacdSignal,
                setNumOfPrevDataPointsMacdSignal: value => {
                    this.setState({numOfPrevDataPointsMacdSignal: value})
                },

                numOfPrevDataPointsRSI: this.state.numOfPrevDataPointsRSI,
                setNumOfPrevDataPointsRSI: value => {
                    this.setState({numOfPrevDataPointsRSI: value})
                },

                numOfPrevDataPointsStochasticOscillator: this.state.numOfPrevDataPointsStochasticOscillator,
                setNumOfPrevDataPointsnumOfPrevDataPointsStochasticOscillator: value => {
                    this.setState({numOfPrevDataPointsStochasticOscillator: value})
                },

                

                enabledFilters: this.state.enabledFilters,
                toggleMovingAverage: index => {
                    let _tmp_moving_average = this.state.enabledFilters.movingAverage.slice()
                    _tmp_moving_average[index] = !_tmp_moving_average[index]

                    const newState = {...this.state.enabledFilters, movingAverage: _tmp_moving_average}
                    this.setState({enabledFilters: newState})
                    
                },

                toggleMacd: () => {
                    const newState = {...this.state.enabledFilters, macd: !this.state.enabledFilters.macd}
                    this.setState({enabledFilters: newState})

                },

                toggleRSI: () => {
                    const newState = {...this.state.enabledFilters, rsi: !this.state.enabledFilters.rsi}
                    this.setState({enabledFilters: newState})
                },

                toggleStochasticOscillator: () => {
                    const newState = {...this.state.enabledFilters, stochasticOscillator: !this.state.enabledFilters.stochasticOscillator}
                    this.setState({enabledFilters: newState})
                },

                chartData: this.state.chartData,
                currencyHistoryDataForTable: this.state.currencyHistoryDataForTable

            }}>
                    <div className="ui padded grid">
                        <div className="one column row">
                            <div className="column">
                                

                                <Segment>
                                <Accordion>
                                    <Accordion.Title
                                        active={this.state.isStatisticsAccordionOpen}
                                        index={0}
                                        onClick={() => this.setState({isStatisticsAccordionOpen: !this.state.isStatisticsAccordionOpen})}>
                                        
                                        <Icon name='dropdown' />
                                        Latest Information
                                    </Accordion.Title>
                                    <Accordion.Content active={this.state.isStatisticsAccordionOpen}>
                                        <Button size='mini' icon color='green' onClick={() => this.fetchLatestInfo()} ><Icon name='refresh'/></Button>
                                        <br/>
                                        <Label>
                                            <Icon name='clock outline' />
                                            Latest Record Date-Time:
                                            <Label.Detail>{  this.state.latestInformation.isQueryRunning ? "Please wait, loading..." : this.state.latestInformation.latestCurrencyDateLocalStr}</Label.Detail>
                                        </Label>
                                        <br/>
                                        <Label>
                                            <Icon name='clock outline' />
                                            First Record Date-Time:
                                            <Label.Detail>{  this.state.latestInformation.isQueryRunning ? "Please wait, loading..." : this.state.latestInformation.firstCurrencyDateLocalStr}</Label.Detail>
                                        </Label>
                                        <br/>
                                        <Label>
                                            <Icon name='hashtag' />
                                            Number of Records:
                                            <Label.Detail>~{  this.state.latestInformation.isQueryRunning ? "Please wait, loading..." : this.state.latestInformation.totalNumberOfRecords}</Label.Detail>
                                        </Label>
                                        <Label>
                                            <Icon name='hashtag' />
                                            Number of Buckets:
                                            <Label.Detail>{  this.state.latestInformation.isQueryRunning ? "Please wait, loading..." : this.state.latestInformation.totalNumberOfBuckets}</Label.Detail>
                                        </Label>
                                    </Accordion.Content>
                                </Accordion>
                                </Segment>    
                                <Segment>
                                    <Form>
                                        <TickerFilter user={this.props.user} symbolHandler={(x) => this.handleSymbol(x)}/>
                                        <DateFilter sendController={(x) => this.handleHourFilter(x)}/>
                                        <IntervalFilter sendController={(x) => this.handleInterval(x)}/>
                                        <MAFilter name="Moving average 1" number={0}/>
                                        <MAFilter name="Moving average 2" number={1}/>
                                        <MAFilter name="Exponential Moving average 1" number={2}/>
                                        <MAFilter name="Exponential Moving average 2" number={3}/>
                                        <MACDFilter name="MACD Filter"/>
                                        <RSIFilter name="RSI Filter"/>
                                        <StochasticOscillatorFilter name="Stochastic Oscillator Filter"/>
                                        <Button icon labelPosition='right' disabled={this.state.currency===""} color='green' onClick={() => this.fetchAndRender("CHART")} ><Icon name='chart line'/>Show Charts</Button>
                                        <Button icon labelPosition='right' disabled={this.state.currency===""} color='green' onClick={() => this.fetchAndRender("TABLE")} ><Icon name='numbered list'/>Show Data</Button>
                                    </Form>
                                </Segment>
                                {(this.state.renderTable || this.state.renderChart)?
                                <Segment>
                                    <Dimmer active={this.state.queryIsRunning}>
                                            <Loader size="big" indeterminate active={this.state.queryIsRunning}>Loading ...</Loader>
                                    </Dimmer>
                                    {this.state.renderTable ?<TickerTableData/> :null }
                                    {this.state.renderChart ?<TickerChart/> :null}
                                </Segment>
                                : null
                                }
                                <Segment>
                                    <Dimmer active={this.state.queryIsRunning}>
                                            <Loader size="big" indeterminate active={this.state.queryIsRunning}>Loading ...</Loader>
                                    </Dimmer>
                                    <Information query={this.state.query}  />

                                </Segment>

                            </div>
                        </div>
                    </div>
                </TickerAnalysisContext.Provider>

        )
    }
}

export default TickerAnalysisComponent