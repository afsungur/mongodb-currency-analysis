import React from 'react';
import 'fomantic-ui-css/semantic.css';
import { Message, Divider, Button, Segment, Form, Container, Tab, Dropdown, Dimmer, Modal, Loader, Input, Table } from 'semantic-ui-react';
import CurrencyFilter from '../individual-currency/CurrencyFilterComponent';
import IntervalFilter from '../common/IntervalFilter';
import moment from 'moment'
import NumberInput from 'semantic-ui-react-numberinput';
import RuleStatistics from './RuleStatistics'
import * as Realm from "realm-web";

const {BSON: { ObjectId },} = Realm;

const dropDownOptionForMethods = [
    { key: 1, text: 'Moving Average', value: "MA" },
    { key: 2, text: 'Exponential Moving Average', value: "EMA" },
    { key: 3, text: 'Relative Strength Index', value: "RSI" },
  ]

const dropDownOptionComparison = [
{ key: 1, text: 'Greater Than', value: "$gt" },
{ key: 2, text: 'Lesser Than', value: "$lt" }
]

class Rules extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            interval: 1,
            method : "MA",
            comparison: "$gt",
            activeTab: 0,
            ruleName: "",
            recentNumberOfDataPointsToAnalyze: 5,
            threshold: 10,
            isAddRuleSuccessful: null,
            rules : [],
            isRuleDeleteVerificationOpen : false,
            executionFrequency: 5,
            isStatisticQueryRunning: false,
            isStatisticsLoaded: false,
            statisticsData: [],
            symbol: ""
        }
    }

    handleTabChange = (e, { activeIndex }) => {
        this.setState({ activeTab: activeIndex })
        if (activeIndex === 1) {
            this.fetchRules()
            this.setState({isStatisticsLoaded: false})
        }
    }

    fetchRules () {
        this.setState({queryIsRunning: true})

        this.props.user.mongoClient('mongodb-atlas').db('exchange').collection('rules').find({}).then(
            result => {
                this.setState({rules: result})
                this.setState({queryIsRunning: false})
            })
        
    }

    handleInterval(value) {
        this.setState({interval: value})
    }

    handleHourFilter(value) {
        this.setState({hourFilter: value})
    }
    
    handleSymbol(value) {
        this.setState({currency: value})
        console.log("This value selected:" + value)

    }

    handleMethod (value) {
        this.setState({method: value})
    }

    handleComparison (value) {
        this.setState({comparison: value})
    }


    saveRule () { 
        let rule = {
            ruleName: this.state.ruleName,
            interval: this.state.interval,
            symbol: this.state.currency,
            method: this.state.method,
            numOfDataPointsToAnalyze: parseInt(this.state.recentNumberOfDataPointsToAnalyze),
            threshold: parseInt(this.state.threshold),
            comparison: this.state.comparison,
            createdAt: new Date()
        }

        this.setState({queryIsRunning: true})
        this.props.user.mongoClient('mongodb-atlas').db('exchange').collection('rules').insertOne(rule).then(
            result => {
                this.setState({queryIsRunning: false})
                if (result.insertedId !== "" ) {
                    this.setState({
                        isAddRuleSuccessful: true,
                        addRuleMessage: result.insertedId,
                        addRuleMessageHeader: "Rule has been added successfully."
                    })
                } else {
                    this.setState({
                        isAddRuleSuccessful: false,
                        addRuleMessage: "ERROR",
                        addRuleMessageHeader: "Rule has not been added."
                    })
                }
        }
        )

    }


    removeRuleStatistics(_id) {
        this.setState({queryIsRunning: true })

        this.props.user.mongoClient('mongodb-atlas').db('exchange').collection('ruleStatistics').deleteOne({"_id": ObjectId(_id)}).then(
            result => {
                this.setState({queryIsRunning: false })
            }
        )
    }

    removeRule (_id) {
        this.props.user.mongoClient('mongodb-atlas').db('exchange').collection('rules').deleteOne({"_id": ObjectId(_id)}).then(
            result => {
                if (result.deletedCount === 1) {
                    let rules = this.state.rules.slice()
                    rules = rules.filter( x =>  x._id !== _id)
                    
                    this.setState({rules: rules})
                    this.removeRuleStatistics(_id) // no need to track
                }
            }
        )

    }

    fetchStatisticsForARule(_id) {
        this.setState({isStatisticQueryRunning: true, isStatisticsLoaded: false})


        this.props.user.mongoClient('mongodb-atlas').db('exchange').collection('ruleStatistics').find({"ruleId": ObjectId(_id)}).then(
            result => {
                this.setState({statisticsData: result, isStatisticsLoaded: true, isStatisticQueryRunning: false})
            })
    }

    handleRuleNameChange (value) {
        this.setState({ruleName: value})
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
                                                <CurrencyFilter user={this.props.user} symbolHandler={(x) => this.handleSymbol(x)}/>
                                                <IntervalFilter sendController={(x) => this.handleInterval(x)}/>

                                                <Form.Group widths={12}>
                                                    <Form.Field required width={3}>
                                                            <label>Analyze the recent</label>
                                                            <NumberInput 
                                                                    stepAmount={1} 
                                                                    minValue={1} 
                                                                    maxValue={120} 
                                                                    value={this.state.recentNumberOfDataPointsToAnalyze} 
                                                                    onChange={(data) => this.setState({recentNumberOfDataPointsToAnalyze:data})} />
                                                            
                                                    </Form.Field>                  
                                                    <Form.Field width={2}>
                                                            <label>&nbsp;</label>
                                                            <p> <br/> # of data points </p>
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
   
                                                    <Form.Field width={3}>
                                                            <label>If {this.state.method} is</label>
                                                            <Dropdown
                                                                compact
                                                                selection
                                                                value={this.state.comparison}
                                                                onChange={(event,data) => this.handleComparison(data.value)}
                                                                options={dropDownOptionComparison}
                                                            />
                                                    </Form.Field>    
                                                    <Form.Field width={3}>
                                                            <label>&nbsp;</label>
                                                            <NumberInput 
                                                                    valueType="decimal"
                                                                    stepAmount={1} 
                                                                    minValue={0} 
                                                                    maxValue={100000} 
                                                                    precision={4}
                                                                    value={this.state.threshold} 
                                                                    onChange={(data) => this.setState({threshold:data})} />
                                                            
                                                            
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
                                                    <Table.HeaderCell>Interval</Table.HeaderCell>
                                                    <Table.HeaderCell>Method</Table.HeaderCell>
                                                    <Table.HeaderCell>Comparison</Table.HeaderCell>
                                                    <Table.HeaderCell>Threshold</Table.HeaderCell>
                                                    <Table.HeaderCell># of Data Points</Table.HeaderCell>
                                                    <Table.HeaderCell>Statistics</Table.HeaderCell>
                                                    <Table.HeaderCell>Remove Rule</Table.HeaderCell>
                                                </Table.Row>
                                            </Table.Header>
                                            <Table.Body>
                                                {this.state.rules !== undefined ?
                                                this.state.rules.map((item, index) => 
                                                <Table.Row key={index}> 
                                                    <Table.Cell>{item.ruleName}</Table.Cell>
                                                    <Table.Cell>{item.symbol}</Table.Cell>
                                                    <Table.Cell>{moment(item.createdAt).local().format()}</Table.Cell>
                                                    <Table.Cell>{item.interval}</Table.Cell>
                                                    <Table.Cell>{item.method}</Table.Cell>
                                                    <Table.Cell>{item.comparison}</Table.Cell>
                                                    <Table.Cell>{item.threshold}</Table.Cell>
                                                    <Table.Cell>{item.numOfDataPointsToAnalyze}</Table.Cell>
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
                                          <Segment hidden={!this.state.isStatisticsLoaded && !this.state.isStatisticQueryRunning}>
                                            <Dimmer active={this.state.isStatisticQueryRunning}>
                                                <Loader size="big" indeterminate active={this.state.isStatisticQueryRunning}>Loading statistics ...</Loader>
                                            </Dimmer>
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