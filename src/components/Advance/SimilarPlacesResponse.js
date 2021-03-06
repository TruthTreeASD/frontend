import React, { Component } from 'react';
import { connect } from 'react-redux';
import USAMap from './USAMap';
import { ListGroup, ListGroupItem, Container, Row, Col } from 'reactstrap';
// import MapCode from "./MapCode";

const SimilarLocationsList = ({ locations }) => (
  <ListGroup>
    {locations.map((location, idx) => (
      <ListGroupItem key={idx} className="text-truncate">
        <span className="text-secondary py-2">{location.name}</span>
      </ListGroupItem>
    ))}
  </ListGroup>
);

class SimilarPlacesResponse extends Component {
  render() {
    return (
      <Container fluid>
        {this.props.locations.length !== 0 && (
          <div style={{ paddingTop: '25px' }}>
            <hr />
            <Row>
              <h4 className="text-secondary py-3">
                We have found these locations which are similar to your location
                of interest!
              </h4>
            </Row>
            <Row>
              <Col md={9} sm={12} className="pl-md-0">
                <USAMap />
              </Col>
              <Col md={3} sm={12} className="pr-md-0">
                <SimilarLocationsList locations={this.props.locations} />
                <small className="float-right text-secondary">
                  {' '}
                  * In descending order of similarity{' '}
                </small>
              </Col>
            </Row>
          </div>
        )}
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    locations: state.SimilarLocationsReducer.locations
  };
};

export default connect(mapStateToProps)(SimilarPlacesResponse);
