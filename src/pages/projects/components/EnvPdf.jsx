import React from 'react';
import { connect, history } from 'umi';
import { Row, Col, Typography, Image, Divider } from 'antd';
import { Column } from '@ant-design/plots';
import itreon_logo_grey from '../../../assets/itreon_logo_grey.png';
import itreon_logo_bg from '../../../assets/itreon_logo_bg.png';

import * as moment from 'moment';
import { getAccessToken } from '@/utils/authority';
import { APIPREFIX } from '../../../utils/constants';

class ComponentToPrint extends React.Component {
  constructor(props) {
    super(props);
  }

  render(props) {
    const { Title, Paragraph } = Typography;
    const { values,
      equipemetCategoryTotal,
      equipemetCategory,
      savedCO2,
      remarketRecycled,
      consumedco2,
      totalConsumeCo2,
      totalSavedCo2
    } = this.props;
    let partner_logo = values?.partner?.partner_logo?.id ? `${APIPREFIX}/assets/${values.partner.partner_logo.id}?access_token=${getAccessToken()}` : null;

    const pieconfig = {
      data: equipemetCategory || [],
      // isGroup: true,
      xField: 'type',
      yField: 'value',
      color: '#004750',
      xAxis: {
        label: {
          style: {
            fontSize: 10,
            fontWeight: 600,
          },
          autoRotate: true,
          autoHide: false,
        },
      },
      label: {
        text: 'value',
        textBaseline: 'bottom',
        position: 'inside',
        style: {
          fill: '#ab8135',
          fontSize: 10,
          fontWeight: 900,
        },
        content: (originData) => {
          // console.log("originData.value", originData.value)
          return `${originData.value}; ${Math.round((Number(originData.value) / equipemetCategoryTotal) * 100)}%`;
        },
      },
      yAxis: {
        label: {
          style: {
            // fill: 'black',
            fontSize: 10,
            fontWeight: 600,
          },
          offset: 15,
          formatter: (text) => {
            return `${(text)}`;
          },
        },
      },
      columnWidthRatio: 0.8,
      minColumnWidth: 60,
      maxColumnWidth: 80,
      autoFit: true,
      appendPadding: [17, 0, 0, 0],
      // color: ['#000000', '#e3e3e3'],
    };

    const remarketConfog = {
      data: remarketRecycled || [],
      isGroup: true,
      xField: 'type',
      yField: 'value',
      seriesField: 'name',
      groupField: 'type',
      // cField: 'type',
      isStack: true,
      colorField: 'name',
      legend: { position: 'bottom' },
      color: ['#004750', '#BBC6C3'],
      label: {
        text: 'value',
        textBaseline: 'bottom',
        position: 'inside',
        // layout: [
        //   {
        //     type: "interval-adjust-position"
        //   },
        //   {
        //     type: "adjust-color"
        //   }
        // ]
      },
      xAxis: {
        label: {
          style: {
            fontSize: 10,
            fontWeight: 600,
          },
          autoRotate: true,
          autoHide: false,
        },
      },
      label: {
        position: 'inside',
        style: {
          fill: '#ab8135',
          fontSize: 12,
          fontWeight: 900,
        },
        content: (originData) => {
          return `${(originData.value)}`;
        },
      },
      interaction: {
        elementHighlightByColor: {
          link: true,
        },
      },
      state: {
        active: { linkFill: 'rgba(0,0,0,0.25)', stroke: 'black', lineWidth: 0.5 },
        inactive: { opacity: 0.5 },
      },
      // style: {
      //   inset: 4,
      // },
      // columnWidthRatio: 0.4,
      // // minColumnWidth: 20,
      // // maxColumnWidth: 20,
      // autoFit: true,
      appendPadding: [17, 0, 0, 0],
    };

    const Co2config = {
      data: savedCO2 || [],
      xField: 'type',
      yField: 'value',
      seriesField: 'type',
      isStack: true,
      color: ['#004750', '#BBC6C3', '#ab8135', '#02292e'],
      legend: false,

      xAxis: {
        label: {
          style: {
            fontSize: 10,
            fontWeight: 600,
            appendPadding: 10
          },
          autoRotate: true,
          autoHide: false,
        },

      },
      label: {
        text: 'value',
        textBaseline: 'bottom',
        position: 'inside',
        position: 'top',
        style: {
          fill: '#ab8135',
          fontSize: 10,
          fontWeight: 700,
        },
        content: (originData) => {
          return `${(originData.value)}`;
        },
      },
      tooltip: false,
      interactions: [
        {
          type: 'element-highlight-by-color',
        },
        {
          type: 'element-link',
        },
      ],
      columnWidthRatio: 0.8,
      minColumnWidth: 60,
      maxColumnWidth: 80,
      autoFit: true,
      appendPadding: [17, 0, 0, 0],
    };

    const Consumedconfig = {
      data: consumedco2 || [],
      // width: 100,
      xField: 'type',
      yField: 'value',
      seriesField: 'type',
      legend: {
        position: 'top-left',
      },
      isStack: true,
      color: ['#004750', '#BBC6C3', '#ab8135', '#02292e'],
      xAxis: {
        label: {
          style: {
            fontSize: 10,
            fontWeight: 600,
            appendPadding: 10
          },
          autoRotate: true,
          autoHide: false,
        },

      },
      legend: false,

      label: {
        text: 'value',
        textBaseline: 'bottom',
        position: 'inside',
        position: 'top',
        style: {
          fill: '#ab8135',
          fontSize: 10,
          fontWeight: 900,
        },
        content: (originData) => {
          return `-${(originData.value)}`;
        },
      },
      interactions: [
        {
          type: 'element-highlight-by-color',
        },
        {
          type: 'element-link',
        },
      ],
      columnWidthRatio: 0.8,
      minColumnWidth: 60,
      maxColumnWidth: 80,
      autoFit: true,
      appendPadding: [17, 0, 0, 0],
    };

    return (
      <div className="env_report2" style={{ width: "100%", margin: "0 auto", background: '#FFFFFF' }}>
        <div style={{ paddingBottom: 20 }} className={"bgfirst"}>
          <div className={"center"} >
            <Row>
              <Col style={{ paddingTop: 120 }}>
                <Image preview={false} src={partner_logo ? partner_logo : itreon_logo_bg} alt="logo" width={520} />
                {/* <Title className="header-text"> MINIMIZE WATE - MAXIMIZE VALUE</Title> */}
                <Title className={"header-1"}> Environmental Report</Title>
                <Title className={'text-para1 header-text-top'}> This environmental report contains environmental information and data regarding project <br />{values?.id ? values.id : ''}</Title>
                {partner_logo && <Image style={{ paddingTop: 100 }} preview={false} src={partner_logo} alt="logo" width={200} />}

              </Col>
            </Row>
            <div className="footer">
              <Title style={{ fontSize: 20, color: "#004750", paddingTop: 20 }}> CONTENT</Title>
              <Title className={'text-para footer-comp-text1'}> Environmental accounting, Amount of equipment per category, Remarketing & recycling, CO2 emissions from usage, Saved CO2 , Certificate</Title>
            </div>
          </div>
        </div >
        {/* page2 */}
        <div style={{ paddingTop: 16, paddingBottom: 50, width: "90%", margin: "0 auto" }}>
          <div className="img-container">
            <Image preview={false} src={partner_logo ? partner_logo : itreon_logo_grey} alt="logo" height={50} width={120} />
          </div>

          <div >
            <Row >
              <Col>
                <Title className={"environment environment1"}>ENVIRONMENTAL ACCOUNTING</Title>
              </Col>
            </Row>
          </div>
          <div>
            <Row>
              <Col lg={24} style={{ paddingTop: 15 }}>
                <Paragraph className={"text-para"}>The main purpose of environmental reporting is to transparently account for the project's CO2 emissions.</Paragraph>
                <Paragraph className={"text-para"} >We calculate the environmental impact in two different ways. Firstly, by assessing how much CO2 is saved by reusing your equipment compared to purchasing new equipment. Secondly, by calculating the amount of CO2 consumed during your use of the equipment.</Paragraph>
              </Col>
            </Row>
          </div>
          <div style={{ paddingTop: 15 }}>

            <Row>
              <Col lg={12} md={12} sm={12} xs={12}>
                <div>
                  <Title className={"environment"}>1.1 Amount of equipment per category</Title>
                </div>
                <Paragraph className={"text-para"}>The total number of units in this project is distributed based on category, as visualized in the graph to the right.</Paragraph>
                {/* <Paragraph className={"text-para"}>All equipment capable of storing information has been wiped using software or shredded.</Paragraph> */}
              </Col>
              <Col lg={12} md={12} sm={12} xs={12} style={{ textAlign: "center", backgroundColor: '#FFFFFF' }}>
                <Title className={"environment"} >Units per category</Title>
                <div style={{ height: 250, padding: 0 }}>
                  <Column {...pieconfig} />
                </div>
              </Col>
            </Row>
          </div>
          <div style={{ paddingTop: 2, paddingBottom: partner_logo ? 65 : 50 }}>

            <Row>
              <Col lg={12} md={12} sm={12} xs={12}>
                <div style={{ marginBottom: 20 }}>
                  <Title className={"environment"}>2.1 Remarketing & Recycling</Title>
                </div>
                <Paragraph className={"text-para"}>The condition of each individual unit determines whether it is either remarketed or recycled. The quantity of remarketed and recycled units per category is presented on the right.</Paragraph>
                <Paragraph className={"text-para"}>We always aim to remarket over recycle for both environmental and economic reasons.</Paragraph>
                <Paragraph className={"text-para"}>The equipment that has been recycled has been handled in an environmentally friendly manner in accordance with laws and regulations.</Paragraph>
              </Col>
              <Col lg={12} xs={12} xs={12} xs={12} style={{ textAlign: "center" }}>
                <Title className={"environment"}>Remarketed vs Recycled</Title>
                <div style={{ height: 230, padding: 0 }}>
                  <Column {...remarketConfog} />
                </div>
              </Col>
            </Row>
          </div>
          <div className="footer1">
            {
              !values?.partner?.partner_logo?.id ? <>
                <Title className={"footer-comp-text"}>info@itreon.se</Title>
                <Title className={"footer-comp-text"}>Gustavslundsvägen 147,167 51 Bromma</Title>
                <Title className={"footer-comp-text"}>www.itreon.se</Title>
                <div style={{ clear: "both" }}></div>
              </> : <Title className={"footer-comp-text"}></Title>
            }
          </div>
        </div >
        {/* page3 */}
        <div style={{ paddingTop: 15, width: "90%", margin: "0 auto" }}>
          <div className="img-container">
            <Image preview={false} src={partner_logo ? partner_logo : itreon_logo_grey} alt="logo" height={50} width={120} />
          </div>
          <Row>
            <Col lg={12} md={12} sm={12} xl={12} xs={12}>
              <div style={{ marginBottom: 6 }}>
                <Title className={"environment"}>3.1 CO2 emissions from usage</Title>
              </div>
              <Paragraph className={"text-para"}>CO2 emissions depend on how long the equipment has been used and its condition. Equipment that can be remarketed is calculated as having consumed 50% of the carbon dioxide needed for its production. This is based on the knowledge that the equipment can be used for at least one more operational phase. Therefore, equipment that cannot be remarketed has consumed 100% of the carbon dioxide needed for its production.</Paragraph>
              <Paragraph className={"text-para"}>The amount of carbon dioxide needed forproduction is sorted by equipment category and presented in the graph on the right.</Paragraph>
              <Paragraph className={"text-para"}>The CO2 emissions from usage amounts to <span className="fw-bolder">-{totalConsumeCo2}</span> kg CO2.</Paragraph>
            </Col>
            <Col lg={12} xs={12} xs={12} xs={12} style={{ textAlign: "center" }}>
              <Title className={"environment"}>Consumed CO2</Title>
              <div style={{ height: 260 }}>
                <Column {...Consumedconfig} />
              </div>
            </Col>
          </Row>
          <div style={{ paddingTop: 1, paddingBottom: 60 }}>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12}>
                <div style={{ marginBottom: 10 }}>
                  <Title className={"environment"}>4.1 Saved CO2</Title>
                </div>
                <Paragraph className={"text-para"}>We always strive to remarket equipment in cases where it is environmentally and economically justifiable. The graph to the right shows the amount of CO2 saved per category.</Paragraph>
                <Paragraph className={"text-para"}>By reusing the equipment, this project has prevented the emission of  <span className="fw-bolder">{totalSavedCo2}</span> kg CO2.</Paragraph>
                <Divider style={{ width: 10, fontSize: 20 }} />
                <Title className={"environment"}>4.2 CO2 SAVED PER CATEGORY</Title>
                <Paragraph className={"text-para"}>The graph to the right shows the amount of CO2 saved per category.</Paragraph>
              </Col>
              <Col lg={12} xs={12} xs={12} xs={12} style={{ textAlign: "center" }}>
                <Title className={"environment"}>Saved CO2</Title>
                <div style={{ height: 260 }}>
                  <Column {...Co2config} />
                </div>
              </Col>
            </Row>
          </div>
          <div className="footer1">
            {
              !values?.partner?.partner_logo?.id ? <>
                <Title className={"footer-comp-text"}>info@itreon.se</Title>
                <Title className={"footer-comp-text"}>Gustavslundsvägen 147,167 51 Bromma</Title>
                <Title className={"footer-comp-text"}>www.itreon.se</Title>
              </> : <Title className={"footer-comp-text"}></Title>
            }
          </div>
        </div >
        {/* page4 */}
        <div>
          <div style={{ paddingBottom: 20 }} className={"bgfirst"}>
            <div className={"center"} >
              <Row>
                <Col style={{ paddingTop: 60 }}>
                  <Title style={{ fontSize: 30, color: "#004750", paddingTop: 20 }}>Environmental certificate</Title>
                  <Title className={"certificate-text"} > This certificate is presented to</Title>
                  <Title className={"certificate-text comp-name"}> {values?.client ? values.client.client_name : ''}</Title>
                  <Title className={"certificate-text"}> We have managed project number {values?.id ? values.id : ''} on your behalf. The equipment is reused or recycled depending on its quality and condition.</Title>
                  <Title className={"certificate-text"}>All units in the project have been evaluated based on their condition and market value and have been de-identified and wiped.</Title>
                  <Title className={"certificate-text"}> We hereby certify that we have managed your IT equipment with the utmost emphasis on safety and environmental friendliness.</Title>
                </Col>
              </Row>
              <div style={{ paddingTop: 80 }}>
                <Row>
                  <Col lg={8} md={8} sm={8} xs={8} >
                    <Paragraph italic className={"borderbottom"} style={{ fontSize: 16, lineHeight: 1.8, color: "#25614e", letterSpacing: 0.5, textAlign: "end", marginBottom: 10 }}>{values?.partner_contact_name ? values?.partner_contact_name : values?.partner_contact_attn ? values.partner_contact_attn?.first_name : ''}</Paragraph>
                    <Paragraph style={{ fontSize: 16, lineHeight: 1.8, textAlign: "end", color: '#ab8135' }}>{moment().format("YYYY-MM-DD")}</Paragraph>
                  </Col>
                </Row>
              </div>
            </div>
          </div >
        </div >

      </div >);
  }
}

export default connect(({ user, loading }) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(ComponentToPrint);
