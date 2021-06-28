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

//  document.body.style = 'background: black;';

class Generator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // jsonData is stored as array of addresses(strings), their position in the array will be used as their eventual "num" value
      // json export format => [{"name": "<address string>", "value": 255, "num": 0}, ...] value property sets the default brightness, this can be 255 for all.
      jsonData: ["b-01-01", "b-01-02", "b-01-03"],
      previousJsonData: ["b-01-01", "b-01-02", "b-01-03"],
      blockInput: {name: "a-01-01", numToAdd: 1, startNum: 0},
      sequenceInput: {startNum: 0, building: 'a', floorStart: 1, floorEnd: 7, apartmentSequence: ['01','02','03','04']},
      jsonDataTest: [],
    }
    // Bindings
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleExecuteBlock = this.handleExecuteBlock.bind(this);
    this.handleChangeBlockStartNum = this.handleChangeBlockStartNum.bind(this);
    this.handleChangeBlockNumToAdd = this.handleChangeBlockNumToAdd.bind(this);
    this.handleUndo = this.handleUndo.bind(this);
    this.handleClearNames = this.handleClearNames.bind(this);
    this.handleChangeSequenceStartNum = this.handleChangeSequenceStartNum.bind(this);
    this.handleChangeSequenceBuilding = this.handleChangeSequenceBuilding.bind(this);
    this.handleChangeSequenceFloorStart = this.handleChangeSequenceFloorStart.bind(this);
    this.handleChangeSequenceFloorEnd = this.handleChangeSequenceFloorEnd.bind(this);
    this.handleChangeSequenceApartments = this.handleChangeSequenceApartments0.bind(this);
    this.handleChangeSequenceApartments = this.handleChangeSequenceApartments1.bind(this);
    this.handleChangeSequenceApartments = this.handleChangeSequenceApartments2.bind(this);
    this.handleChangeSequenceApartments = this.handleChangeSequenceApartments4.bind(this);
    this.handleChangeSequenceApartments = this.handleChangeSequenceApartments5.bind(this);
    this.handleChangeSequenceApartments = this.handleChangeSequenceApartments6.bind(this);
    this.handleChangeSequenceApartments = this.handleChangeSequenceApartments7.bind(this);
    this.handleChangeSequenceApartments = this.handleChangeSequenceApartments8.bind(this);
    this.handleChangeSequenceApartments = this.handleChangeSequenceApartments9.bind(this);
    this.handleExecuteSequence = this.handleExecuteSequence.bind(this);
    this.insufficientData = this.insufficientData.bind(this);
    this.sequenceGenerator = this.sequenceGenerator.bind(this);
    this.sequenceGeneratorDescending = this.sequenceGeneratorDescending.bind(this);
  }

  validateNumeric(input) {
    if(input === null) {
      return input
    } else {
      return input.match(/[0-9]*/)
    }
  };

  validateNameLength(input) {
    if(input === null || input.length < 7) {
      return input
    } else {
      return input.substring(0, 7)
    }
  }

  // Input handler for Block Add 'startNum'
  handleChangeBlockStartNum(event) {
    // Deep clone of state object made with stringify
    let blockStateObjectClone = JSON.parse(JSON.stringify(this.state.blockInput));
    // call to numeric validation function  
    blockStateObjectClone['startNum'] = this.validateNumeric(event.target.value)
    // validate that value is within max of array length
    // this will probably happen at execution -> if the value is out of range the LEDs get added at the end of the array
    // if(stateObjectClone['startNum'] > this.state.jsonData.length) {
    //   stateObjectClone['startNum'] = this.state.jsonData.length
    // }
    this.setState({
      blockInput: blockStateObjectClone,
    });
  }

  // Input handler for Block Add 'name'
  handleChangeName(event) {
    let stateObjectClone = JSON.parse(JSON.stringify(this.state.blockInput));
    stateObjectClone['name'] = this.validateNameLength(event.target.value)
    this.setState({
      blockInput: stateObjectClone,
    });
  }

  // Input handler for Block Add 'numToAdd'
  handleChangeBlockNumToAdd(event) {
    let stateObjectClone = JSON.parse(JSON.stringify(this.state.blockInput));
    stateObjectClone['numToAdd'] = this.validateNumeric(event.target.value);
    this.setState({
      blockInput: stateObjectClone,
    });
  }

  //  method to generate block add array
  blockArray(name, ledCount) {
    let output = [];
    for(let i = 0; i < ledCount; i++) {
      output.push(name)
    }
    return output
  }

  // Method to update state 'jsonData' to include new block name(s)
  handleExecuteBlock(event) {
    // This call prevents the submit button's default behaviour of reloading the page
    event.preventDefault()
    // Deep working copy of state 'jsonData'
    let nameArray = [...this.state.jsonData];
    // copy of state block input object 
    let stateObjectClone = JSON.parse(JSON.stringify(this.state.blockInput));
    // numToAdd null value caught
    if(stateObjectClone['numToAdd'] === null) stateObjectClone['numToAdd'] = 0;
    // call to array generator method
    let arrayToAdd = this.blockArray(stateObjectClone['name'], stateObjectClone['numToAdd']);
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // Consider revision for alternative behaviour
    // catching out of range error and adding new array to the end
    if(stateObjectClone['startNum'] > nameArray.length) {
      nameArray = [...nameArray, ...arrayToAdd];
    } else {
      // default behaviour of adding new array at specified index
      nameArray.splice(this.state.blockInput['startNum'], 0, ...arrayToAdd);
    }
    // copy of state 'jsonData' for undo
    let jsonDataPrevious = [...this.state.jsonData];

    this.setState({
      previousJsonData: jsonDataPrevious,
      jsonData: nameArray,
      blockInput: {name: stateObjectClone['name'], numToAdd: stateObjectClone['numToAdd'], startNum: nameArray.length},
    });
  }
  // method to handle undo to json
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // Consider revision for multiple undo, currently this only supports one undo
  handleUndo(event) {
    // copy of state 'jsonData' for undo
    let jsonDataPrevious = [...this.state.previousJsonData];
    this.setState({
      jsonData: jsonDataPrevious
    });
  }

  // method to clear 'jsonData'
  handleClearNames(event) {
    // copy of state 'jsonData' for undo
    let jsonDataPrevious = [...this.state.jsonData];
    this.setState({
      jsonData: [],
      previousJsonData: jsonDataPrevious,
    })
  }

  // handler for input of sequence start number
  handleChangeSequenceStartNum(event) {
    // Deep clone of state object made with stringify
    let sequenceStateObjectClone = JSON.parse(JSON.stringify(this.state.sequenceInput));
    // call to numeric validation function  
    sequenceStateObjectClone['startNum'] = this.validateNumeric(event.target.value).toString();
    this.setState({
      sequenceInput: sequenceStateObjectClone,
    });
  };

  // validate building name to 2 characters
  validateBuilding(input) {
    if(input === null) {
      return input;
    } else {
      return input.match(/[\w\d]{0,2}/);
    }
  };

  // handler for sequence building name
  handleChangeSequenceBuilding(event) {
    // Deep clone of state object made with stringify
    let sequenceStateObjectClone = JSON.parse(JSON.stringify(this.state.sequenceInput));
    // call to numeric validation function  
    sequenceStateObjectClone['building'] = this.validateBuilding(event.target.value).toString();
    this.setState({
      sequenceInput: sequenceStateObjectClone,
    });
  }

    // validate building name to 2 numeric characters
    validateTwoNumeric(input) {
      if(input === null) {
        return input;
      } else {
        return input.match(/[\d]{0,2}/);
      }
    };

  // handler for sequence floor start
  handleChangeSequenceFloorStart(event) {
    // Deep clone of state object made with stringify
    let sequenceStateObjectClone = JSON.parse(JSON.stringify(this.state.sequenceInput));
    // call to numeric validation function  
    sequenceStateObjectClone['floorStart'] = this.validateTwoNumeric(event.target.value).toString();
    this.setState({
      sequenceInput: sequenceStateObjectClone,
    });
  }

  // handler for sequence floor end
  handleChangeSequenceFloorEnd(event) {
    // Deep clone of state object made with stringify
    let sequenceStateObjectClone = JSON.parse(JSON.stringify(this.state.sequenceInput));
    // call to numeric validation function  
    sequenceStateObjectClone['floorEnd'] = this.validateTwoNumeric(event.target.value).toString();
    this.setState({
      sequenceInput: sequenceStateObjectClone,
    });
  }
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // handlers for sequence input. This should be better -> one method which accepts the neccecary params rather than 10 different methods
  handleChangeSequenceApartments0(event) {
    let sequenceStateObjectClone = JSON.parse(JSON.stringify(this.state.sequenceInput));
    let addressArray = [...sequenceStateObjectClone['apartmentSequence']];
    addressArray.splice(0, 1, this.validateTwoNumeric(event.target.value));
    sequenceStateObjectClone['apartmentSequence'] = addressArray;
    this.setState({
      sequenceInput: sequenceStateObjectClone,
    });
  }
  handleChangeSequenceApartments1(event) {
    let sequenceStateObjectClone = JSON.parse(JSON.stringify(this.state.sequenceInput));
    let addressArray = [...sequenceStateObjectClone['apartmentSequence']];
    addressArray.splice(1, 1, this.validateTwoNumeric(event.target.value));
    sequenceStateObjectClone['apartmentSequence'] = addressArray;
    this.setState({
      sequenceInput: sequenceStateObjectClone,
    });
  }
  handleChangeSequenceApartments2(event) {
    let sequenceStateObjectClone = JSON.parse(JSON.stringify(this.state.sequenceInput));
    let addressArray = [...sequenceStateObjectClone['apartmentSequence']];
    addressArray.splice(2, 1, this.validateTwoNumeric(event.target.value));
    sequenceStateObjectClone['apartmentSequence'] = addressArray;
    this.setState({
      sequenceInput: sequenceStateObjectClone,
    });
  }
  handleChangeSequenceApartments3(event) {
    let sequenceStateObjectClone = JSON.parse(JSON.stringify(this.state.sequenceInput));
    let addressArray = [...sequenceStateObjectClone['apartmentSequence']];
    addressArray.splice(3, 1, this.validateTwoNumeric(event.target.value));
    sequenceStateObjectClone['apartmentSequence'] = addressArray;
    this.setState({
      sequenceInput: sequenceStateObjectClone,
    });
  }
  handleChangeSequenceApartments4(event) {
    let sequenceStateObjectClone = JSON.parse(JSON.stringify(this.state.sequenceInput));
    let addressArray = [...sequenceStateObjectClone['apartmentSequence']];
    addressArray.splice(4, 1, this.validateTwoNumeric(event.target.value));
    sequenceStateObjectClone['apartmentSequence'] = addressArray;
    this.setState({
      sequenceInput: sequenceStateObjectClone,
    });
  }
  handleChangeSequenceApartments5(event) {
    let sequenceStateObjectClone = JSON.parse(JSON.stringify(this.state.sequenceInput));
    let addressArray = [...sequenceStateObjectClone['apartmentSequence']];
    addressArray.splice(5, 1, this.validateTwoNumeric(event.target.value));
    sequenceStateObjectClone['apartmentSequence'] = addressArray;
    this.setState({
      sequenceInput: sequenceStateObjectClone,
    });
  }
  handleChangeSequenceApartments6(event) {
    let sequenceStateObjectClone = JSON.parse(JSON.stringify(this.state.sequenceInput));
    let addressArray = [...sequenceStateObjectClone['apartmentSequence']];
    addressArray.splice(6, 1, this.validateTwoNumeric(event.target.value));
    sequenceStateObjectClone['apartmentSequence'] = addressArray;
    this.setState({
      sequenceInput: sequenceStateObjectClone,
    });
  }
  handleChangeSequenceApartments7(event) {
    let sequenceStateObjectClone = JSON.parse(JSON.stringify(this.state.sequenceInput));
    let addressArray = [...sequenceStateObjectClone['apartmentSequence']];
    addressArray.splice(7, 1, this.validateTwoNumeric(event.target.value));
    sequenceStateObjectClone['apartmentSequence'] = addressArray;
    this.setState({
      sequenceInput: sequenceStateObjectClone,
    });
  }
  handleChangeSequenceApartments8(event) {
    let sequenceStateObjectClone = JSON.parse(JSON.stringify(this.state.sequenceInput));
    let addressArray = [...sequenceStateObjectClone['apartmentSequence']];
    addressArray.splice(8, 1, this.validateTwoNumeric(event.target.value));
    sequenceStateObjectClone['apartmentSequence'] = addressArray;
    this.setState({
      sequenceInput: sequenceStateObjectClone,
    });
  }
  handleChangeSequenceApartments9(event) {
    let sequenceStateObjectClone = JSON.parse(JSON.stringify(this.state.sequenceInput));
    let addressArray = [...sequenceStateObjectClone['apartmentSequence']];
    addressArray.splice(9, 1, this.validateTwoNumeric(event.target.value));
    sequenceStateObjectClone['apartmentSequence'] = addressArray;
    this.setState({
      sequenceInput: sequenceStateObjectClone,
    });
  }

  insufficientData(array) {
    this.setState({jsonDataTest: array});
  };

  sequenceGenerator(building, start, end, apartments) {
    let floorArray = [];
    for(let i = start; i <= end; i++) {
      for(let j = 0; j < apartments.length; j++) {
        if(i < 1) {
        floorArray.push(building + '00-' + apartments[j]);
        } else if(i < 10) {
          floorArray.push(building + '0' + i + '-' + apartments[j]);
        } else {
          floorArray.push(building + i + '-' + apartments[j]);
        }
      }
    }
    return floorArray;
  };

  sequenceGeneratorDescending(building, start, end, apartments) {
    let floorArray = [];
    for(let i = start; i >= end; i--) {
      for(let j = 0; j < apartments.length; j++) {
        if(i < 1) {
        floorArray.push(building + '00-' + apartments[j]);
        } else if(i < 10) {
          floorArray.push(building + '0' + i + '-' + apartments[j]);
        } else {
          floorArray.push(building + i + '-' + apartments[j]);
        }
      }
    }
    return floorArray;
  };

  handleExecuteSequence(event) {
    // This call prevents the submit button's default behaviour of reloading the page
    event.preventDefault()
    const sequenceStateObjectClone = JSON.parse(JSON.stringify(this.state.sequenceInput));
    // Deep working copy of state 'jsonData'
    let nameArray = [...this.state.jsonData];
    let arrayToAdd = [];

    if(sequenceStateObjectClone['building'].length === 0) {
      this.insufficientData(arrayToAdd);
    } else if(sequenceStateObjectClone['floorStart'].length === 0) {
      this.insufficientData(arrayToAdd);
    } else if(sequenceStateObjectClone['floorEnd'].length === 0) {
      this.insufficientData(arrayToAdd);
    } else if(Array(sequenceStateObjectClone['apartmentSequence']).length < 1) {
      this.insufficientData(arrayToAdd);
    } else {
      if(Number(sequenceStateObjectClone['floorStart']) < Number(sequenceStateObjectClone['floorEnd'])) {
        arrayToAdd = this.sequenceGenerator(sequenceStateObjectClone['building'] + '-', 
                                               sequenceStateObjectClone['floorStart'], 
                                               sequenceStateObjectClone['floorEnd'], 
                                               sequenceStateObjectClone['apartmentSequence'])
      } else {
        arrayToAdd = this.sequenceGeneratorDescending(sequenceStateObjectClone['building'] + '-', 
                                                      sequenceStateObjectClone['floorStart'], 
                                                      sequenceStateObjectClone['floorEnd'], 
                                                      sequenceStateObjectClone['apartmentSequence'])        
        
      }
    };

    if(Number(sequenceStateObjectClone['startNum']) > nameArray.length) {
      nameArray = [...nameArray, ...arrayToAdd];
    } else {
      // default behaviour of adding new array at specified index
      nameArray.splice(Number(sequenceStateObjectClone['startNum']), 0, ...arrayToAdd);
    }
    let jsonDataPrevious = [...this.state.jsonData];
    this.setState({
      previousJsonData: jsonDataPrevious,
      jsonData: nameArray,
    });
  }

  render() {
    const btnBlockAdd = <Button onClick={this.handleExecuteBlock} variant="success">Add Names</Button>;
    const btnUndo = <Button onClick={this.handleUndo} variant="warning">Undo</Button>;
    const btnClearJson = <Button onClick={this.handleClearNames} variant="danger">Clear Names</Button>;
    const btnSeqAdd = <Button onClick={this.handleExecuteSequence} variant="success">Add Names</Button>;
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
              <FormControl placeholder=''
                           value={this.state.blockInput['startNum']}
                           onChange={this.handleChangeBlockStartNum.bind(this)}/>
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text>NAME</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl  placeholder='' 
                            value={this.state.blockInput['name']} 
                            onChange={this.handleChangeName.bind(this)}/>
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text>NUMBER OF LEDs TO ADD</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl placeholder=''
                           value={this.state.blockInput['numToAdd']}
                           onChange={this.handleChangeBlockNumToAdd.bind(this)}/>
            </InputGroup>
            
            <ButtonGroup>
              {btnBlockAdd}
              {btnUndo}
              {btnClearJson}
            </ButtonGroup>
          </Tab>
          <Tab eventKey="add-sequence-of-names" title="Add Sequence of Names">
            <Alert variant="secondary">This does xyz</Alert>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text>START AT LED NUMBER</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl value={this.state.sequenceInput['startNum']} 
                           onChange={this.handleChangeSequenceStartNum.bind(this)}/>
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text>BUILDING</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl value={this.state.sequenceInput['building']}
                           onChange={this.handleChangeSequenceBuilding.bind(this)}/>
            </InputGroup >

            <InputGroup  className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text>FLOOR START</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl value={this.state.sequenceInput['floorStart']}
                           onChange={this.handleChangeSequenceFloorStart.bind(this)}/>            
              <InputGroup.Prepend>
                <InputGroup.Text>FLOOR END</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl value={this.state.sequenceInput['floorEnd']}
                           onChange={this.handleChangeSequenceFloorEnd.bind(this)}/>    
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text>APARTMENTS</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl value={this.state.sequenceInput['apartmentSequence'][0]}
                                  onChange={this.handleChangeSequenceApartments0.bind(this)}/>
              <FormControl value={this.state.sequenceInput['apartmentSequence'][1]}
                                  onChange={this.handleChangeSequenceApartments1.bind(this)}/>
              <FormControl value={this.state.sequenceInput['apartmentSequence'][2]}
                                  onChange={this.handleChangeSequenceApartments2.bind(this)}/>
              <FormControl value={this.state.sequenceInput['apartmentSequence'][3]}
                                  onChange={this.handleChangeSequenceApartments3.bind(this)}/>
              <FormControl value={this.state.sequenceInput['apartmentSequence'][4]}
                                  onChange={this.handleChangeSequenceApartments4.bind(this)}/>
              <FormControl value={this.state.sequenceInput['apartmentSequence'][5]}
                                  onChange={this.handleChangeSequenceApartments5.bind(this)}/>
              <FormControl value={this.state.sequenceInput['apartmentSequence'][6]}
                                  onChange={this.handleChangeSequenceApartments6.bind(this)}/>
              <FormControl value={this.state.sequenceInput['apartmentSequence'][7]}
                                  onChange={this.handleChangeSequenceApartments7.bind(this)}/>
              <FormControl value={this.state.sequenceInput['apartmentSequence'][8]}
                                  onChange={this.handleChangeSequenceApartments8.bind(this)}/>
              <FormControl value={this.state.sequenceInput['apartmentSequence'][9]}
                                  onChange={this.handleChangeSequenceApartments9.bind(this)}/>
            </InputGroup>
            
            <Alert variant="secondary">floor array test - {this.state.jsonDataTest}</Alert>
            <Alert >startNum - {typeof this.state.sequenceInput['startNum']}</Alert>
            <Alert >floorStart - {typeof this.state.sequenceInput['floorStart']}  {this.state.sequenceInput['floorStart']}</Alert>
            <Alert >apartmentSequence - {typeof this.state.sequenceInput['apartmentSequence']}  {this.state.sequenceInput['apartmentSequence']}</Alert>

            <ButtonGroup>
              {btnSeqAdd}
              {btnUndo}
              {btnClearJson}
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
