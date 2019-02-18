import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import TimeSeries from '../Explore/TimeSeries';

class Trending extends Component {
  render() {
    return (
      <Container fluid>
        <Row>
          <TimeSeries />
          <Col>Trending topics</Col>
        </Row>
      </Container>
    );
  }
}

export default Trending;
