import React from 'react';
import 'fomantic-ui-css/semantic.css';
import { Dropdown, Form } from 'semantic-ui-react';
import IndividiualCurrencyContext from './IndividualCurrencyContext';

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
        ]
        }
    }

    componentDidMount() {
        let currencies = [];
        console.log(`API endpoint for retrieving currencies: ${process.env.REACT_APP_ENDPOINT_LIST_OF_CURRENCIES}`)
        fetch(`${process.env.REACT_APP_ENDPOINT_LIST_OF_CURRENCIES}`)
            .then(response => {
                return response.json()
            }).then(data => {
                let jsonobject=data
                let result=JSON.parse(jsonobject)
                currencies = result.map((currency) => {
                    return {"text": currency._id, "value" : currency._id}
                });
                console.log(`Number of currencies retrieved from database: ${currencies.length}`);
                this.setState({
                    currencies: currencies,
            });
        });
    }
    
    render () {
        
        return (
            <IndividiualCurrencyContext.Consumer>
                {context => (
                    <Form.Field required>
                            <label>Currency</label>
                            <Dropdown 
                                placeholder='Currency' 
                                search 
                                selection 
                                options={this.state.currencies} 
                                onChange={(event,data) => context.setCurrency(data.value)}
                            />
                    </Form.Field>
                )}
            </IndividiualCurrencyContext.Consumer>
        )
    }
}

export default CurrencyFilter