import React from 'react';
import 'fomantic-ui-css/semantic.css';
import { Button, Segment, Form, Container, Dimmer, Loader, Label, Icon } from 'semantic-ui-react';
import CurrencyFilter from './CurrencyFilterComponent'
import IntervalFilter from '../common/IntervalFilter'
import IntervalData from './CurrencyTableDataComponent'
import CurrencyChart from './CurrencyChart'
import Information from '../common/Information'
import MAFilter from './MAFilterComponent'
import MACDFilter  from './MACDFilterComponent';
import RSIFilter from './RSIFilterComponent';
import IndividiualCurrencyContext from './IndividualCurrencyContext';

class IndividualCurrencyPage extends React.Component {
    constructor(props) {
        super(props)
        this.defaultQuery = "// It will be updated after query is executed \ndb.ticker.aggregate([])"
        this.state = {
            currencyHistoryDataForTable: undefined,
            renderTable: false,
            renderChart: false,
            queryIsRunning : false,
            query: this.defaultQuery,
            currency : "",
            interval : 1,
            enabledFilters : {
                movingAverage:[false, false, false, false],
                macd: false,
                rsi: false
            },
            latestInformation : {
                latestCurrencyDate : "Still loading ...",
                firstCurrencyDate: "Still loading ..."
            },
            movingAverageFilters: [1,1,1,1],
            numOfPrevDataPointsMacdLine1: 12,
            numOfPrevDataPointsMacdLine2: 26,
            numOfPrevDataPointsMacdSignal: 9,
            numOfPrevDataPointsRSI: 14,
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
                rsi: []
            }
        }
    }



    componentWillMount() {
        let currencies = [];
        console.log(`API endpoint for retrieving latest information: ${process.env.REACT_APP_ENDPOINT_LATEST_INFO}`)
        fetch(`${process.env.REACT_APP_ENDPOINT_LATEST_INFO}`)
            .then(response => {
                return response.json()
            }).then(data => {
                let jsonobject=data
                console.log(`Latest info: ${jsonobject}`);
                let result=JSON.parse(jsonobject)
                this.setState({
                    latestInformation: result,
            });
        });
    }

    getBuiltURLforFetch () {
        let url = ""
        url += `${process.env.REACT_APP_ENDPOINT_PARTICULAR_CURRENCY_DATA}`
        url += `?currency=${this.state.currency}&interval=${this.state.interval}`
        if (this.state.enabledFilters.movingAverage[0]) {
            url += `&ma_1=${this.state.movingAverageFilters[0]}`
        }
        if (this.state.enabledFilters.movingAverage[1]) {
            url += `&ma_2=${this.state.movingAverageFilters[1]}`
        }
        if (this.state.enabledFilters.movingAverage[2]) {
            url += `&ema_1=${this.state.movingAverageFilters[2]}`
        }
        if (this.state.enabledFilters.movingAverage[3]) {
            url += `&ema_2=${this.state.movingAverageFilters[3]}`
        }
        if (this.state.enabledFilters.macd) {
            url += `&macd_1=${this.state.numOfPrevDataPointsMacdLine1}&macd_2=${this.state.numOfPrevDataPointsMacdLine2}&macd_signal=${this.state.numOfPrevDataPointsMacdSignal}`
        }
        if (this.state.enabledFilters.rsi) {
            url += `&rsi=${this.state.numOfPrevDataPointsRSI}`
        }
        return url
    }

    fetchAndRender (type) { 
        this.setState({queryIsRunning: true})
        console.log(`API endpoint for retrieving currency data: ${process.env.REACT_APP_ENDPOINT_PARTICULAR_CURRENCY_DATA}`)
        fetch(this.getBuiltURLforFetch())            
        .then(response => {
            this.setState({queryIsRunning: false})
            return response.json()
        }).then(data => {
            //var jsonobject=JSON.parse(data)
            console.log("data:" + data)
            console.log("results str:" + data.result)
            var result=JSON.parse(data.result)
            console.log("rsult" + result)
            var query=data.query

            // what should I render? TABLE or CHART
            if (type === "TABLE") {
                let currencyHistory = result.map((currency) => {
                    return currency
                });
                this.setState({query: query, currencyHistoryDataForTable: currencyHistory})                
                this.renderTable()
            }
            else if (type === "CHART") {
                
                // candlestick chart update
                let candleStickData = result.map((currency) => {
                    return {"x": currency._id.time, "y": [currency.open,currency.high,currency.low,currency.close]}
                });

                // MA 1 - line chart update
                let movingAverageData_01 = result.map((currency) => {
                    return {"x": currency._id.time, "y" : currency.movingAverage01}
                });
                
                // MA 2 - line chart update
                let movingAverageData_02 = result.map((currency) => {
                    return {"x": currency._id.time, "y" : currency.movingAverage02}
                });

                // EMA 1 - line chart update
                let expMovingAverageData_01 = result.map((currency) => {
                    return {"x": currency._id.time, "y" : currency.expMovingAverage01}
                });

                // EMA 2 - line chart update
                let expMovingAverageData_02 = result.map((currency) => {
                    return {"x": currency._id.time, "y" : currency.expMovingAverage02}
                });

                var macdLineData = null
                var macdSignalData = null
                var macdHistogramData = null
                if (this.state.numOfPrevDataPointsMacdLine1 !== 0) {
                    console.log(result)
                    // draw MACD chart
                    macdLineData = result.map((currency) => {
                        return {"x": currency._id.time, "y" : currency.macdLine}
                    });

                    macdSignalData = result.map((currency) => {
                        return {"x": currency._id.time, "y" : currency.macdSignal}
                    });

                    macdHistogramData = result.map((currency) => {
                        return {"x": currency._id.time, "y" : currency.macdHistogram}
                    });
                }


                var rsiData = null
                if (this.state.numOfPrevDataPointsRSI !== 0) {
                    rsiData = result.map((currency) => {
                        return {"x": currency._id.time, "y" : currency.rsi}
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
                        rsi: rsiData
                    }
                })
                this.renderChart()
            }

    });
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


    render () {
        return (

            <IndividiualCurrencyContext.Provider value={{
                currency: this.state.currency,
                setCurrency: currency => {
                    this.setState({currency: currency})
                },

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

                chartData: this.state.chartData,
                currencyHistoryDataForTable: this.state.currencyHistoryDataForTable

            }}>
                    <div class="ui padded grid">
                        <div class="one column row">
                            <div class="column">
                                <Segment>
                                    <Label>
                                        <Icon name='clock outline' />
                                        Latest Record Date-Time:
                                        <Label.Detail>{this.state.latestInformation.latestCurrencyDate}</Label.Detail>
                                    </Label>
                                    <br/>
                                    <Label>
                                        <Icon name='clock outline' />
                                        First Record Date-Time:
                                        <Label.Detail>{this.state.latestInformation.firstCurrencyDate}</Label.Detail>
                                    </Label>
                                    <br/>
                                    <Label>
                                        <Icon name='hashtag' />
                                        Number of Records:
                                        <Label.Detail>{this.state.latestInformation.totalNumberOfRecords}</Label.Detail>
                                    </Label>
                                    <Label>
                                        <Icon name='hashtag' />
                                        Number of Buckets:
                                        <Label.Detail>{this.state.latestInformation.totalNumberOfBuckets}</Label.Detail>
                                    </Label>
                                </Segment>    
                                <Segment>
                                    <Form>
                                        <CurrencyFilter/>
                                        <IntervalFilter sendController={(x) => this.handleInterval(x)}/>
                                        <MAFilter name="Moving average 1" number={0}/>
                                        <MAFilter name="Moving average 2" number={1}/>
                                        <MAFilter name="Exponential Moving average 1" number={2}/>
                                        <MAFilter name="Exponential Moving average 2" number={3}/>
                                        <MACDFilter name="MACD Filter"/>
                                        <RSIFilter name="RSI Filter"/>
                                        <Button icon labelPosition='right' disabled={this.state.currency===""} color='green' onClick={() => this.fetchAndRender("CHART")} ><Icon name='chart line'/>Show Charts</Button>
                                        <Button icon labelPosition='right' disabled={this.state.currency===""} color='green' onClick={() => this.fetchAndRender("TABLE")} ><Icon name='numbered list'/>Show Data</Button>
                                    </Form>
                                </Segment>
                                <Segment>
                                    <Dimmer active={this.state.queryIsRunning}>
                                            <Loader size="big" indeterminate active={this.state.queryIsRunning}>Loading ...</Loader>
                                    </Dimmer>
                                    {this.state.renderTable ?<IntervalData/> :null }
                                    {this.state.renderChart ?<CurrencyChart/> :null}
                                </Segment>
                                <Segment>
                                    <Dimmer active={this.state.queryIsRunning}>
                                            <Loader size="big" indeterminate active={this.state.queryIsRunning}>Loading ...</Loader>
                                    </Dimmer>
                                    <Information query={this.state.query}  />
                                </Segment>
                            </div>
                        </div>
                    </div>
                </IndividiualCurrencyContext.Provider>

        )
    }
}

export default IndividualCurrencyPage