import { Drawer, Tabs, Checkbox } from 'antd';

import React, {useState} from 'react'
import 'antd/dist/antd.css'

const { TabPane } = Tabs;

const Sidebar = () => {
    const [active, setActive] = useState('1')

    return (
        <Drawer
        
        width={active !== '1' ? 740: 320}
            visible
            mask={false}
            title="Basic Drawer"
            placement="right"
            closable={false}
        >
    <Tabs defaultActiveKey="1" onChange={key => setActive(key)}>
    <TabPane tab="Interview Questions" key="1">
        <p><b>We came up with this list of questions that you should ask to get a good understanding of the candidate. Please make sure to ask each of them.</b></p>
        <p><Checkbox>Tell me about yourself</Checkbox></p>
      <p><Checkbox>
     Why are you interested in this position?
        </Checkbox></p>
     <p><Checkbox>
      What skills do you think are needed to be successful in the role?`
      </Checkbox></p>

      <p><Checkbox>What are your biggest strengths?</Checkbox></p>
     
      <p><Checkbox>What questions do you have for me?</Checkbox></p>
    </TabPane>
    <TabPane tab="View Documents" key="2">
    <Tabs defaultActiveKey="3" onChange={key => setActive(key)}>
 
    <TabPane tab="View Resume" key="3">
      <img src='https://www.opencolleges.edu.au/oca3-prod/careers/resume/img/resume-lucie-1.jpg'></img>
    </TabPane>
    <TabPane tab="View Recruiter Summary" key="4">
  Summary
    </TabPane>
    <TabPane tab="View Test Scores" key="4">
  Summary
    </TabPane>

  </Tabs>
    </TabPane>

 
  </Tabs>,
        </Drawer>)
}

export default Sidebar