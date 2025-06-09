import React from 'react';
import { connect, history } from 'umi';
import { Row, Col, Typography, Image, Divider } from 'antd';
import { Column } from '@ant-design/plots';
import logoDark from '../../../assets/logo_dark.png';
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
    let partner_logo = values?.partner?.partner_logo?.id ? `${APIPREFIX}/assets/${values.partner.partner_logo.id}?access_token=${getAccessToken()}` : logoDark;

    const pieconfig = {
      data: equipemetCategory || [],
      // isGroup: true,
      xField: 'type',
      yField: 'value',
      color: '#1f6956',
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
        position: 'top',
        style: {
          fill: '#000000',
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
    const config = {
      data: remarketRecycled || [],
      isGroup: true,
      xField: 'type',
      yField: 'value',
      seriesField: 'name',
      groupField: 'name',
      // cField: 'name',
      color: ['#1f6956', '#41c49c'],
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
        position: 'top',
        style: {
          fill: '#000000',
          fontSize: 10,
          fontWeight: 900,
        },
        content: (originData) => {
          return `${(originData.value)}`;
        },
      },
      style: {
        inset: 4,
      },
      columnWidthRatio: 0.4,
      // minColumnWidth: 20,
      // maxColumnWidth: 20,
      autoFit: true,
      appendPadding: [17, 0, 0, 0],
    };

    const Co2config = {
      data: savedCO2,
      xField: 'type',
      yField: 'value',
      seriesField: 'type',
      isStack: true,
      color: '#1f6956',
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
        position: 'top',
        style: {
          fill: '#000000',
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
      data: consumedco2,
      // width: 100,
      xField: 'type',
      yField: 'value',
      seriesField: 'type',
      legend: {
        position: 'top-left',
      },
      isStack: true,
      color: '#1f6956',
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
        position: 'top',
        style: {
          fill: '#000000',
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
      <div className="env_report" style={{ width: "100%", margin: "0 auto", background: '#FFFFFF' }}>
        <div style={{ paddingBottom: 20 }} className={"bgfirst"}>
          {/* <div style={{ width: "98%", margin: "0 auto" }} >
            <Row>
              <Col lg={18} md={16} sm={16} style={{ textAlign: 'center', paddingTop: 50 }}>
              </Col>
              <Col lg={6} md={8} sm={8} className={"content1"}>

              </Col>
            </Row>
          </div> */}
          <div className="container">
            <div className={"center"} style={{ width: "100%", minHeight: "300px", backgroundColor: "#b4b4b4", }} >
              <Row>
                <Col>
                  <Title style={{ fontSize: 40, fontWeight: 600, color: "#fff" }}> Environmental Report</Title>
                  <Title style={{ fontSize: 20, fontWeight: 500, color: "#25614e" }}>{values?.client ? values.client.client_name : ''}</Title>
                </Col>
              </Row>
            </div>
            <div className={"center2"} style={{ width: "100%", margin: "0 auto", background: '#FFFFFF' }} >
              <Row>
                <Col lg={16} md={16} sm={16} xs={16} style={{ textAlign: 'center', paddingTop: 50 }}>
                  <Title style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.8, color: "#8c8c8c", letterSpacing: 0.5 }}>This environmental report contains environmental<br />information and data regarding project <span className="fw-bolder">{values?.id ? values.id : ''}</span></Title>
                </Col>
                <Col lg={8} md={8} sm={8} xs={8} className={"content"}>
                  <div style={{ paddingRight: 10 }}>
                    <Title style={{ fontSize: 16, fontWeight: 600, marginTop: 30, marginBottom: 30, color: "#fff" }}> Content</Title>
                    <Paragraph className={"points"}>-  Project units & category</Paragraph >
                    <Paragraph className={"points"}>-  Remarketing & recycling</Paragraph >
                    <Paragraph className={"points"}>-  CO2 saved</Paragraph >
                    <Paragraph className={"points"}>-  CO2 consumed</Paragraph >
                    <Paragraph className={"points"}>-  Environmental certificate</Paragraph >
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <Image preview={false} src={partner_logo} alt="logo" width={100} />
                  </div>

                </Col>
              </Row>
            </div>
          </div>

        </div >
        {/* page2 */}
        <div style={{ paddingTop: 60, paddingBottom: 60, width: "90%", margin: "0 auto" }}>
          <div >
            <Row style={{ backgroundColor: "#25614e" }}>
              <Col>
                <Title className={"environment"}> ENVIRONMENTAL ACCOUNTING</Title>
              </Col>
            </Row>
          </div>
          <div>
            <Row>
              <Col lg={24} style={{ paddingTop: 20 }}>
                <Paragraph className={"text-para"}>The main purpose of environmental reporting is to transparently account for the project's CO2 emissions.</Paragraph>
                <Paragraph className={"text-para"} >We calculate the environmental impact in two different ways. Firstly, by assessing how much CO2 is saved by reusing your equipment compared to purchasing new equipment. Secondly, by calculating the amount of CO2 consumed during your use of the equipment.</Paragraph>
              </Col>
            </Row>
          </div>
          <div style={{ paddingTop: 20 }}>
            <Row>
              <Col lg={10} md={10} sm={10} xs={10}>
                <div style={{ backgroundColor: "#b4b4b4", marginBottom: 5 }}>
                  <Title className={"environment"}> AMOUNT OF EQUIPMENT PER CATEGORY</Title>
                </div>
                <Paragraph className={"text-para"}>The total number of units in this project is distributed based on category, as visualized in the diagram to the right.</Paragraph>
                <Paragraph className={"text-para"}>All equipment capable of storing information has been wiped using software or shredded.</Paragraph>
              </Col>
              <Col lg={14} md={14} sm={14} xs={14} style={{ textAlign: "center", backgroundColor: '#FFFFFF' }}>
                <Title style={{ fontSize: 18, fontWeight: 500, color: "#25614e" }}>Equipment Per Category</Title>
                <div style={{ height: 250, padding: 0 }}>
                  {/* {printView && <Funnel {...pieconfig} />} */}
                  <Column {...pieconfig} />

                </div>
              </Col>
            </Row>
          </div>
          <div style={{ paddingTop: 50 }}>
            <Row>
              <Col lg={10} md={10} sm={10} xs={10}>
                <div style={{ backgroundColor: "#b4b4b4", marginBottom: 20 }}>
                  <Title className={"environment"}> REMARKETING & RECYCLING</Title>
                </div>
                <Paragraph className={"text-para"}>The condition of each individual unit determines whether it is either remarketed or recycled. The quantity of remarketed and recycled units per category is presented on the right.</Paragraph>
                <Paragraph className={"text-para"}>With your approval, we always aim to remarket the equipment for both environmental and economic reasons.</Paragraph>
                <Paragraph className={"text-para"}>The equipment that has been recycled has been handled in an environmentally friendly manner in accordance with laws and regulations.</Paragraph>
              </Col>
              <Col lg={14} md={14} sm={14} xs={14} style={{ textAlign: "center" }}>
                <Title style={{ fontSize: 18, fontWeight: 500, color: "#25614e" }}>Remarketed or Recycled</Title>
                <div style={{ height: 230, padding: 0 }}>
                  <Column {...config} />
                </div>
              </Col>
            </Row>
          </div>
        </div >
        {/* page3 */}
        <div style={{ paddingTop: 100, width: "90%", margin: "0 auto" }}>
          <Row>
            <Col lg={10} md={10} sm={10} xs={10}>
              <div style={{ backgroundColor: "#b4b4b4", marginBottom: 20 }}>
                <Title className={"environment"}> CO2 SAVED</Title>
              </div>
              <Paragraph className={"text-para"}>By reusing the equipment, we have been able to reduce environmental impact by  <span className="fw-bolder">{totalSavedCo2}</span> kg CO2.</Paragraph>
              <Divider />
              <Title style={{ fontSize: 18, fontWeight: 500, color: "#25614e" }}>CO2 SAVED PER CATEGORY</Title>
              <Paragraph className={"text-para"}>We always strive to remarket  equipment in cases where it is environmentally and economically justifiable. The graph to the right shows the proportion of CO2 saved per category based on the amount of remarketing and recycling.</Paragraph>
            </Col>
            <Col lg={14} md={14} sm={14} xs={14} style={{ textAlign: "center" }}>
              <Title style={{ fontSize: 18, fontWeight: 500, color: "#25614e" }}>Saved CO2</Title>
              <div style={{ height: 260 }}>
                <Column {...Co2config} />
              </div>
            </Col>
          </Row>
          <div style={{ paddingTop: 50 }}>
            <Row>
              <Col lg={10} md={10} sm={10} xl={10} xs={10}>
                <div style={{ backgroundColor: "#b4b4b4", marginBottom: 20 }}>
                  <Title className={"environment"}> CONSUMED CO2 BECAUSE OF USE</Title>
                </div>
                <Paragraph className={"text-para"}>The amount of CO2 consumed depends on how long the equipment has been used and its condition. Equipment that can be remarketed is calculated as having consumed 50% of the carbon dioxide needed for its production. This is based on the knowledge that the equipment can be used for at least one more operational phase. Therefore, equipment that cannot be remarketed has consumed 100% of the carbon dioxide needed for its production.</Paragraph>
                <Paragraph className={"text-para"}>The amount of carbon dioxide needed for production is sorted by equipment category and presented in the graph on the right.</Paragraph>
                <Paragraph className={"text-para"}>The total carbon dioxide consumption in this report is <span className="fw-bolder">-{totalConsumeCo2}</span> kg CO2.</Paragraph>
              </Col>
              <Col lg={12} md={14} sm={14} xs={14} style={{ textAlign: "center" }}>
                <Title style={{ fontSize: 18, fontWeight: 500, color: "#25614e" }}>Consumed CO2</Title>
                <div style={{ height: 260 }}>
                  <Column {...Consumedconfig} />
                </div>
              </Col>
            </Row>
          </div>
        </div >
        {/* page4 */}
        <div style={{ paddingTop: 340, width: "96%", margin: "0 auto" }} className={"bg"}>
          <div className={"center"} style={{ minHeight: "100px" }} >
            <Row>
              <Col>
                <Title style={{ fontSize: 22, fontWeight: 600, color: "#fff", paddingBottom: 10 }}> Environmental Certificate</Title>
              </Col>
            </Row>
          </div>
          <div >
            <Row>
              <Col lg={24} md={24} sm={24} xs={24} style={{ textAlign: 'center', paddingTop: 10 }}>
                <Title style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.8, color: "#000", letterSpacing: 0.5 }}>This certificate is presented to</Title>
                <Title style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.8, color: "#25614e", letterSpacing: 0.5 }}>{values?.client ? values.client.client_name : ''}</Title>
                <div style={{ maxWidth: 550, margin: "0 auto" }}>
                  <Paragraph className={"text-para"}>We have managed project number <span className="fw-bolder">{values?.id ? values.id : ''}</span> on your behalf. The equipment is reused or recycled depending on its quality and condition.</Paragraph>
                  <Paragraph className={"text-para"}>All units in the project have been evaluated based on their condition and market value, and have been de-identified and wiped.</Paragraph>
                  <Paragraph className={"text-para"}>We hereby certify that we have managed your IT equipment with the utmost emphasis on safety and environmental friendliness.</Paragraph>
                </div>
              </Col>
            </Row>
          </div>
          <div style={{ paddingTop: 80 }}>
            <Row>
              <Col lg={8} md={8} sm={8} xs={8} >
                <Paragraph italic className={"borderbottom"} style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.8, color: "#25614e", letterSpacing: 0.5, textAlign: "end", marginBottom: 10 }}>{values?.partner_contact_name ? values?.partner_contact_name : values?.partner_contact_attn ? values.partner_contact_attn?.first_name : ''}</Paragraph>
                <Paragraph style={{ fontSize: 16, lineHeight: 1.8, textAlign: "end" }}>{moment().format("YYYY-MM-DD")}</Paragraph>
              </Col>
            </Row>
          </div>
          <div className={"bottomlogo"}>
            <Image preview={false} src={partner_logo} alt="logo" width={100} />
          </div>
        </div >

      </div>);
  }
}

export default connect(({ user, loading }) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(ComponentToPrint);
