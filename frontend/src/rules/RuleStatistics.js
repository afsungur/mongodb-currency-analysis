import React from 'react';
import 'fomantic-ui-css/semantic.css';
import { Table } from 'semantic-ui-react';
import moment from 'moment'


class RuleStatistics extends React.Component {

    constructor(props) {
        super(props)

        this.state = { 
            statsData: this.props.statisticsData
        }
    }
    render () {

        var arrayData = this.props.statisticsData;
        return (
            <Table celled striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Time</Table.HeaderCell>
                <Table.HeaderCell>Symbol</Table.HeaderCell>
                <Table.HeaderCell>Last Price</Table.HeaderCell>
                <Table.HeaderCell>Method</Table.HeaderCell>
                <Table.HeaderCell>Value of the Method</Table.HeaderCell>
                <Table.HeaderCell>Threshold</Table.HeaderCell>
                <Table.HeaderCell>Conditions MET</Table.HeaderCell>
             </Table.Row>
            </Table.Header>
            <Table.Body>
                {arrayData !== undefined ?
                    arrayData.map(
                        (item, index) => 
                            <Table.Row key={index}> 
                                <Table.Cell>{moment(item.time).local().format()}</Table.Cell>
                                <Table.Cell>{item.symbol}</Table.Cell>
                                <Table.Cell>{item.lastPrice}</Table.Cell>
                                <Table.Cell>{item.method}</Table.Cell>
                                <Table.Cell>{item.methodValue}</Table.Cell>
                                <Table.Cell>{item.threshold}</Table.Cell>
                                <Table.Cell>{item.conditionsMet ? "true" : "false" }</Table.Cell>
                            </Table.Row> 
                    ) 
                : null
                }
            </Table.Body>
            </Table>
            
        )}
            
            
}

export default RuleStatistics