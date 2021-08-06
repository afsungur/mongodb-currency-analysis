import React from 'react';
import 'fomantic-ui-css/semantic.css';
import { Button, Segment, Form, Container, Dropdown, Dimmer, Loader } from 'semantic-ui-react';
import IntervalFilter from '../common/IntervalFilter'
import Information from '../common/Information'
import RankData from './RankData'

const dropDownOptionForIntervalValues = [
    { key: 1, text: 'Top Performers', value: "TOP" },
    { key: 2, text: 'Worst Performers', value: "DOWN" }
  ]

class Report extends React.Component {
    constructor(props) {
        super(props)
        this.defaultQuery = "// It will be updated after query is executed \ndb.ticker.aggregate([])"

        this.state = {
            method : "TOP",
            interval: 1,
            rankData : undefined,
            queryIsRunning: false,
            currencyHistory: [],
            query : this.defaultQuery
        }
    }

    handleTopWorst (value) {
        this.setState({method: value})
    }

    handleInterval (value) {
        this.setState({interval: value})
    }

    fetchAndRender (type) { 
        this.setState({currencyHistory: [], query: this.defaultQuery, queryIsRunning: true })
        
        console.log(`API endpoint: ${process.env.REACT_APP_ENDPOINT_TOP_N_WORST_PERFORMERS}`)
        fetch(`${process.env.REACT_APP_ENDPOINT_TOP_N_WORST_PERFORMERS}?method=${this.state.method}&interval=${this.state.interval}`)
        .then(response => {
            return response.json()
        }).then(data => {

            //var jsonobject=JSON.parse(data)
            console.log("data:" + data)
            var result=JSON.parse(data.result)
            console.log("rsult" + result)
            var query=data.query
            let currencyHistory = result.map((currency) => {
                return currency
            });
            this.setState({currencyHistory: currencyHistory, query: query, queryIsRunning: false})
            
            
         });
    }

    render () {
        return (
            <Container fluid>

                <Segment>
                    

                    <Form>
                    <Form.Field required>
                            <label>Method: </label>
                            <Dropdown 
                                selection
                                options={dropDownOptionForIntervalValues}
                                name="dropdown_interval_value"  
                                onChange={(event,data) => this.handleTopWorst(data.value)}
                                value={this.state.method} 
                            />
                    </Form.Field>
                    <IntervalFilter sendController={(x) => this.handleInterval(x)}/>
                    <Button disabled={this.state.queryIsRunning} color='green' onClick={() => this.fetchAndRender()} >Show</Button>
                    </Form>
                </Segment>
                <Segment>
                    <Dimmer active={this.state.queryIsRunning}>
                        <Loader size="big" indeterminate active={this.state.queryIsRunning}>Loading data ...</Loader>
                    </Dimmer>
                    <RankData interval={this.state.interval} rankData={this.state.currencyHistory}/>
                </Segment>
                <Segment>
                    <Dimmer active={this.state.queryIsRunning}>
                        <Loader size="big" indeterminate active={this.state.queryIsRunning}>Loading data ...</Loader>
                    </Dimmer>
                    <Information query={this.state.query} />
                </Segment>
            </Container>
        )
    }
}

export default Report