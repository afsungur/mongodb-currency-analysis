import React, {Fragment} from 'react';
import 'fomantic-ui-css/semantic.css';
import { Table } from 'semantic-ui-react';
import TickerAnalysisContext from './TickerAnalysisContext';
import moment from 'moment'

class TickerTableData extends React.Component {

    render () {

        return (
            <Table celled striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Time</Table.HeaderCell>
                <Table.HeaderCell>Currency</Table.HeaderCell>
                <Table.HeaderCell>Close Price</Table.HeaderCell>
                <Table.HeaderCell>Open Price</Table.HeaderCell>
                <Table.HeaderCell>High Price</Table.HeaderCell>
                <Table.HeaderCell>Low Price</Table.HeaderCell>
                {this.context.enabledFilters.movingAverage[0] ? 
                    <Table.HeaderCell>MA ({this.context.movingAverageFilters[0]})</Table.HeaderCell> 
                    : null
                }
                {this.context.enabledFilters.movingAverage[1] ? 
                    <Table.HeaderCell>MA ({this.context.movingAverageFilters[1]})</Table.HeaderCell> 
                    : null
                }
                {this.context.enabledFilters.movingAverage[2] ? 
                    <Table.HeaderCell>EMA ({this.context.movingAverageFilters[2]})</Table.HeaderCell> 
                    : null
                }
                {this.context.enabledFilters.movingAverage[3] ? 
                    <Table.HeaderCell>EMA ({this.context.movingAverageFilters[3]})</Table.HeaderCell> 
                    : null
                }
                {this.context.enabledFilters.macd ?
                    <Fragment>
                        <Table.HeaderCell>MACD LINE ({this.context.numOfPrevDataPointsMacdLine1},{this.context.numOfPrevDataPointsMacdLine2})</Table.HeaderCell> 
                        <Table.HeaderCell>MACD SIGNAL LINE({this.context.numOfPrevDataPointsMacdSignal})</Table.HeaderCell> 
                        <Table.HeaderCell>MACD HISTOGRAM</Table.HeaderCell> 
                    </Fragment>
                    : null
                }
                {this.context.enabledFilters.rsi ? 
                    
                    <Fragment>
                        <Table.HeaderCell>Gain</Table.HeaderCell>
                        <Table.HeaderCell>Loss</Table.HeaderCell> 
                        <Table.HeaderCell>Avg Gain</Table.HeaderCell>
                        <Table.HeaderCell>Avg Loss</Table.HeaderCell>
                        <Table.HeaderCell>RSI</Table.HeaderCell> 
                    </Fragment>
                    : null
                }
              </Table.Row>
            </Table.Header>
            <Table.Body>
                {this.context.currencyHistoryDataForTable !== undefined ?
                    this.context.currencyHistoryDataForTable.map((item, index) => 
                            <Table.Row key={index}> 
                                <Table.Cell>{moment(item._id.time).local().format()}</Table.Cell>
                                <Table.Cell>{item._id.symbol}</Table.Cell>
                                <Table.Cell>{item.close}</Table.Cell>
                                <Table.Cell>{item.open}</Table.Cell>
                                <Table.Cell>{item.high}</Table.Cell>
                                <Table.Cell>{item.low}</Table.Cell>
                                {this.context.enabledFilters.movingAverage[0] ? 
                                    <Table.Cell>{item.movingAverage01}</Table.Cell>
                                    : null
                                }
                                {this.context.enabledFilters.movingAverage[1] ? 
                                    <Table.Cell>{item.movingAverage02}</Table.Cell>
                                    : null
                                }
                                {this.context.enabledFilters.movingAverage[2] ? 
                                    <Table.Cell>{item.expMovingAverage01}</Table.Cell>
                                    : null
                                }
                                {this.context.enabledFilters.movingAverage[3] ? 
                                    <Table.Cell>{item.expMovingAverage02}</Table.Cell>
                                    : null
                                }
                                {this.context.enabledFilters.macd ? 
                                    <Fragment>
                                        <Table.Cell>{item.macdLine}</Table.Cell>
                                        <Table.Cell>{item.macdSignal}</Table.Cell>
                                        <Table.Cell>{item.macdHistogram}</Table.Cell>
                                    </Fragment>
                                    : null
                                }
                                {this.context.enabledFilters.rsi > 0 ? 
                                    <Fragment>
                                        <Table.Cell>{item.gain}</Table.Cell>
                                        <Table.Cell>{item.loss}</Table.Cell>
                                        <Table.Cell>{item.avgGain}</Table.Cell>
                                        <Table.Cell>{item.avgLoss}</Table.Cell>
                                        <Table.Cell>{item.rsi}</Table.Cell>
                                    </Fragment>
                                    : null
                                }
                            </Table.Row> 
                    ) 
                : null

                }
            </Table.Body>
            </Table>
        )
    }
}

TickerTableData.contextType = TickerAnalysisContext
export default TickerTableData 