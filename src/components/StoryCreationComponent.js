import React, { Component } from 'react';
import '../styles/LeftSideBar.css';
import _ from 'lodash';
import axios from 'axios';
import { connect } from 'react-redux';
import { confirmAlert } from 'react-confirm-alert';

import { TRUTHTREE_URI } from '../constants';
import { withRouter } from 'react-router-dom';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Col, Row } from 'reactstrap';

import '../styles/AttributeDeselector.css';

class StoryCreationComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      selectedAttributes: [],
      authorField: '',
      titleField: '',
      tagsInputValue: '',
      tagsField: [],
      storyField: '',
      storyMaxLength: 1000
    };
    // Set initial state of each collection to false
  }

  componentDidMount() {
    this.setState({ isLoaded: true });
    /* axios
           .get(
             `${TRUTHTREE_URI}/api/collections?locationId=` + //382026003
               this.props.match.params.id // +&year=2016
           )
           .then(response => {
             //data contains the variables
             this.setState({
               sidebarData: response.data,
               isLoaded: true
             });
           })
           .catch(error => {
             console.log(error);
           });*/
  }

  componentWillReceiveProps(nextProps) {
    //    this.setState({ tagsField: nextProps.selectedAttributes });
    //    console.log(this.state.tagsField)
  }

  handleChangeAuthor = event => {
    let author = event.target.value.toLowerCase();
    author = author.replace('\\', '');
    author = author.replace('*', '');
    this.setState({ authorField: author });
  };

  handleChangeTitle = event => {
    let title = event.target.value.toLowerCase();
    title = title.replace('\\', '');
    title = title.replace('*', '');
    this.setState({ titleField: title });
  };

  handleChangeTags = event => {
    console.log(this.state.tagsField);
    let tag = event.target.value.toLowerCase();
    tag = tag.replace('\\', '');
    tag = tag.replace('*', '');
    if (_.endsWith(tag, ' ')) {
      let newArr = this.state.tagsField;
      newArr.push(tag);
      this.setState({
        selectedAttributes: newArr
      });
      console.log(this.state.tagsField);
    }
  };

  handleChangeStory = event => {
    let story = event.target.value.toLowerCase();
    story = story.replace('\\', '');
    story = story.replace('*', '');
    this.setState({ storyField: story });
  };

  submitForm() {
    if (this.state.storyField.length > this.state.storyMaxLength) {
      confirmAlert({
        title: 'Error!',
        message: 'Story text is too long.',
        buttons: [
          {
            label: 'OK'
          }
        ]
      });
      return;
    } else if (this.state.titleField.length < 1) {
      confirmAlert({
        title: 'Error!',
        message: 'Please enter a story title.',
        buttons: [
          {
            label: 'OK'
          }
        ]
      });
      return;
    } else {
      axios
        .post(`${TRUTHTREE_URI}/api/stories`, {
          author: this.state.authorField,
          tags: this.state.tagsField,
          content: this.state.storyField
        })
        .then(function(response) {
          console.log('saved successfully' + response);
        }); /*
        this.props.dispatch({
            type: 'CLOSE_STORY',
            value: false
        });*/
      confirmAlert({
        title: 'Story submitted!',
        message: 'Story is now pending review.',
        buttons: [
          {
            label: 'Continue.'
          }
        ]
      });
    }
  }
  /*
    deselectAttribute(attribute) {
        let newArr = this.state.selectedAttributes;
        let id = attribute[0];
        for (let i = 0; i < newArr.length; i++) {
            if (newArr[i][0] === id) {
                _.remove(newArr, elem => {
                    return elem === newArr[i];
                });
                this.setState({
                    selectedAttributes: newArr
                });
                this.props.dispatch({
                    type: 'CHANGE_ATTRIBUTE',
                    value: newArr
                });
                return;
            }
        }
    }
    */
  render() {
    if (this.state.isLoaded) {
      return (
        <div>
          <p>Tell us what you found!</p>
          <input
            className="form-control"
            data-spy="affix"
            data-offset-top="197"
            //id="attribute-search-box"
            onChange={this.handleChangeAuthor}
            placeholder="Author Name"
          />
          <br />
          <input
            className="form-control"
            data-spy="affix"
            data-offset-top="197"
            //id="attribute-search-box"
            onChange={this.handleChangeTitle}
            placeholder="Story Title"
          />
          <br />
          <input
            className="form-control"
            data-spy="affix"
            data-offset-top="197"
            // id="attribute-search-box"
            //onChange={this.handleChangeSearch}
            placeholder="Tags"
          />
          <Row>
            <Col xs="auto" className="filters">
              Selected Tags:
            </Col>
            <Col>
              {Object.keys(this.state.tagsField).map((attributes, i) => {
                return (
                  <button
                    className="btn btn-light selected-attribute-button"
                    /* onClick={() =>
                                                    this.deselectAttribute(this.state.selectedAttributes[i])
                                                }*/
                  >
                    <i
                      className="fa fa-times"
                      style={{ paddingRight: '10px' }}
                    />
                    {this.state.tagsField[i][2]}-{this.state.tagsField[i][1]}
                  </button>
                );
              })}
            </Col>
          </Row>
          <br />
          <textarea
            className="form-control"
            rows="5"
            data-spy="affix"
            data-offset-top="197"
            //id="attribute-search-box"
            onChange={this.handleChangeStory}
            placeholder="Story"
          />
          Story length: {this.state.storyField.length} /
          {this.state.storyMaxLength}
          <br />
          <button
            className="btn btn-light selected-attribute-button"
            onClick={() => this.submitForm()}
          >
            <i className="fa" />
            SUBMIT STORY
          </button>
        </div>
      );
    } else {
      return <div>THIS SECTION HAS BEEN DISABLED</div>;
    }
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({ dispatch });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(StoryCreationComponent));
