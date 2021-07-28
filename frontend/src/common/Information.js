import React from 'react';
import 'fomantic-ui-css/semantic.css';
import { Accordion, Icon } from 'semantic-ui-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

class Information extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex : 0
        }

    }
    

    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
        this.setState({ activeIndex: newIndex })
    }
    
    render() {
        const { activeIndex } = this.state
        return (
            <Accordion fluid styled>
                <Accordion.Title
                    active={activeIndex === 0}
                    index={0}
                    onClick={this.handleClick}>
                    
                    <Icon name='dropdown' />
                    Generated Aggregation Query
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 0}>
                    <SyntaxHighlighter showLineNumbers={true} language="json" style={docco}>
                        {this.props.query}    
                    </SyntaxHighlighter>    
                </Accordion.Content>
            </Accordion>
        )
    }
}

export default Information