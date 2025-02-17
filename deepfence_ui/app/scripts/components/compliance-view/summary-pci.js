import React from 'react';
import { connect } from 'react-redux';
import HostReportContainer from './host-report-container';
import ComplianceTotalTestReportContainer from './total-test-report-container';
import injectModalTrigger from '../common/generic-modal/modal-trigger-hoc';
import { getComplianceChartDataAction  } from '../../actions';
import { dateTimeFormat } from '../../utils/time-utils';

const testValueConfigCloud = [
  {
    display: 'Alarm',
    value: 'alarm',
  },
  {
    display: 'Info',
    value: 'info',
  },
  {
    display: 'Ok',
    value: 'ok',
  },
  {
    display: 'Skip',
    value: 'skip',
  },
];

const testValueConfigHosts = [
  {
    display: 'Info',
    value: 'info',
  },
  {
    display: 'Note',
    value: 'note',
  },
  {
    display: 'Pass',
    value: 'pass',
  },
  {
    display: 'Warn',
    value: 'warn',
  },
];
class PCISummary extends React.PureComponent {

  componentDidMount() {
    const cloudType = window.location.hash.split('/').reverse()[3];
    const checkType = window.location.hash.split('/').reverse()[0];
    const nodeId = window.location.hash.split('/').reverse()[2];
    this.props.dispatch(getComplianceChartDataAction({nodeId, checkType, cloudType}));
  }

  render() {
    const {
      location: urlLocation,
    } = this.props;
    const cloudType = window.location.hash.split('/').reverse()[3];
    let scanType = '';
    if(cloudType === 'aws' || cloudType === 'azure' || cloudType === 'gcp') {
      scanType = 'cloud'
    }
    else if(cloudType === 'kubernetes' || cloudType === 'linux') {
      scanType = 'host'
    }
    const data =this.props.chartData?.compliance_scan_status[0]|| [];
    const scanTimeStamp = data && data.time_stamp;
    return (
      <div>
        <div className="chart-wrapper top-wrapper">
          <div className="chart-heading">
            <h4>Compliance tests</h4>
            <h5>Overview of the overall compliance</h5>
          </div>
          {scanTimeStamp !== undefined &&
            <div style={{display: 'flex', flexDirection: 'row-reverse', paddingTop: '23px'}}>Last scanned on {dateTimeFormat(scanTimeStamp)}</div>
          }
          <div className="report">
            <div className="total-test-report">
              <ComplianceTotalTestReportContainer
                checkType="pci"
                nodeId={this.props.match.params.nodeid}
              />
            </div>
          </div>
        </div>
        <div className="chart-wrapper table-wrapper">
        {
            scanType === 'cloud' &&
            <div className="table relative">
              <HostReportContainer
                nodeId={this.props.match.params.nodeid}
                checkType="pci"
                testValueConfig={testValueConfigCloud}
                urlLocation={urlLocation}
              />
            </div>
          }
          {
            scanType === 'host' &&
            <div className="table relative">
              <HostReportContainer
                nodeId={this.props.match.params.nodeid}
                checkType="pci"
                testValueConfig={testValueConfigHosts}
                urlLocation={urlLocation}
              />
            </div>
          }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    chartData: state.get('compliance_chart_data')
  };
}

export default connect(mapStateToProps)(injectModalTrigger(PCISummary));
