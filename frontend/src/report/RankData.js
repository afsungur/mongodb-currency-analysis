import React from 'react';
import 'fomantic-ui-css/semantic.css';
import { Table } from 'semantic-ui-react';

class RankData extends React.Component {

    render () {
        return (
            <Table celled striped>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell rowSpan='2'>Time</Table.HeaderCell>
                <Table.HeaderCell colSpan='4'>1st</Table.HeaderCell>
                <Table.HeaderCell colSpan='4'>2nd</Table.HeaderCell>
                <Table.HeaderCell colSpan='4'>3nd</Table.HeaderCell>
            </Table.Row>
            <Table.Row>
                <Table.HeaderCell>Symbol</Table.HeaderCell>
                <Table.HeaderCell>+ %</Table.HeaderCell>
                <Table.HeaderCell>Open</Table.HeaderCell>
                <Table.HeaderCell>Close</Table.HeaderCell>
                <Table.HeaderCell>Symbol</Table.HeaderCell>
                <Table.HeaderCell>+ %</Table.HeaderCell>
                <Table.HeaderCell>Open</Table.HeaderCell>
                <Table.HeaderCell>Close</Table.HeaderCell>
                <Table.HeaderCell>Symbol</Table.HeaderCell>
                <Table.HeaderCell>+ %</Table.HeaderCell>
                <Table.HeaderCell>Open</Table.HeaderCell>
                <Table.HeaderCell>Close</Table.HeaderCell>
            </Table.Row>
            </Table.Header>
            <Table.Body>
                {this.props.rankData !== undefined ?
                    this.props.rankData.map((item, index) => 
                            
                            <Table.Row> 
                                <Table.Cell><b>{item._id.time.$date}</b></Table.Cell>
                                <Table.Cell>{item.first._id.symbol}</Table.Cell>
                                <Table.Cell><b>{item.first.diffPercentage}</b></Table.Cell>
                                <Table.Cell>{item.first.open}</Table.Cell>
                                <Table.Cell>{item.first.close}</Table.Cell>
                                <Table.Cell>{item.second !== undefined ? item.second._id.symbol : "XXX"}</Table.Cell>
                                <Table.Cell><b>{item.second !== undefined ? item.second.diffPercentage : "XXX"}</b></Table.Cell>
                                <Table.Cell>{item.second !== undefined ? item.second.open : "XXX"}</Table.Cell>
                                <Table.Cell>{item.second !== undefined ? item.second.close : "XXX"}</Table.Cell>
                                <Table.Cell>{item.third !== undefined ? item.third._id.symbol : "YYY"}</Table.Cell>
                                <Table.Cell><b>{item.third !== undefined ? item.third.diffPercentage : "YYY"}</b></Table.Cell>
                                <Table.Cell>{item.third !== undefined ? item.third.close : "YYY"}</Table.Cell>
                                <Table.Cell>{item.third !== undefined ? item.third.close : "YYY"}</Table.Cell>
                            </Table.Row> 
                    ) 
                : null
            
                }
            </Table.Body>
            </Table>
            
        )
    }

}

export default RankData