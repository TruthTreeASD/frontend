import React, { Component } from 'react';
import '../styles/LeftSideBar.css';
import _ from 'lodash';
import axios from 'axios';
import { connect } from 'react-redux';
//import { Grid } from 'react-virtualized';
import { TRUTHTREE_URI } from '../constants';
import { withRouter } from 'react-router-dom';
import configureStore from '../store';

class LeftSideBar extends Component {
  constructor(props) {
    super(props);
    //   /api/collections?level=state
    this.state = {
      sidebarData: [],
      isLoaded: false,
      selectedAttributes: [],
      collapsedLeft: false,
      searchedString: ''
    };
    // Set initial state of each collection to false
    Object.keys(this.state.sidebarData).map(key => (this.state[key] = false));
    Object.keys(this.state.sidebarData).map(key =>
      Object.keys(this.state.sidebarData[key]).map(
        attrKey => (this.state.sidebarData[key][attrKey] = false)
      )
    );
  } /*
  // each of these will need a diff api
  componentWillReceiveProps(nextProps) {
      let year = nextProps.year;
      axios
          .get(`${TRUTHTREE_URI}/api/collections?locationId=` + //382026003
              this.props.match.params.id+this.props.year)
        .then(response => {
          //data contains the variables
          this.setState({
            sidebarData: response.data,
            isLoaded: true
          });
        })
        .catch(error => {
          console.log(error);
        });
    } 
  }*/

  componentDidMount() {
    console.log(this.props.match.params.id);
    axios
      .get(
        `${TRUTHTREE_URI}/api/collections?locationId=` + //382026003
          this.props.match.params.id // +&year=2016
      )
      .then(response => {
        //data contains the variables
        this.setState({
          sidebarData: response.data.data,
          isLoaded: true
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  // Toggle state of each collection on click
  handleClickCollection = collection => {
    console.log('Clicked!!', collection, this.state[collection]);
    this.setState({ [collection]: !this.state[collection] });
  };

  // stores attribute selected
  handleClickAttribute(collection, attribute) {
    //this is getting called twice
    //if clicking on the slider.

    this.setState({
      [[collection][attribute]]: !this.state.sidebarData[collection][attribute]
    });
    console.log(this.state[collection][attribute]);
    let newArr = this.state.selectedAttributes;
    for (let i = 0; i < newArr.length; i++) {
      if (newArr[i][0] === attribute.property_id) {
        _.remove(newArr, elem => {
          return elem === newArr[i];
        });
        this.setState({
          selectedAttributes: newArr
        });
        console.log(this.props);
        this.props.dispatch({
          type: 'CHANGE_ATTRIBUTE',
          value: newArr
        });
        return;
      }
    }
    newArr.push([attribute.property_id, attribute.name]);

    this.setState({
      selectedAttributes: newArr
    });
    this.props.dispatch({
      type: 'CHANGE_ATTRIBUTE',
      value: newArr
    });

    //this.setState({ [attribute]: !this.state[attribute] });
  }

  collapseLeftBar() {
    console.log('Clicked hi');
    this.setState({ collapsedLeft: !this.state.collapsedLeft });
    this.setState({ searchedString: '' });
  }

  handleChangeSearch = event => {
    console.log(event.target.value);
    this.setState({ searchedString: event.target.value.toLowerCase() });
    if (this.state.searchedString == '') {
    }
  };

  renderSearchTerm = collection => {
    if (
      this.state.searchedString == '' ||
      this.state.sidebarData[collection].name
        .toLowerCase()
        .search(this.state.searchedString) > -1
    ) {
      return true;
    }
    var attr;
    for (attr in this.state.sidebarData[collection].properties) {
      if (
        this.state.sidebarData[collection].properties[attr].name
          .toLowerCase()
          .search(this.state.searchedString) > -1
      ) {
        console.log(
          'found attribute in search' +
            this.state.sidebarData[collection].properties[attr].name
        );
        return true;
      }
    }

    return false;
  };

  render() {
    var { isLoaded } = this.state;
    if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      if (this.state.collapsedLeft) {
        return (
          <button
            className="col-md-flex d-md-flex"
            onClick={() => this.collapseLeftBar()}
          >
            {!this.state.collapsedLeft ? 'Hide Left Nav' : 'Show'}
          </button>
        );
      } else {
        return (
          <nav className="scrollLeftBar col-md-2 d-none d-md-block bg-dark sidebar">
            <input
              className="leftSearch"
              data-spy="affix"
              data-offset-top="197" //trying to make search box stay top
              id="attribute-search-box"
              onChange={this.handleChangeSearch}
              placeholder="Search for a property"
            />
            <button
              className="float-right"
              onClick={() => this.collapseLeftBar()}
            >
              {!this.state.collapsedLeft ? 'Hide' : 'Show Left Nav'}
            </button>
            <div
              style={{
                display: !this.state.collapsedLeft ? 'block' : 'none'
              }}
            >
              {Object.keys(this.state.sidebarData).map((collection, i) => {
                if (this.renderSearchTerm(collection)) {
                  return (
                    <div key={i}>
                      <button
                        className="accordion"
                        onClick={() => this.handleClickCollection(collection)}
                      >
                        {this.state.sidebarData[collection].name}
                      </button>

                      <div
                        style={{
                          display: this.state[collection] ? 'block' : 'none'
                        }}
                      >
                        {Object.keys(
                          this.state.sidebarData[collection].properties
                        ).map((attr, i) => {
                          return (
                            <label
                              key={i}
                              className="panel float-right"
                              style={{
                                background: this.state.sidebarData[collection][
                                  attr
                                ]
                                  ? 'orange'
                                  : 'lightsteelblue'
                              }}
                            >
                              <div>
                                {
                                  this.state.sidebarData[collection].properties[
                                    attr
                                  ].name
                                }
                                <div
                                  className="switch float-right"
                                  onClick={() =>
                                    this.handleClickAttribute(
                                      collection,
                                      this.state.sidebarData[collection]
                                        .properties[attr]
                                    )
                                  }
                                >
                                  <input type="checkbox" />
                                  <span
                                    className="slider round"
                                    style={
                                      {
                                        //display: !this.state.collapsedLeft ? 'block' : 'none'
                                      }
                                    }
                                  />
                                </div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </nav>
        );
      }
    }
  }
}

const mapStateToProps = state => ({
  selectedAttributes: state.SelectedAttributeReducer
});

const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LeftSideBar));
