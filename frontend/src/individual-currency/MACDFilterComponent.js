import React from 'react';
import 'fomantic-ui-css/semantic.css';
import { Form, Checkbox, Input } from 'semantic-ui-react';
import TickerAnalysisContext from './TickerAnalysisContext';

class MACDFilter extends React.Component {

    render () {
        return (
                    <Form.Group inline>
                        <Form.Field>
                            <Checkbox 
                                label={this.props.name} 
                                checked={this.context.enabledFilters.macd} 
                                onClick={() => this.context.toggleMacd()} />    
                        </Form.Field>
                        <Form.Field>
                            <Input 
                                value={this.context.numOfPrevDataPointsMacdLine1} 
                                disabled={!this.context.enabledFilters.macd} 
                                type="number" 
                                label="# of previous data points for first param of MACD Line:" 
                                onChange={(x) => this.context.setNumOfPrevDataPointsMacdLine1(x.currentTarget.value)}>
                            </Input>
                            <Input 
                                value={this.context.numOfPrevDataPointsMacdLine2} 
                                disabled={!this.context.enabledFilters.macd} 
                                type="number" 
                                label="# of previous data points for second param of MACD Line:" 
                                onChange={(x) => this.context.setNumOfPrevDataPointsMacdLine2(x.currentTarget.value)}>
                            </Input>
                            <Input 
                                value={this.context.numOfPrevDataPointsMacdSignal} 
                                disabled={!this.context.enabledFilters.macd} 
                                type="number" 
                                label="# of previous data points MACD Signal Line:" 
                                onChange={(x) => this.context.setNumOfPrevDataPointsMacdSignal(x.currentTarget.value)}>
                            </Input>
                        </Form.Field>
                    </Form.Group>
        )
    }
}

MACDFilter.contextType = TickerAnalysisContext
export default MACDFilter