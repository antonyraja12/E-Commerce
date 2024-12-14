import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb, Flex } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { breadcrumbRender } from '../../helpers/constants';

const Adam = () => {
    const breadcrumbItem = [
        {
          path: "/",
          title: "Home",
        },
        {
          title: "Adam",
        },
      ];
    return (
        <div style={{padding:"1rem 5rem 0px"}}>
            {/* <Flex justify='start'><Link to="/"><HomeOutlined /></Link></Flex> */}
            <Breadcrumb
                items={breadcrumbItem}
                itemRender={breadcrumbRender}
              />
            <br/>
            <div style={{
                position: 'relative',
                width: '100%',
                height: 0,
                paddingBottom: '56.25%', /* Aspect ratio: 16:9 */
            }} className="embed-container">
                <iframe
                    title="Q&A Feature"
                    src="https://app.powerbi.com/reportEmbed?reportId=20928694-a707-4a24-9200-559cd2bb8e3f&autoAuth=true&ctid=cdbb4300-add1-4a07-ab31-8cd6fc0fb3c2"
                    frameBorder="0"
                    allowFullScreen="true"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                    }}
                ></iframe>
            </div>
        </div>
    );
};

export default Adam;
