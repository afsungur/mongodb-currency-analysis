import React from 'react';
import 'fomantic-ui-css/semantic.css';
import { Message, Divider, Button, Segment, Form, Container, Tab, Dropdown, Dimmer, Modal, Loader, Input, Table } from 'semantic-ui-react';
import CurrencyFilter from '../individual-currency/CurrencyFilterComponent';
import moment from 'moment'
import NumberInput from 'semantic-ui-react-numberinput';
import RuleStatistics from './RuleStatistics'
const dropDownOptionForMethods = [
    { key: 1, text: 'Moving Average', value: "Moving Avg" }
  ]

const dropDownOptionComparison = [
{ key: 1, text: 'Greater Than', value: "$gt" },
{ key: 2, text: 'Lesser Than', value: "$lt" }
]




class Rules extends React.Component {
    constructor(props) {
        super(props)
        this.defaultQuery = "// It will be updated after query is executed \ndb.ticker.aggregate([])"

        this.state = {
            method : "Moving Avg",
            comparison: "$gt",
            activeTab: 0,
            ruleName: "",
            recentNumberOfMinutesToAnalyze: 5,
            percentageDifferenceToTrigger: 0.025,
            isAddRuleSuccessful: null,
            rules : [],
            isRuleDeleteVerificationOpen : false,
            executionFrequency: 5,
            isStatisticQueryRunning: false,
            isStatisticsLoaded: false,
            statisticsData: [],
            symbol: ""
        }

        this.symbolChangeHandler = this.symbolChangeHandler.bind(this)
    }

    handleMethod (value) {
        this.setState({method: value})
    }

    handleComparison (value) {
        this.setState({comparison: value})
    }

    handleTabChange = (e, { activeIndex }) => {
        this.setState({ activeTab: activeIndex })
        if (activeIndex === 1) {
            this.fetchRules()
            this.setState({isStatisticsLoaded: false})
        }
    }

    handleRuleNameChange (value) {
        this.setState({ruleName: value})
    }

 
    saveRule () { 
        if (this.state.ruleName === undefined || this.state.ruleName === "") {
            this.setState({
                isAddRuleSuccessful: false,
                addRuleMessage: "Rule name cannot be empty.",
                addRuleMessageHeader: "Rule has not been added."
            })
            return false;
        } 
        this.setState({queryIsRunning: true })
        
        console.log(`API endpoint: ${window['getConfig'].REACT_APP_ENDPOINT_ADD_RULE}`)

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ruleName: `${this.state.ruleName}`,
                executionFrequency: `${this.state.executionFrequency}`,
                symbol: `${this.state.symbol}`,
                rule: {
                    method: `${this.state.method}`,
                    comparison: `${this.state.comparison}`,
                    percentageDifferenceToTrigger: `${this.state.percentageDifferenceToTrigger}`,
                    recentNumberOfMinutesToAnalyze: `${this.state.recentNumberOfMinutesToAnalyze}`
                }
            })
        };

        fetch(
            `${window['getConfig'].REACT_APP_ENDPOINT_ADD_RULE}`,
            requestOptions
            )
        .then(response => {
            this.setState({queryIsRunning: false })
            return response.json()
        }).then(data => {

            var jsonobject=JSON.parse(data)
            //console.log("data:" + data)

            if (jsonobject.status === "success") {
                this.setState({
                    isAddRuleSuccessful: true,
                    addRuleMessage: jsonobject.message,
                    addRuleMessageHeader: "Rule has been added successfully."
                })
            } else {
                this.setState({
                    isAddRuleSuccessful: false,
                    addRuleMessage: jsonobject.message,
                    addRuleMessageHeader: "Rule has not been added."
                })
            }
            
            
         });
    }

    fetchRules () {
        this.setState({queryIsRunning: true })
        console.log(`API endpoint: ${window['getConfig'].REACT_APP_ENDPOINT_GET_RULES}`)

        fetch(`${window['getConfig'].REACT_APP_ENDPOINT_GET_RULES}`)
        .then(response => {
            this.setState({queryIsRunning: false })
            return response.json()
        }).then(data => {
            console.log("rules data:"+data)
            let jsonObjectArray = JSON.parse(data)
            console.log("rules data:"+jsonObjectArray)
            this.setState({rules: jsonObjectArray})
        });

    }

    fetchStatisticsForARule(_id) {
        this.setState({isStatisticQueryRunning: true, isStatisticsLoaded: false})
        console.log("rule_id" + _id)

        let url = `${window['getConfig'].REACT_APP_ENDPOINT_GET_STATS}?ruleId=${_id}`
        console.log(`API endpoint: ${url}`)

        fetch(url)
        .then(response => {
            return response.json()
        }).then(data => {
            console.log("stats data:"+data)
            let jsonObjectArray = JSON.parse(data)
            console.log("stats data after parse:"+jsonObjectArray)
            console.log("stats data type:" + typeof(jsonObjectArray))
            console.log("first element:" + JSON.stringify(jsonObjectArray[0]))

            this.setState({statisticsData: jsonObjectArray, isStatisticsLoaded: true, isStatisticQueryRunning: false})
        });
    }

    removeRule (_id) {
        this.setState({queryIsRunning: true })

        console.log("It is going to be removed:" + _id)

        let url = `${window['getConfig'].REACT_APP_ENDPOINT_DELETE_RULE}?ruleId=${_id}`
        console.log(`API endpoint: ${url}`)
        
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        fetch(
            url,
            requestOptions
            )
        .then(response => {
            this.setState({queryIsRunning: false })
            return response.json()
        }).then(data => {

            var jsonobject=JSON.parse(data)
            console.log(jsonobject)
            if (jsonobject.deletedCount === 1) {
                console.log("Successful delete")
                
                let rules = this.state.rules.slice()
                rules = rules.filter( x =>  x._id !== _id)
                
                this.setState({rules: rules})

            }

        })
    }

    symbolChangeHandler(value) {
        console.log("This value selected:" + value)
        this.setState({symbol: value})
    }


    renderModalForRemove() {

    }
    
    render () {
        return (
            <Container fluid>
                <Tab
                    activeIndex={this.state.activeTab}
                    onTabChange={this.handleTabChange}
                    panes={[
                        {
                            menuItem: 'Rule Add',
                            render: () => 
                                        <>
                                        <Segment>              
                                            <Form>
                                                <Form.Field required>
                                                        <label>Rule Name</label>
                                                        <Input placeholder="Give a name to rule to identify rule later" value={this.state.ruleName} onChange={(event,data) => this.handleRuleNameChange(data.value)}/>
                                                </Form.Field>
                                                <CurrencyFilter symbolHandler={this.symbolChangeHandler}/>
                                                <Form.Group widths={12}>
                                                    <Form.Field required width={3}>
                                                            <label>Analyze the recent</label>
                                                            <NumberInput 
                                                                    stepAmount={1} 
                                                                    minValue={1} 
                                                                    maxValue={120} 
                                                                    value={this.state.recentNumberOfMinutesToAnalyze} 
                                                                    onChange={(data) => this.setState({recentNumberOfMinutesToAnalyze:data})} />
                                                            
                                                    </Form.Field>                  
                                                    <Form.Field width={2}>
                                                            <label>&nbsp;</label>
                                                            <p> <br/>minutes of data </p>
                                                    </Form.Field>  
                                                    <Form.Field required width={6}>
                                                            <label>Apply the Method</label>              
                                                            <Dropdown
                                                                placeholder='Compact'
                                                                compact
                                                                selection
                                                                value={this.state.method}
                                                                onChange={(event,data) => this.handleMethod(data.value)}
                                                                options={dropDownOptionForMethods}
                                                            />
                                                    </Form.Field>                    
                                                </Form.Group>
                                                <Divider/>
                                                <Form.Group widths={12}>
                                                    <Form.Field required width={3}>
                                                            <label>If the last price is at least</label>
                                                            <NumberInput 
                                                                    valueType="decimal"
                                                                    stepAmount={0.025} 
                                                                    minValue={0} 
                                                                    maxValue={100} 
                                                                    precision={4}
                                                                    value={this.state.percentageDifferenceToTrigger} 
                                                                    onChange={(data) => this.setState({percentageDifferenceToTrigger:data})} />
                                                            
                                                            
                                                    </Form.Field>        
                                                    <Form.Field width={1}>
                                                            <label>&nbsp;</label>
                                                            <p> <br/>percent </p>
                                                    </Form.Field>           
                                                    <Form.Field width={3}>
                                                            <label>&nbsp;</label>
                                                            <Dropdown
                                                                placeholder='Compact'
                                                                compact
                                                                selection
                                                                value={this.state.comparison}
                                                                onChange={(event,data) => this.handleComparison(data.value)}
                                                                options={dropDownOptionComparison}
                                                            />
                                                    </Form.Field>
                                                    <Form.Field width={4}>
                                                            <label>&nbsp;</label>
                                                            <p> <br/>{this.state.method}</p>
                                                    </Form.Field>          
                                                </Form.Group>            
                                                <Divider/>
                                                <Form.Group widths={12}>
                                                    <Form.Field required width={3}>
                                                            <label>Execute the rule for every</label>
                                                            <NumberInput 
                                                                    stepAmount={1} 
                                                                    minValue={1} 
                                                                    maxValue={120} 
                                                                    value={this.state.executionFrequency} 
                                                                    onChange={(data) => this.setState({executionFrequency:data})} />
                                                            
                                                    </Form.Field>
                                                    <Form.Field width={4}>
                                                            <label>&nbsp;</label>
                                                            <p> <br/>minutes </p>
                                                    </Form.Field>          
                                                </Form.Group>
                                                <Button disabled={this.state.queryIsRunning} color='green' onClick={() => this.saveRule()} >Add Rule</Button>
                                            </Form>
                                        </Segment>
                                        <Segment hidden={this.state.isAddRuleSuccessful == null}>
                                            <Dimmer active={this.state.queryIsRunning}>
                                                <Loader size="big" indeterminate active={this.state.queryIsRunning}>Rule is being added ...</Loader>
                                            </Dimmer>

                                            <Message
                                                success={this.state.isAddRuleSuccessful}
                                                negative={!this.state.isAddRuleSuccessful}
                                                hidden={this.state.isAddRuleSuccessful == null}
                                                header={this.state.addRuleMessageHeader}
                                                content={this.state.addRuleMessage}
                                            />
                                        </Segment>
                                        </>
                                        
                        },
                        {
                            menuItem: 'List Rules',
                            render: () => <>
                                          <Segment>
                                             <Dimmer active={this.state.queryIsRunning}>
                                                <Loader size="big" indeterminate active={this.state.queryIsRunning}>Loading data ...</Loader>
                                            </Dimmer>

                                          <Table celled striped>
                                            <Table.Header>
                                                <Table.Row>
                                                    <Table.HeaderCell>Rule Name</Table.HeaderCell>
                                                    <Table.HeaderCell>Symbol</Table.HeaderCell>
                                                    <Table.HeaderCell>Added Time</Table.HeaderCell>
                                                    <Table.HeaderCell>Metadata</Table.HeaderCell>
                                                    <Table.HeaderCell>Exec Frequency</Table.HeaderCell>
                                                    <Table.HeaderCell>Exec Statistics</Table.HeaderCell>
                                                    <Table.HeaderCell>Remove</Table.HeaderCell>
                                                </Table.Row>
                                            </Table.Header>
                                            <Table.Body>
                                                {this.state.rules !== undefined ?
                                                this.state.rules.map((item, index) => 
                                                <Table.Row key={index}> 
                                                    <Table.Cell>{item.ruleName}</Table.Cell>
                                                    <Table.Cell>{item.symbol}</Table.Cell>
                                                    <Table.Cell>{moment(item.time).local().format()}</Table.Cell>
                                                    <Table.Cell>{JSON.stringify(item.rule,null,4)}</Table.Cell>
                                                    <Table.Cell>{item.executionFrequency} min</Table.Cell>
                                                    <Table.Cell><Button onClick={() => this.fetchStatisticsForARule(item._id)} circular icon='list'/></Table.Cell>
                                                    <Table.Cell><Button onClick={() => this.setState({isRuleDeleteVerificationOpen: true, chosenRuleId: item._id, chosenRuleName: item.ruleName})} circular icon='remove circle'/></Table.Cell>
                                                    
                                                </Table.Row>
                                               
                                                ) 
                                                : null
                                                }
                                            </Table.Body>
                                            </Table>
                                               <Modal
                                                    size="tiny"
                                                    open={this.state.isRuleDeleteVerificationOpen}
                                                    onClose={() => this.setState({isRuleDeleteVerificationOpen: false})}
                                                    >
                                                <Modal.Header>{`Rule ${this.state.chosenRuleName}`}</Modal.Header>
                                                <Modal.Content>
                                                    <p>Are you sure you want to delete this rule?</p>
                                                </Modal.Content>
                                                <Modal.Actions>
                                                    <Button negative onClick={() => this.setState({isRuleDeleteVerificationOpen: false})}>No</Button>
                                                    <Button
                                                    positive
                                                    icon="checkmark"
                                                    labelPosition="right"
                                                    content="Yes"
                                                    onClick={() => {this.removeRule(this.state.chosenRuleId); this.setState({isRuleDeleteVerificationOpen: false})} }
                                                    />
                                                </Modal.Actions>
                                                </Modal>
                                          </Segment>
                                          <Segment hidden={!this.state.isStatisticsLoaded} loading={this.state.isStatisticQueryRunning}>
                                            { this.state.isStatisticsLoaded ? 
                                                <RuleStatistics statisticsData={this.state.statisticsData}/>
                                                : null }
                                         </Segment>
                                         </> 
                        }

                    ]}
                    
                />
            </Container>
        )
    }
}

export default Rules