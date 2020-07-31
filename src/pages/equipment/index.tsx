import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Spin, Input } from 'antd';
import styles from './index.less';
import TableEditRow from './TableEditRow';
const { TextArea } = Input;
export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  return (
    <PageHeaderWrapper content="设备列表" className={styles.main}>
      <TableEditRow />
      <div className={styles.startPage}>
        <div>
          <Spin spinning={loading} size="large" />
        </div>
      </div>
    </PageHeaderWrapper>
  );
};
