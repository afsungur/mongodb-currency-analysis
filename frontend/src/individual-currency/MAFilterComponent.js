import React from 'react';
import 'fomantic-ui-css/semantic.css';
import { Form, Checkbox, Input } from 'semantic-ui-react';
import TickerAnalysisContext from './TickerAnalysisContext';


class MAFilter extends React.Component {

    render () {
        return (
            
                    <Form.Group inline>
                        <Form.Field>
                            <Checkbox 
                                label={this.props.name} 
                                checked={this.context.enabledFilters.movingAverage[this.props.number]}
                                onClick={() => this.context.toggleMovingAverage(this.props.number)} />    
                        </Form.Field>
                        <Form.Field>
                            <Input 
                                value={this.context.movingAverageFilters[this.props.number]} 
                                disabled={!this.context.enabledFilters.movingAverage[this.props.number]}
                                type="number" 
                                label="# of previous data points:" 
                                onChange={(x) => this.context.setMovingAverageFilter(this.props.number,x.currentTarget.value)}>
                            </Input>
                        </Form.Field>
                    </Form.Group>
        )
    }
}
MAFilter.contextType = TickerAnalysisContext
export default MAFilter