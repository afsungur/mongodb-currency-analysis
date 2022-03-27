import React from 'react';
import 'fomantic-ui-css/semantic.css';
import { Dropdown, Form } from 'semantic-ui-react';

const dropDownOptionForIntervalValues = [
    { key: 1, text: '1 Min', value: 1 },
    { key: 2, text: '3 Min', value: 3 },
    { key: 3, text: '5 Min', value: 5 },
    { key: 4, text: '10 Min', value: 10 },
    { key: 5, text: '15 Min', value: 15 },
    { key: 6, text: '30 Min', value: 30 },
    { key: 7, text: '1 Hour', value: 60 },
    { key: 8, text: '4 Hour', value: 240 },
    { key: 9, text: '8 Hour', value: 480 },
    { key: 9, text: '24 Hour', value: 1440 }
  ]

  class IntervalFilter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: 1
        }
    }

    handleChange (event, data) {
        // update state locally
        this.setState({value: data.value})
        
        // send state to parent
        this.props.sendController(data.value)
    }

    render () {
        return (
                    <Form.Field required>
                            <label>Interval</label>
                            <Dropdown 
                                selection
                                options={dropDownOptionForIntervalValues}
                                name="dropdown_interval_value"  
                                onChange={(event, data) => this.handleChange(event,data)}
                                value={this.state.value} 
                            />
                    </Form.Field>
        )
    }
}



export default IntervalFilter