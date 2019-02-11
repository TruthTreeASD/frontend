import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import '../styles/Home.css';

import DisplayComponent from './DisplayComponent';
import LeftSideBar from './LeftSideBar';
import YearSelector from './YearSelector';
import Filters from './AttributeRange';

class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Row className="flex-grow-1 flex-shrink-1">
        <LeftSideBar />
        <div className="col-12 col-md-10 align-items-center">
          <DisplayComponent
            level={this.props.match.params.level}
            id={this.props.match.params.id}
          />
          <Row className="align-items-center">
            <Col sm={{ size: 6, order: 1, offset: 1 }}>
              <Filters
                level={this.props.match.params.level}
                location={this.props.match.params.name}
                locationId={this.props.match.params.id}
              />
            </Col>
            <Col sm={{ size: 4, order: 2, offset: 0 }}>
              <YearSelector />
            </Col>
          </Row>
        </div>
      </Row>
    );
  }
}
const mapState = state => ({
  dimension: state.FilterByReducer.dimension
});

export default connect(mapState)(Home);
