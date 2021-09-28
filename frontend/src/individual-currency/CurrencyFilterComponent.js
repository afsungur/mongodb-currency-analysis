import React from 'react';
import 'fomantic-ui-css/semantic.css';
import { Form , Popup, Button, Grid, Icon} from 'semantic-ui-react';
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
        console.log(`API endpoint for retrieving currencies: ${process.env.REACT_APP_ENDPOINT_LIST_OF_CURRENCIES}`)
        fetch(`${process.env.REACT_APP_ENDPOINT_LIST_OF_CURRENCIES}`)
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
                });
                
        });
    }

    setCurrency (value) {
        this.setState({currency: value})
    }

    render () {
        
        return (
            <IndividiualCurrencyContext.Consumer>
                {context => (
                    <>
                   
                    <Form.Field required>
                            <Form.Group>
                                <Form.Dropdown 
                                    width={8}
                                    label="Currency"
                                    placeholder='Currency' 
                                    search
                                    selection 
                                    options={this.state.currencies} 
                                    onChange={(event,data) => {context.setCurrency(data.value); this.setCurrency(data.value)}}
                                />                                        

                                <Popup hideOnScroll wide on='click' trigger={<Form.Button icon labelPosition='left' color='green' size="small" label="&nbsp;"><Icon name='search'/>Show Example Data</Form.Button>}>
                                    <Grid divided columns='equal'>
                                    <Grid.Column>
                                        <Popup
                                        hideOnScroll 
                                        trigger={<Button fluid icon labelPosition='right' color='green' onClick={() => this.setState({isModalOpen:true, collectionType:"timeseries"})}><Icon name='chart line'/>Time Series Collections</Button>}
                                        content='Show the data from the collection where the application interacts'
                                        position='top center'
                                        size='tiny'
                                        inverted
                                        />                                        
                                        
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Popup
                                        hideOnScroll 
                                        trigger={<Button fluid icon labelPosition='right' color='green' onClick={() => this.setState({isModalOpen:true, collectionType:"bucketed"})}><Icon name='list'/>System Bucket Collections</Button>}                                        content='Show the data from the collection where the actual data is stored'
                                        position='top center'
                                        size='tiny'
                                        inverted
                                        />                                        
                                        
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
                )}
            </IndividiualCurrencyContext.Consumer>
        )
    }
}

export default CurrencyFilter