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

      this.setState({
        exampleData: "Please wait it's being loaded ..."
      });

      let symbol = `${this.props.currency}`
      let collectionType = `${this.props.collectionType}`
      this.props.user.functions.GetExampleDocument(symbol, collectionType).then(
        result => {
          this.setState({
            exampleData: JSON.stringify(result, null, 4)
          });
        }
      )
    }

    downloadData() { 
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