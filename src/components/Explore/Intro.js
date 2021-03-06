import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import classNames from 'classnames';

import DummySearchBox from './DummySearchBox';
import IntroHeading from './IntroHeading';

const introContainerStyle = {
  marginBottom: '12em',
  backgroundColor: 'rgba(13, 22, 38, 0.7)'
};

class Intro extends Component {
  render() {
    const { searchPhrase } = this.props;
    const introContainerClasses = classNames({
      'd-none': searchPhrase !== ''
    });
    return (
      <Container className={introContainerClasses}>
        <Row>
          <Col
            style={introContainerStyle}
            xs={12}
            sm={11}
            md={9}
            lg={6}
            className="py-3 px-4"
          >
            <IntroHeading />
            <DummySearchBox />
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = store => ({
  searchPhrase: store.LocationSearchBoxReducer.value
});

export default connect(mapStateToProps)(Intro);
