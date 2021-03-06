import React, { Component } from 'react';
import StoriesList from './PendingApprovalStories';
import ViewAndApproveStory from './StoryDetails';
import { Card, Row, CardHeader, CardBody, Col } from 'reactstrap';

import '../../styles/ApproveIndex.css';

class AdminHome extends Component {
  render() {
    return (
      <Card>
        <CardHeader className="admin-panel-header">
          <Col>Stories To Be Approved </Col>
        </CardHeader>
        <CardBody>
          <Row>
            <Col className="border-right">
              <StoriesList />
            </Col>
            <Col className="border-right overflow">
              <ViewAndApproveStory />
            </Col>
          </Row>
        </CardBody>
      </Card>
    );
  }
}

export default AdminHome;
