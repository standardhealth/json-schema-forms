//SchemaGenerator.js
import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import Form from "react-jsonschema-form";

class SchemaGenerator extends Component {
 constructor(props) {
   super(props);
   this.state = { author: '', 
                  text: '', 
                  url: 'http://localhost:3001/jsonSchema',
                };
   this.initializeSchema('fhir');
  };

  handleSubmit = e => {
    const jsonFile = 'fhir';
    e.preventDefault();
    axios.get(`${this.state.url}/${jsonFile}/`,)
    .then(res => {
      console.log(res.data);
      this.setState({ fhirSchema: res.data });
      return res.data;
    })
    .catch(err => {
      console.error(err);
      return err;
    });
  }

  initializeSchema = jsonFile => {
    axios.get(`${this.state.url}/${jsonFile}/`,)
    .then(res => {
      console.log(res.data);
      this.setState({ fhirSchema: res.data });
      return res.data;
    })
    .catch(err => {
      console.log("uh oh", err);
    });
  }

  onChange = e => {
    console.log(e.formData);
    this.setState({formData: e.formData});
  }

  onSubmit = e => {
    console.log("Just submitted some data");
    console.log(e.formData);
  }

// =============================================================================
  getConditionOptions = () => {
    const options = ["diabetes", "pregnancy"]; // Just two random exmaples
    return options;
  }

  addCondition = () => {
    const jsonFile = "condition"; // probably makes sense to make this a parameter
    axios.get(`${this.state.url}/${jsonFile}/`,)
    .then(res => {
      const condition = res.data;

      // This manipulates the object from `condition.schema.json`
      // If you re-structure that object (which you probably will want to do)
      // modify this code. 
      let fhirSchema = _.cloneDeep(this.state.fhirSchema);
      if (!_.keysIn(this.state.fhirSchema.properties).includes(condition.key)) { // if the key "condition" doesn't exist in the object
        const conditionProp = { // Make one
          "condition": {
            "title": "Conditions",
            "type": "object",
            "properties": { }
          }
        };
        fhirSchema.required.push("condition"); // and make sure it's required
        _.merge(fhirSchema.properties, conditionProp);
      }
      const newID = _.uniqueId(_.head(_.keysIn(condition))); // Because all conditions are bundled under one key, they need unique ids. `_.head(_.keysIn(condition))` could just be hard-coded as `condition`.
      let newCondition = { };
      newCondition[newID] = condition.condition;
      newCondition[newID].enum = this.getConditionOptions(); // actually build out the object
      _.merge(fhirSchema.properties.condition.properties, newCondition); // and add it to condition's properties


      this.setState({fhirSchema});
    })
    .catch(err => {
      console.log(`There was an error reading the file ${jsonFile}.schema.json`, err);
    });
  }

// =============================================================================

  render() {
    console.log(this.state.fhirSchema)
    return (
      <div>
        <hr>
        </hr>
          <Form schema={this.state.fhirSchema || {}} // The schema is the actual schema
            formData={this.state.formData || {}} // If the form re-renders, all data is lost unless this is passed in. See `onChange()`
            onChange={this.onChange}
            onSubmit={this.onSubmit}
          />
        <button
          onClick={e => this.addCondition(e)}>
          Add another Condition?
        </button>
      </div>
    );
  }
}

export default SchemaGenerator;
