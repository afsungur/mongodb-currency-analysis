import React, { useContext } from 'react';
import 'fomantic-ui-css/semantic.css';
import { Form, Header, Popup, Button, Grid, Icon} from 'semantic-ui-react';
import IndividiualCurrencyContext from './IndividualCurrencyContext';
import ModalExampleDocument from './ModalExampleDocument';

class CurrencyFilter extends React.Component {
    
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

        console.log(`API endpoint for retrieving currencies: ${window['getConfig'].REACT_APP_ENDPOINT_LIST_OF_CURRENCIES}`)
        fetch(`${window['getConfig'].REACT_APP_ENDPOINT_LIST_OF_CURRENCIES}`)
            .then(response => {
                return response.json()
            }).then(data => {
                console.log(data)

                currencies = data.map((currency) => {
                    return {"text": currency._id, "value" : currency._id}
                });
                console.log(`Number of currencies retrieved from database: ${currencies.length}`);
               

                this.setState({
                    currencies: currencies,
                    currency: currencies[0].value
                });

                this.propagateChoiceIfNotInTheContext(currencies[0].value, this.props.symbolHandler)

                
        });
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
                                    placeholder='Currency' 
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

export default CurrencyFilter