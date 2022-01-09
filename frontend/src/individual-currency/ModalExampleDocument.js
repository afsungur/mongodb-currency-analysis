import React from 'react';
import 'fomantic-ui-css/semantic.css';
import { Modal,  Button, Icon} from 'semantic-ui-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';



class ModalExampleDocument extends React.Component {

    constructor(props) {
      super(props)

        this.state = {
          exampleData: "",
          fileDownloadUrl: "",
          fileName: ""
        }

        this.downloadData = this.downloadData.bind(this);

    }

    fetchData() {
      let url = `${window['getConfig'].REACT_APP_ENDPOINT_EXAMPLE_DOCUMENT}`
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

    downloadData() { 
        var object = {
          "name" : 1,
          "surname" : 2
        }
        var output = this.state.exampleData
        const blob = new Blob([output]);
        const fileDownloadUrl = URL.createObjectURL(blob);
        const fileName = this.props.currency + "_example.json"
        this.setState ({fileDownloadUrl: fileDownloadUrl, fileName: fileName}, 
          () => {
            this.dofileDownload.click(); 
            URL.revokeObjectURL(fileDownloadUrl);  // free up storage--no longer needed.
            this.setState({fileDownloadUrl: ""})
        })    
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
        <Modal.Header>Example Data</Modal.Header>
        <Modal.Content image scrolling>
  
          <Modal.Description>
          <SyntaxHighlighter showLineNumbers={true} language="json" style={dark}>
              {this.state.exampleData}  
          </SyntaxHighlighter>  
  
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => this.downloadData()} primary>
            Download Example Set <Icon name='download' />
          </Button>
          <a className="hidden"
             download={this.state.fileName}
             href={this.state.fileDownloadUrl}
             ref={e=>this.dofileDownload = e}
          ></a>
          <Button onClick={() => this.props.handleClose()} primary>
            Close <Icon name='window close' />
          </Button>
        </Modal.Actions>
      </Modal>
    )}
  }


export default ModalExampleDocument