import './App.css';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Container from 'react-bootstrap/Container';
import React from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Alert from 'react-bootstrap/Alert';
import Table from 'react-bootstrap/Table';
import Badge from 'react-bootstrap/Badge'

// document.body.style = 'background: black;';

class Generator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // jsonData is stored as array of addresses(strings), their position in the array will be used as their eventual "num" value
      // json export format => [{"name": "<address string>", "value": 255, "num": 0}, ...] value property sets the default brightness, this can be 255 for all.
      jsonData: ["b-01-01", "b-01-02", "b-01-03"],
      blockInput: {name: "", numToAdd: null, startNum: null},
      sequenceInput: {address: "", floorStart: 1, floorEnd: 7, apartmentSequence: [1,3,5,7]},
    }
    // Bind here...
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleExecuteBlock = this.handleExecuteBlock.bind(this);
    this.handleChangeStartNum = this.handleChangeStartNum.bind(this);
    this.handleChangeNumToAdd = this.handleChangeNumToAdd(this);
  }

  validateNumeric(input) {
    if(input === null) {
      return input
    } else {
      return input.match(/[0-9]*/)
    }
  };

  validateNameLength(input) {
    if(input === null || input.length < 10) {
      return input
    } else {
      return input.substring(0, 10)
    }
  }

  handleChangeStartNum(event) {
    // Deep clone of state object made with stringify
    let stateObjectClone = JSON.parse(JSON.stringify(this.state.blockInput));
    // call to numeric validation function  
    stateObjectClone['startNum'] = this.validateNumeric(event.target.value)
    // validate that value is within max of array length
    // this will probably happen at execution -> if the value is out of range the LEDs get added at the end of the array
    // if(stateObjectClone['startNum'] > this.state.jsonData.length) {
    //   stateObjectClone['startNum'] = this.state.jsonData.length
    // }
    this.setState({
      blockInput: stateObjectClone,
    });
  }

  // Method to update input for 'name' as input element is updated
  handleChangeName(event) {
    let stateObjectClone = JSON.parse(JSON.stringify(this.state.blockInput));
    stateObjectClone['name'] = this.validateNameLength(event.target.value)
    this.setState({
      blockInput: stateObjectClone,
    });
  }

  handleChangeNumToAdd(event) {
    let stateObjectClone = JSON.parse(JSON.stringify(this.state.blockInput));
    stateObjectClone['numToAdd'] = this.validateNumeric(event.target.value)
    this.setState({
      blockInput: stateObjectClone,
    });
  }

  // Method to update state 'jsonData' to include new name(s)
  handleExecuteBlock(event) {
    // This call prevents the submit button's default behaviour of reloading the page
    event.preventDefault()
    // Deep copy of state 'jsonData'
    const nameArray = [...this.state.jsonData]
    // new name added at end of array
    // !!! needs changing to add name(s) at the specified index
    nameArray.push(this.state.blockInput['name'])
    this.setState((state) => ({
      jsonData: nameArray
    }));
  }
  render() {
    return (
      <div>
        <br />
        <Tabs className="mb-3" variant="pills">
          <Tab eventKey="add-block-of-name(s)" title="Add Name or Block of Names">
            <Alert variant="secondary">This does xyz</Alert>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text>START AT LED NUMBER</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl placeholder='Leave blank to add at end, value greater than last led number will be ignored and name added at end'
                           value={this.state.blockInput['startNum']}
                           onChange={this.handleChangeStartNum.bind(this)}/>
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text>NAME</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl  placeholder='Required, 10 characters max.' 
                            value={this.state.blockInput['name']} 
                            onChange={this.handleChangeName.bind(this)}/>
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text>Number of LEDs to add</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl  placeholder='Required, 10 characters max.' 
                            value={this.state.blockInput['numToAdd']} 
                            onChange={this.handleChangeNumToAdd.bind(this)}/>
            </InputGroup>

            {/* <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text>NUMBER OF LEDs TO ADD</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl placeholder='Required'
                           value={this.state.blockInput['numToAdd']}
                           onChange={this.handleChangeNumOfLedToAdd.bind(this)}/>
            </InputGroup> */}
            
            <ButtonGroup>
              <Button onClick={this.handleExecuteBlock} variant="primary">Add Names</Button>{' '}
              <Button variant="secondary">Clear Form</Button>
            </ButtonGroup>
          </Tab>
          <Tab eventKey="add-sequence-of-names" title="Add Sequence of Names">
            <Alert variant="secondary">This does xyz</Alert>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text>START AT LED NUMBER</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text>SEPARATOR</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl />          
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text>BUILDING</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl />
            </InputGroup >

            <InputGroup  className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text>FLOOR START</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl />            
              <InputGroup.Prepend>
                <InputGroup.Text>FLOOR END</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text>APARTMENT NUMBER SEQUENCE, SEPARATED WITH COMMAS ','</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl />
            </InputGroup>
            <ButtonGroup>
              <Button variant="primary">Add names</Button>{' '}
              <Button variant="secondary">Clear Form</Button>
            </ButtonGroup>
          </Tab>
          <Tab eventKey="edit-names" title="Edit/Delete Names">
            <Alert variant="secondary">This does xyz</Alert>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text>LED NUMBER TO EDIT/DELETE</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl />
              <Button variant="primary">Find LED name</Button>
              <Button variant="danger">Delete name</Button>{' '}
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text>NAME</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl />
              <Button variant="primary">Apply Changes</Button>{' '}
            </InputGroup>
            
            <ButtonGroup>
              <Button variant="secondary">Clear From</Button>{' '}
            </ButtonGroup>
          </Tab>
          <Tab eventKey="export-or-import-data" title="Export/Import Data">
            <Alert variant="secondary">This does xyz</Alert>
          </Tab>
        </Tabs>
        <br />
        <DataTable data={this.state.jsonData}/>
      </div>
    )
  }
}

class DataTable extends React.Component {
  render() {
    const addresses = [...this.props.data]
    const tableRows = addresses.map((index, name) =>
      <tr>
        <td>{name}</td>
        <td>{index}</td>
      </tr>
    )
    return (
      <div>
      <Table striped bordered hover size="sm" variant="dark">
        <thead>
          <tr>
            <th>number</th>
            <th>name</th>
          </tr>
        </thead>
        <tbody>
          {tableRows}
        </tbody>
      </Table>
    </div>
    )
  }
}

const App = () => (
  <Container className=""  id="">
      <Generator />
  </Container>
);

export default App;
