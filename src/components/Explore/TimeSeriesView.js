import React, { Component } from 'react';
import axios from 'axios/index';
import { connect } from 'react-redux';
import _ from 'lodash';

import TimeSeriesChart from './TimeSeriesChart';
import { TRUTHTREE_URI } from '../../constants';

class TimeSeriesView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      data: [],
      currentLevel: null,
      info: [],
      temp: [],
      dataReal: [],
      locationIds: [],
      lineColors: [
        'red',
        'purple',
        'green',
        'blue',
        'deeppink',
        'orange',
        'navy',
        'olive',
        'lime',
        'indianred',
        'dimgrey'
      ]
    };
    this.fetchResponse = this.fetchResponse.bind(this);
    this.formatResponse = this.formatResponse.bind(this);
    this.initializeYearMap = this.initializeYearMap.bind(this);
    this.fetchLocations = this.fetchLocations.bind(this);
  }

  componentDidMount() {
    const len = this.props.selectedAttributes.length;
    if (len !== 0) {
      this.fetchLocations();
    }
  }

  componentWillReceiveProps() {
    const len = this.props.selectedAttributes.length;
    if (len !== 0) {
      this.fetchLocations();
    }
  }

  fetchLocations() {
    let minPopulation = 0;
    let maxPopulation = 0;
    let locationIds = [];
    let year = this.props.yearSelected ? this.props.yearSelected : 2016;
    console.log('In fetch locations');

    axios
      .get(
        `${TRUTHTREE_URI}/api/population?locationId=` +
          this.props.id +
          '&year=' +
          year
      )
      .then(response => {
        let population = response.data.population;
        maxPopulation = Math.floor(
          population + (this.props.populationRange[1] / 100) * population
        );
        minPopulation = Math.floor(
          population + (this.props.populationRange[0] / 100) * population
        );
        return axios
          .get(
            `${TRUTHTREE_URI}/api/states?populationRange=` +
              minPopulation +
              ',' +
              maxPopulation
          )
          .then(response => {
            _.map(response.data, obj => {
              locationIds.push(obj.id);
            });
            this.setState({ locationIds: locationIds });
            console.log('Location Ids are:');
            console.log(locationIds);
            console.log(
              `${TRUTHTREE_URI}/api/population?locationId=` +
                this.state.locationIds +
                '&year=' +
                year
            );
            this.fetchResponse();
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        console.log(error);
      });
  }

  fetchResponse() {
    let temp = [];
    let info = [];
    let url =
      `${TRUTHTREE_URI}/api/attributes?locationIds=` +
      this.state.locationIds +
      '&attributeIds=' +
      this.props.selectedAttributes[this.props.index][0];
    console.log(url);
    console.log('Selected attributes');
    console.log(this.props.selectedAttributes);
    axios
      .get(url)
      .then(response => {
        console.log(response);
        this.formatResponse(response);
      })
      .catch(error => {
        console.log(error);
      });
  }

  formatResponse(response) {
    console.log('In format response');
    console.log(response);
    let data = [];
    let locations = [];
    let map = {};
    response.data.map(dataForEachLocation => {
      let location = {};
      console.log('data for each location');
      console.log(dataForEachLocation);
      dataForEachLocation.attributes.map(attributesForEachLocation => {
        console.log('attribute for each location');
        console.log(attributesForEachLocation);
        attributesForEachLocation.data.map(attrValue => {
          let val = map[attributesForEachLocation.attribute_id];
          if (val === undefined) {
            val = this.initializeYearMap();
          }
          let da = val[attrValue.year - 1967];
          if (
            da[dataForEachLocation.location_id] === 0 ||
            da[dataForEachLocation.location_id] === undefined
          ) {
            val[attrValue.year - 1967][dataForEachLocation.location_id] =
              attrValue.value;
          }
          map[attributesForEachLocation.attribute_id] = val;
        });
        location['id'] = dataForEachLocation.location_id;
        let select = this.state.lineColors[Math.floor(Math.random() * 11)];
        console.log(select);
        location['color'] = select;
        location['name'] = dataForEachLocation.location_id;
        locations.push(location);
        console.log(location);
      });
    });
    console.log(map);
    data.push(map);
    console.log('after map push to data');
    this.setState({ data: data, locations: locations });
  }

  initializeYearMap() {
    console.log('in initialize year map');
    let yearArr = [];
    for (let i = 1967; i < 2017; i++) {
      let yearEntry = { year: i };
      yearArr.push(yearEntry);
    }
    console.log('year array is ');
    console.log(yearArr);
    return yearArr;
  }

  render() {
    const len = this.props.selectedAttributes.length;

    if (len === 0) {
      return <div>Select an attribute</div>;
    } else {
      return this.state.data.map((attrData, i) => {
        return (
          <TimeSeriesChart
            data={attrData[this.props.selectedAttributes[this.props.index][i]]}
            attributeName={this.props.selectedAttributes[this.props.index][1]}
            locations={this.state.locations}
            condition={this.props.condition}
          />
        );
      });
    }
  }
}

const mapState = state => ({
  selectedAttributes: state.SelectedAttributeReducer.selectedAttributes,
  year: state.YearSelectorReducer.yearSelected,
  populationRange: state.AttributeRangeReducer.populationRange
});
export default connect(mapState)(TimeSeriesView);
