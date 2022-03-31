import React from 'react';
import 'fomantic-ui-css/semantic.css';
import { Form, Checkbox, Input } from 'semantic-ui-react';
import IndividiualCurrencyContext from './IndividualCurrencyContext';

class StochasticOscillatorFilter extends React.Component {
 
    
    render () {
        return (
                    <Form.Group inline>
                        <Form.Field>
                            <Checkbox 
                                label={this.props.name} 
                                checked={this.context.enabledFilters.stochasticOscillator}
                                onClick={() => this.context.toggleStochasticOscillator()} 
                            />    
                        </Form.Field>
                        <Form.Field>
                            <Input 
                                value={this.context.numOfPrevDataPointsStochasticOscillator} 
                                disabled={!this.context.enabledFilters.stochasticOscillator} 
                                type="number" 
                                label="# of previous data points:" 
                                onChange={(x) => this.context.setNumOfPrevDataPointsnumOfPrevDataPointsStochasticOscillator(x.currentTarget.value)}>
                            </Input>
                        </Form.Field>
                    </Form.Group>
        )
    }
}
StochasticOscillatorFilter.contextType = IndividiualCurrencyContext
export default StochasticOscillatorFilter