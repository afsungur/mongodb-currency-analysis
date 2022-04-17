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

        var arrayData = [{"_id":"61682f393e0e6f2e048f622d","ruleId":"61682d534697b7687cf0b656","symbol":"BNBBUSD","time":"2021-10-14T13:23:05.473Z","methodValue":479.14809160305344,"lastPrice":478.9,"percentageDifferent":-0.05177764607669497,"conditionsMet":false}]
        console.log("sss" + this.props.statisticsData)
        arrayData = this.props.statisticsData;
        console.log("Type:" + typeof(arrayData))
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