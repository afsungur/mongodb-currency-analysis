import React from 'react';
import 'fomantic-ui-css/semantic.css';
import { Form, Checkbox, Input } from 'semantic-ui-react';
import IndividiualCurrencyContext from './IndividualCurrencyContext';

class RSIFilter extends React.Component {
 
    
    render () {
        return (
                    <Form.Group inline>
                        <Form.Field>
                            <Checkbox 
                                label={this.props.name} 
                                checked={this.context.enabledFilters.rsi}
                                onClick={() => this.context.toggleRSI()} 
                            />    
                        </Form.Field>
                        <Form.Field>
                            <Input 
                                value={this.context.numOfPrevDataPointsRSI} 
                                disabled={!this.context.enabledFilters.rsi} 
                                type="number" 
                                label="# of previous data points:" 
                                onChange={(x) => this.context.setNumOfPrevDataPointsRSI(x.currentTarget.value)}>
                            </Input>
                        </Form.Field>
                    </Form.Group>
        )
    }
}
RSIFilter.contextType = IndividiualCurrencyContext
export default RSIFilter