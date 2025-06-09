import React from 'react';
import { connect, history } from 'umi';
import { Row, Col, Typography, Image, Divider } from 'antd';
import { Column } from '@ant-design/plots';
import logoDark from '../../../assets/logo_dark.png';
import * as moment from 'moment';

const PDF_FILE = ({ values,
  equipemetCategoryTotal,
  equipemetCategory,
  savedCO2,
  remarketRecycled,
  consumedco2,
  totalConsumeCo2,
  totalSavedCo2 }) => {
  const { Title, Paragraph } = Typography;

  let equp = [
    { type: 'computer', value: 123 },
    { type: 'computer', value: 123 },
    { type: 'computer', value: 123 },
  ]
  const pieconfig = {
    data: equp || [],
    // isGroup: true,
    xField: 'type',
    yField: 'value',
    // color: '#1f6956',
    // xAxis: {
    //   line: { style: { lineWidth: 0 } },
    //   tickLine: { style: { lineWidth: 0 } },

    //   label: {
    //     style: {
    //       fontSize: 10,
    //       fontWeight: 600,
    //     },
    //     autoRotate: true,
    //     autoHide: false,
    //   },
    // },
    label: {
      position: 'middle',
      style: {
        fill: '#000000',
        fontSize: 10,
        fontWeight: 900,
      },
      content: (originData) => {
        console.log("originData.value", originData.value)
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
    // columnWidthRatio: 0.8,
    // minColumnWidth: 60,
    // maxColumnWidth: 80,
    // autoFit: true,
    // appendPadding: [17, 0, 0, 0],
    // color: '#456A76',
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
        fill: '#FFFFFF',
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
    <>
      <div className="env_report1" style={{ width: "100%", margin: "0 auto", background: '#FFFFFF' }}>
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
                    <Image preview={false} src="../static/logo.afa4f1c3.png" alt="logo" width={100} />
                  </div>

                </Col>
              </Row>
            </div>
          </div>

        </div >
        {/* page2 */}
        <div style={{ paddingTop: 60, paddingBottom: 60, width: "90%", margin: "0 auto", backgroundColor: '#FFFFFF' }}>
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
                <div style={{ height: 250, padding: 0, backgroundColor: '#FFFFFF' }}>
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
              <Col lg={14} md={14} sm={14} xs={14} style={{ textAlign: "center", backgroundColor: '#FFFFFF' }}>
                <Title style={{ fontSize: 18, fontWeight: 500, color: "#25614e" }}>Remarketed or Recycled</Title>
                <div style={{ height: 230, padding: 0, backgroundColor: '#FFFFFF' }}>
                  <Column {...config} />
                </div>
              </Col>
            </Row>
          </div>
        </div >
      </div>
    </>
  );
};

export default PDF_FILE;
