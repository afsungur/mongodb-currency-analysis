import React from 'react';
import 'fomantic-ui-css/semantic.css';
import { Dropdown, Form, Popup, Icon } from 'semantic-ui-react';

const dropDownOptionForDateFilterValues = [
    { key: 1, text: 'Last 3 Days', value: 3 },
    { key: 2, text: 'Last 7 Days', value: 7 },
    { key: 3, text: 'Last 15 Days', value: 15 },
    { key: 4, text: 'Last 30 Days', value: 30 }    
]

  class DateFilter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: 3
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
                        <Form.Group>
                            <Form.Dropdown 
                                selection
                                required
                                width={8}
                                label="Date Filter"
                                options={dropDownOptionForDateFilterValues}
                                name="dropdown_date_filter_value"  
                                onChange={(event, data) => this.handleChange(event,data)}
                                value={this.state.value} 
                            />
                      

                            <Popup hideOnScroll flowing hoverable 
                            trigger={<Form.Button fluid icon labelPosition='left' color='green' size="small" label="&nbsp;"><Icon name='info circle'/>Data Source Info</Form.Button>}>
                                <p><b>Last 3 Days:</b> Brings only last 3 days of data from MongoDB Atlas Cluster</p>
                                <p><b>Last 7 Days:</b> Brings only last 7 days of data both from MongoDB Atlas Cluster and Online Archive</p>
                                <p><b>Last 15 Days:</b> Brings only last 15 days of data both from MongoDB Atlas Cluster and Online Archive</p>
                                <p><b>Last 30 Days:</b> Brings only last 30 days of data both from MongoDB Atlas Cluster and Online Archive</p>
                            </Popup>
                        </Form.Group>
                    </Form.Field>
        )
    }
}



export default DateFilter