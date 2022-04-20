import React from 'react';
import 'fomantic-ui-css/semantic.css';
import { Form, Header, Popup, Button, Grid, Icon} from 'semantic-ui-react';
import ModalExampleDocument from './ModalExampleDocument';

class TickerFilter extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            currencies : [
            {
                "key" : 1,
                "text" : "Loading from database ...",
                "value" : "N/A"
            }
            ],
            isModalOpen : false,
            currency: "",
            collectionType: "timeseries"
        }
    }


    componentDidMount() {
        let currencies = [];
        console.log("Function called for currencies")
        this.props.user.functions.GetSymbols(null).then(
            result => {
                    result.map((currency) => (currencies.push({"text": currency._id, "value" : currency._id})))
                    console.log(`Number of currencies retrieved from database: ${currencies.length}`);
                    this.setState({
                        currencies: currencies,
                        currency: currencies[0].value
                    });
                    this.propagateChoiceIfNotInTheContext(currencies[0].value, this.props.symbolHandler)
            }
        );
    }


    propagateChoiceIfNotInTheContext (value, functionToCall) {
        functionToCall(value)
    }

    render () {
        
        return (

                    <>
                    <Form.Field required>
                            <Form.Group>
                                <Form.Dropdown 
                                    required
                                    width={8}
                                    label="Currency"
                                    placeholder='Loading from Database...' 
                                    search
                                    selection 
                                    options={this.state.currencies} 
                                    value={this.state.currency}
                                    onChange={
                                        (event,data) => {
                                            this.setState({currency: data.value})
                                            this.propagateChoiceIfNotInTheContext(data.value, this.props.symbolHandler)
                                                
                                    }}
                                />                                        

                                <Popup hideOnScroll flowing hoverable trigger={<Form.Button fluid icon labelPosition='left' color='green' size="small" label="&nbsp;"><Icon name='search'/>Show Example Data</Form.Button>}>
                                    <Grid relaxed columns={2} centered divided>
                                    <Grid.Column textAlign='center' width={6}>
                                        <Header as='h4'>Time-Series Collection</Header>
                                        <p>
                                            From the collection where the application interacts
                                        </p>
                                        <Button icon labelPosition='right' color='green' onClick={() => this.setState({isModalOpen:true, collectionType:"timeseries"})}><Icon name='chart line'/>Show Data</Button> 
                                    </Grid.Column>
                                    <Grid.Column textAlign='center' width={6}>
                                        <Header as='h4'>System Bucketed Collection</Header>
                                        <p>
                                            From the collection where the data is actually stored
                                        </p>
                                        <Button icon labelPosition='right' color='green' onClick={() => this.setState({isModalOpen:true, collectionType:"bucketed"})}><Icon name='list'/>Show Data</Button>
                                    </Grid.Column>
                                    </Grid>
                                </Popup>
                                
                            </Form.Group>
                    </Form.Field>
                    <ModalExampleDocument
                        user={this.props.user}
                        modalOpen={this.state.isModalOpen}
                        handleClose={
                            () => {
                              this.setState({ isModalOpen: false })
                            }
                          }
                        currency={this.state.currency}
                        collectionType={this.state.collectionType}
                    
                    />
                    </>
                    
        )
    }
}

export default TickerFilter