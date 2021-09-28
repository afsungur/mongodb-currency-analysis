import React from 'react';
import 'fomantic-ui-css/semantic.css';
import { Modal,  Button, Icon} from 'semantic-ui-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';



class ModalExampleDocument extends React.Component {

    constructor(props) {
      super(props)

        this.state = {
          exampleData: ""
        }
    }

    fetchData() {
      let url = `${process.env.REACT_APP_ENDPOINT_EXAMPLE_DOCUMENT}`
      url += `?currency=${this.props.currency}&collectionType=${this.props.collectionType}`
      console.log(`API endpoint for retrieving currencies: ${url}`)
      this.setState({
        exampleData: "Please wait it's being loaded ..."
      });
      fetch(`${url}`)
            .then(response => {
                return response.json()
            }).then(data => {

                let jsonobject=data

                console.log("Returned data for example data:"+ JSON.stringify(data))

                this.setState({
                    exampleData: jsonobject
            });
        });
    }



    render() {
    return (
      <Modal
        open={this.props.modalOpen}
        closeOnEscape={true}
        closeOnRootNodeClick={true}
        onClose={this.props.handleClose}
        onMount={() => this.fetchData()}
      >
        <Modal.Header>Example Document</Modal.Header>
        <Modal.Content image scrolling>
  
          <Modal.Description>
          <SyntaxHighlighter showLineNumbers={true} language="json" style={dark}>
              {this.state.exampleData}  
          </SyntaxHighlighter>  
  
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => this.props.handleClose()} primary>
            Close <Icon name='window close' />
          </Button>
        </Modal.Actions>
      </Modal>
    )}
  }


export default ModalExampleDocument